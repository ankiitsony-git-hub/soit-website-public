"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { siteContact } from "@lib/siteContact";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Name: required, max 100
    if (!name) {
      errors.name = "Name is required";
    } else if (name.length > 100) {
      errors.name = "Name cannot exceed 100 characters";
    }

    // Email: required, format, max 254
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email is invalid";
    } else if (email.length > 254) {
      errors.email = "Email cannot exceed 254 characters";
    }

    // Phone: optional, max 30
    if (phone && phone.length > 30) {
      errors.phone = "Phone number cannot exceed 30 characters";
    }

    // Subject: optional, max 100
    if (subject && subject.length > 100) {
      errors.subject = "Subject cannot exceed 100 characters";
    }

    // Message: required, min 5, max 5000
    if (!message) {
      errors.message = "Message is required";
    } else if (message.length < 5) {
      errors.message = "Message is too short (minimum 5 characters)";
    } else if (message.length > 5000) {
      errors.message = "Message cannot exceed 5000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setSubmitError(
          data?.message ||
            "Unable to send your message right now. Please try again.",
        );
        return;
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setFormErrors({});
    } catch {
      setSubmitError(
        "Unable to send your message right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-container mt-10 bg-gray-50">
      <div className="container mx-auto">
        <div className="mb-12 fade-up text-center">
          <h2
            className="
              mb-4 text-3xl font-bold text-primary
              md:text-4xl
            "
          >
            Contact Us
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Have questions about our programs or admissions? Reach out to us and
            we&apos;ll get back to you soon.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-accent"></div>
        </div>

        <div
          className="
            grid grid-cols-1 gap-8
            lg:grid-cols-2
          "
        >
          {/* Contact Information */}
          <div className="fade-up">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-6 text-2xl font-semibold text-primary">
                Get in Touch
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">{siteContact.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <a
                      href={`mailto:${siteContact.email}`}
                      className="text-gray-600 transition-colors hover:text-primary"
                    >
                      {siteContact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <a
                      href={siteContact.phoneLink}
                      className="text-gray-600 transition-colors hover:text-primary"
                    >
                      {siteContact.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="flex items-center font-medium text-gray-900">
                    <MapPin className="mr-2 size-5 text-primary" />
                    Location
                  </h4>
                  <a
                    href={siteContact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center text-sm text-primary transition-colors
                      hover:text-primary/80
                    "
                  >
                    <ExternalLink className="mr-1 size-4" />
                    Open in Google Maps
                  </a>
                </div>

                {/* Embed Map Iframe */}
                <div
                  className="
                    h-100 overflow-hidden rounded-lg bg-gray-200 shadow-inner
                  "
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={siteContact.mapsEmbedUrl}
                    title="SoIT RGPV Location"
                    className="size-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="fade-up" style={{ transitionDelay: "0.2s" }}>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-6 text-2xl font-semibold text-primary">
                Send a Message
              </h3>

              {submitSuccess ? (
                <div
                  className="
                    mb-6 rounded-lg border border-green-200 bg-green-50 px-4
                    py-3 text-green-700
                  "
                >
                  Thank you for your message! We&apos;ll get back to you soon.
                </div>
              ) : null}

              {submitError ? (
                <div
                  className="
                    mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3
                    text-red-700
                  "
                >
                  {submitError}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} noValidate>
                <div
                  className="
                    mb-4 grid grid-cols-1 gap-4
                    md:grid-cols-2
                  "
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        w-full rounded-lg border px-3 py-2
                        focus:ring-2 focus:ring-primary focus:outline-none
                        ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        }
                      `}
                      placeholder="Your full name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full rounded-lg border px-3 py-2
                        focus:ring-2 focus:ring-primary focus:outline-none
                        ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      `}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="
                    mb-4 grid grid-cols-1 gap-4
                    md:grid-cols-2
                  "
                >
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength={30}
                      value={formData.phone}
                      onChange={handleChange}
                      className={`
                        w-full rounded-lg border px-3 py-2
                        focus:ring-2 focus:ring-primary focus:outline-none
                        ${
                          formErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      `}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`
                        w-full rounded-lg border px-3 py-2
                        focus:ring-2 focus:ring-primary focus:outline-none
                        ${
                          formErrors.subject
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      `}
                    >
                      <option value="">Select a subject</option>
                      <option value="admissions">Admissions Inquiry</option>
                      <option value="programs">Program Information</option>
                      <option value="research">Research Opportunities</option>
                      <option value="general">General Question</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.subject && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    className={`
                      w-full rounded-lg border px-3 py-2
                      focus:ring-2 focus:ring-primary focus:outline-none
                      ${
                        formErrors.message
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                    placeholder="Please describe your inquiry or question..."
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div
                  className="
                    flex flex-col gap-4
                    md:flex-row
                  "
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      btn-primary flex flex-1 items-center justify-center
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 -ml-1 size-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
