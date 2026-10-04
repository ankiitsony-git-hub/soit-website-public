import nodemailer from "nodemailer";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  admissions: "Admissions Inquiry",
  programs: "Program Information",
  research: "Research Opportunities",
  general: "General Question",
  other: "Other",
};

export function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  return Boolean(host && user && pass);
}

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let transporterCreatedCount = 0;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  transporterCreatedCount++;
  console.log(
    `[SMTP POOL] Initializing pooled transporter singleton #${transporterCreatedCount} (host: ${host}:${port}, pool: true, maxConnections: 3)`
  );

  cachedTransporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactEmail(data: ContactFormData, reqId?: string) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP server is not configured.");
  }

  const user = process.env.SMTP_USER || "";
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "soit@rgpv.ac.in";

  const subjectLabel =
    (data.subject && SUBJECT_LABELS[data.subject]) ||
    data.subject ||
    "General Inquiry";

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "Not provided";
  const safeSubject = escapeHtml(subjectLabel);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

  const fromSender =
    process.env.SMTP_FROM || `"SOIT RGPV Website" <${user}>`;

  const textBody = [
    "New contact form inquiry received from SOIT RGPV website:",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Subject: ${subjectLabel}`,
    "",
    "Message:",
    data.message,
    "",
    "---",
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">New Contact Form Submission</h2>
      <p style="color: #4b5563; font-size: 14px;">A new inquiry was submitted via the SOIT RGPV website contact form.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; width: 120px; border-bottom: 1px solid #e5e7eb;">Name:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Email:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Phone:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${safePhone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Subject:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${safeSubject}</td>
        </tr>
      </table>

      <div style="margin-top: 20px;">
        <h3 style="color: #374151; font-size: 14px; margin-bottom: 8px;">Message:</h3>
        <div style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 4px; color: #1f2937; line-height: 1.6; font-size: 14px;">
          ${safeMessage}
        </div>
      </div>

      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
        This email was sent from the contact form on the SOIT RGPV website. You can reply directly to this email to contact ${safeName}.
      </div>
    </div>
  `;

  if (reqId) {
    console.log(`[CONTACT ${reqId}] Dispatching admin notification via pooled SMTP...`);
  }

  return transporter.sendMail({
    from: fromSender,
    to: adminEmail,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: `[SOIT Contact Form] ${subjectLabel} - from ${data.name}`,
    text: textBody,
    html: htmlBody,
  });
}

export async function sendContactAcknowledgement(
  data: ContactFormData,
  reqId?: string,
) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP server is not configured.");
  }

  const user = process.env.SMTP_USER || "";
  const subjectLabel =
    (data.subject && SUBJECT_LABELS[data.subject]) ||
    data.subject ||
    "General Inquiry";

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "Not provided";
  const safeSubject = escapeHtml(subjectLabel);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

  const fromSender = process.env.SMTP_FROM || `"SOIT RGPV" <${user}>`;

  const ackTextBody = [
    `Dear ${data.name},`,
    "",
    "Thank you for contacting the School of Information Technology, RGPV.",
    "",
    "We have successfully received your message. Our team will review your query and get back to you as soon as possible.",
    "",
    "Your submitted details:",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ? data.phone : "Not provided"}`,
    `Subject: ${subjectLabel}`,
    "Message:",
    data.message,
    "",
    "Please keep this email for your reference.",
    "",
    "Regards,",
    "School of Information Technology (SOIT)",
    "RGPV, Bhopal",
  ].join("\n");

  const ackHtmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #1e3a8a; margin: 0; font-size: 20px; font-weight: 700;">School of Information Technology (SOIT)</h2>
        <p style="color: #4b5563; margin: 4px 0 0 0; font-size: 13px;">Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="color: #1f2937; font-size: 15px; margin: 0 0 12px 0;">Dear ${safeName},</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
          Thank you for contacting the <strong>School of Information Technology, RGPV</strong>.
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
          We have successfully received your message. Our team will review your query and get back to you as soon as possible.
        </p>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="color: #1e3a8a; font-size: 15px; margin: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Your Submitted Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; width: 100px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Name:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Email:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Phone:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${safePhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background-color: #f9fafb; font-weight: 600; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Subject:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${safeSubject}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="color: #374151; font-size: 14px; margin-bottom: 8px;">Message:</h3>
        <div style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #1e3a8a; border-radius: 4px; color: #1f2937; line-height: 1.6; font-size: 14px;">
          ${safeMessage}
        </div>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin-top: 20px; margin-bottom: 24px;">
        Please keep this email for your reference.
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 13px; color: #4b5563; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;">Regards,</p>
        <p style="margin: 0; font-weight: 600; color: #1e3a8a;">School of Information Technology (SOIT)</p>
        <p style="margin: 0; color: #6b7280;">RGPV, Bhopal</p>
      </div>
    </div>
  `;

  if (reqId) {
    console.log(`[CONTACT ${reqId}] Dispatching visitor acknowledgement via pooled SMTP...`);
  }

  return transporter.sendMail({
    from: fromSender,
    to: data.email,
    subject: "We received your message – SOIT RGPV",
    text: ackTextBody,
    html: ackHtmlBody,
  });
}
