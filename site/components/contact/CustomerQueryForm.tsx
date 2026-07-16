"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { usePathname } from "next/navigation";
import { CONTACT_FORM_CONTEXT_COPY } from "@/features/site/data/routeCopy";
import { trackContactSubmission } from "@/lib/analytics/siteEvents";

type PreferredContact = "any" | "email" | "whatsapp" | "phone";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  message: string;
};

type SubmitResult = {
  queryId: string;
  followUp: {
    email: string | null;
    whatsapp: string | null;
  };
};

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  preferredContact: "any",
  message: "",
};

const PRIMARY_QUOTE_PHONE_DISPLAY = "+91 98356 30940";
const PRIMARY_QUOTE_PHONE_LINK = "tel:+919835630940";

type CustomerQueryFormProps = {
  intent?: string | null;
  source?: string | null;
};

export function CustomerQueryForm({ intent, source }: CustomerQueryFormProps) {
  const pathname = usePathname();
  const [form, setForm] = useState<FormState>(initialState);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const contextCopy =
    intent === "quote" && source === "compare"
      ? CONTACT_FORM_CONTEXT_COPY.quote.compare
      : intent === "quote" && source === "quote-cart"
        ? CONTACT_FORM_CONTEXT_COPY.quote["quote-cart"]
        : null;
  const sourcePath = useMemo(() => {
    return contextCopy ? `${pathname}?intent=${intent}&source=${source}` : pathname;
  }, [contextCopy, intent, pathname, source]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.message.trim().length > 0 &&
      (form.email.trim().length > 0 || form.phone.trim().length > 0) &&
      consent
    );
  }, [consent, form]);

  useEffect(() => {
    if (!contextCopy) return;

    Promise.resolve().then(() => {
      setForm((current) =>
        current.message.trim().length > 0
          ? current
          : { ...current, message: contextCopy.seededMessage },
      );
    });
  }, [contextCopy]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!canSubmit) {
      if (!consent) {
        setError("Confirm privacy consent before sending.");
      } else {
        setError("Add name, message, and at least email or phone.");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requirement: contextCopy?.requirement,
          source: contextCopy ? `website-contact-${source}` : "website-contact",
          sourcePath,
        }),
      });

      const json = (await response.json()) as
        | { error?: string; queryId?: string; followUp?: SubmitResult["followUp"] }
        | undefined;

      if (!response.ok || !json?.queryId || !json.followUp) {
        trackContactSubmission({
          pathname,
          surface: "contact-page-form",
          source: contextCopy ? `website-contact-${source}` : "website-contact",
          status: "error",
        });
        setError(json?.error || "Unable to submit right now.");
        return;
      }

      trackContactSubmission({
        pathname,
        surface: "contact-page-form",
        source: contextCopy ? `website-contact-${source}` : "website-contact",
        status: "success",
      });
      setResult({ queryId: json.queryId, followUp: json.followUp });
      setForm(initialState);
      setConsent(false);
    } catch {
      trackContactSubmission({
        pathname,
        surface: "contact-page-form",
        source: contextCopy ? `website-contact-${source}` : "website-contact",
        status: "error",
      });
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasContactChannel =
    form.email.trim().length > 0 || form.phone.trim().length > 0;
  const showNameInvalid = Boolean(error) && form.name.trim().length === 0;
  const showMessageInvalid = Boolean(error) && form.message.trim().length === 0;
  const showContactInvalid = Boolean(error) && !hasContactChannel;
  const showConsentInvalid = Boolean(error) && !consent;

  return (
    <form
      className="contact-page-form"
      data-testid="contact-page-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {contextCopy ? (
        <div className="contact-form-context">
          <p className="typ-label text-brand">{contextCopy.eyebrow}</p>
          <p className="contact-form-context__title">{contextCopy.title}</p>
          <p className="contact-form-context__copy">{contextCopy.description}</p>
        </div>
      ) : null}
      <p className="contact-form-intro" id="contact-form-intro">
        Fields marked <span className="font-semibold text-primary">*</span> are required. Share
        either email or phone and we will respond within 1 business day.
      </p>
      <div className="contact-page-form__field">
        <label htmlFor="name" className="contact-form-label">
          Name <span className="text-primary">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="contact-form-input"
          required
          autoComplete="name"
          aria-required="true"
          aria-invalid={showNameInvalid || undefined}
          aria-describedby={showNameInvalid ? "contact-form-error" : "contact-form-intro"}
        />
      </div>
      <div className="contact-page-form__field">
        <label htmlFor="company" className="contact-form-label">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Company Name (optional)"
          value={form.company}
          onChange={(event) => setForm({ ...form, company: event.target.value })}
          className="contact-form-input"
          autoComplete="organization"
        />
      </div>
      <div className="contact-page-form__row">
        <div className="contact-page-form__field">
          <label htmlFor="email" className="contact-form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="contact-form-input"
            autoComplete="email"
            aria-invalid={showContactInvalid || undefined}
            aria-describedby={
              showContactInvalid ? "contact-form-error" : "contact-form-intro"
            }
          />
        </div>
        <div className="contact-page-form__field">
          <label htmlFor="phone" className="contact-form-label">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91..."
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="contact-form-input"
            autoComplete="tel"
            aria-invalid={showContactInvalid || undefined}
            aria-describedby={
              showContactInvalid ? "contact-form-error" : "contact-form-intro"
            }
          />
        </div>
      </div>
      <div className="contact-page-form__field">
        <label htmlFor="preferredContact" className="contact-form-label">
          Preferred Contact
        </label>
        <select
          id="preferredContact"
          name="preferredContact"
          value={form.preferredContact}
          onChange={(event) =>
            setForm({
              ...form,
              preferredContact: event.target.value as PreferredContact,
            })
          }
          className="contact-form-input"
        >
          <option value="any">Any</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Phone</option>
        </select>
      </div>
      <div className="contact-page-form__field">
        <label htmlFor="message" className="contact-form-label">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="What do you need for your workspace?"
          rows={4}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="contact-form-input"
          required
          aria-required="true"
          aria-invalid={showMessageInvalid || undefined}
          aria-describedby={showMessageInvalid ? "contact-form-error" : "contact-form-intro"}
        />
      </div>

      <div className="contact-page-form__field">
        <label
          htmlFor="contact-consent"
          className="contact-form-label flex items-start gap-3 font-normal"
        >
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
            required
            aria-required="true"
            aria-invalid={showConsentInvalid || undefined}
            aria-describedby={
              showConsentInvalid ? "contact-form-error" : "contact-consent-hint"
            }
            data-testid="contact-form-consent"
          />
          <span>
            I agree that One&Only may use these details to respond to my enquiry.{" "}
            <a href="/privacy" className="font-semibold text-primary hover:text-primary-hover">
              Privacy policy
            </a>
            <span className="text-primary"> *</span>
          </span>
        </label>
        <p id="contact-consent-hint" className="contact-form-intro">
          Required to send. We do not sell contact data.
        </p>
      </div>

      {error ? (
        <p id="contact-form-error" role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="contact-form-success" role="status">
          <p>
            Query submitted. Reference: <span className="font-medium">{result.queryId}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {result.followUp.email ? (
              <a href={result.followUp.email} className="contact-form-success__action">
                Reply by Email
              </a>
            ) : null}
            {result.followUp.whatsapp ? (
              <a
                href={result.followUp.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-form-success__action"
              >
                Reply on WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="contact-page-form__field">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="contact-form-submit"
        >
          {isSubmitting ? "Sending..." : "Send - we respond within 1 business day"}
        </button>
        <p className="contact-form-intro">
          Prefer to speak now?{" "}
          <a href={PRIMARY_QUOTE_PHONE_LINK} className="font-semibold text-primary hover:text-primary-hover">
            Call {PRIMARY_QUOTE_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
