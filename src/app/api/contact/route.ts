import { NextResponse } from "next/server";
import {
  isSmtpConfigured,
  sendContactEmail,
  sendContactAcknowledgement,
} from "@/lib/mail";

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

// In-memory sliding-window rate limiter: max 10 valid submissions per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

let requestCounter = 0;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic pruning of expired entries
  if (rateLimitMap.size > 500) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 },
  );
}

export async function POST(request: Request) {
  const reqNumber = ++requestCounter;
  const reqId = `req_${reqNumber}_${Date.now().toString(36)}`;
  const apiStartTime = performance.now();

  console.log(`[CONTACT ${reqId}] request started`);

  let body: ContactRequestBody;
  const receiveStart = performance.now();
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    console.log(
      `[CONTACT ${reqId}] Invalid request payload (${(performance.now() - receiveStart).toFixed(2)}ms)`
    );
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 },
    );
  }

  // Server-side Validation timing
  const validationStart = performance.now();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) {
    return NextResponse.json(
      { success: false, message: "Name is required." },
      { status: 400 },
    );
  }
  if (name.length > 100) {
    return NextResponse.json(
      { success: false, message: "Name cannot exceed 100 characters." },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 254) {
    return NextResponse.json(
      { success: false, message: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (phone && phone.length > 30) {
    return NextResponse.json(
      { success: false, message: "Phone number is too long." },
      { status: 400 },
    );
  }

  if (subject && subject.length > 100) {
    return NextResponse.json(
      { success: false, message: "Subject is too long." },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { success: false, message: "Message is required." },
      { status: 400 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { success: false, message: "Message is too short (minimum 5 characters)." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { success: false, message: "Message cannot exceed 5000 characters." },
      { status: 400 },
    );
  }
  const validationDuration = performance.now() - validationStart;

  // Rate Limiting (applied to valid submissions)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const firstForwardedIp = forwardedFor ? forwardedFor.split(",")[0]?.trim() : undefined;
  const clientIp = firstForwardedIp || realIp || "unknown";

  if (!checkRateLimit(clientIp)) {
    console.log(`[CONTACT ${reqId}] Rate limit exceeded for client IP`);
    return NextResponse.json(
      {
        success: false,
        message: "Too many submissions. Please wait a few minutes before trying again.",
      },
      { status: 429 },
    );
  }

  if (!isSmtpConfigured()) {
    console.error(
      `[CONTACT ${reqId}] SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in environment variables.`
    );
    return NextResponse.json(
      {
        success: false,
        message: "Unable to send your message right now. Please try again.",
      },
      { status: 503 },
    );
  }

  // Concurrent email execution using Promise.allSettled for fault isolation
  const contactPayload = {
    name,
    email,
    phone: phone || undefined,
    subject: subject || undefined,
    message,
  };

  const adminEmailStart = performance.now();
  let adminEmailDuration = 0;
  const adminPromise = sendContactEmail(contactPayload, reqId)
    .then((res) => {
      adminEmailDuration = performance.now() - adminEmailStart;
      return res;
    })
    .catch((err) => {
      adminEmailDuration = performance.now() - adminEmailStart;
      throw err;
    });

  const userAckStart = performance.now();
  let userAckDuration = 0;
  const ackPromise = sendContactAcknowledgement(contactPayload, reqId)
    .then((res) => {
      userAckDuration = performance.now() - userAckStart;
      return res;
    })
    .catch((err) => {
      userAckDuration = performance.now() - userAckStart;
      throw err;
    });

  const [adminResult, ackResult] = await Promise.allSettled([
    adminPromise,
    ackPromise,
  ]);

  // Primary Reliability Check: Admin notification
  if (adminResult.status === "rejected") {
    const totalApiDuration = performance.now() - apiStartTime;
    console.error(
      `[CONTACT ${reqId}] Failed to deliver admin notification via SMTP in ${adminEmailDuration.toFixed(2)}ms:`,
      {
        error:
          adminResult.reason instanceof Error
            ? adminResult.reason.message
            : "Unknown error",
      }
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send your message right now. Please try again.",
      },
      { status: 500 },
    );
  }

  // Secondary Operation Check: User acknowledgement
  if (ackResult.status === "rejected") {
    console.error(
      `[CONTACT ${reqId}] Warning: Failed to deliver visitor acknowledgement email to ${email} in ${userAckDuration.toFixed(2)}ms:`,
      {
        error:
          ackResult.reason instanceof Error
            ? ackResult.reason.message
            : "Unknown error",
      }
    );
  } else {
    console.log(
      `[CONTACT ${reqId}] Acknowledgement email sent successfully to ${email} in ${userAckDuration.toFixed(2)}ms`
    );
  }

  const totalApiDuration = performance.now() - apiStartTime;
  console.log(`\n[CONTACT ${reqId}]`);
  console.log(`Validation: ${validationDuration.toFixed(2)} ms`);
  console.log(`Admin email: ${adminEmailDuration.toFixed(2)} ms`);
  console.log(`User acknowledgement: ${userAckDuration.toFixed(2)} ms`);
  console.log(`Total: ${totalApiDuration.toFixed(2)} ms\n`);

  return NextResponse.json({
    success: true,
    message: "Thank you for your message! We'll get back to you soon.",
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
