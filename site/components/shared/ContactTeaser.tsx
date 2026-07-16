"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, ChatCircleDots, ChatText, PhoneCall } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { buildWhatsAppHref, SITE_CONTACT, toTelHref } from "@/features/site/data/contact";
import { HOMEPAGE_CONTACT_CONTENT } from "@/features/site/data/homepage";
import {
  trackContactSubmission,
  trackSiteCtaClick,
} from "@/lib/analytics/siteEvents";
import { fadeUp } from "@/lib/helpers/motion";

export function ContactTeaser() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const directActions = HOMEPAGE_CONTACT_CONTENT.directActions.map((action) => ({
    ...action,
    href:
      action.type === "whatsapp"
        ? buildWhatsAppHref("Need a direct workspace response for my project brief.")
        : toTelHref(SITE_CONTACT.supportPhone),
    icon: action.type === "whatsapp" ? ChatCircleDots : PhoneCall,
    external: action.type === "whatsapp",
  }));

  const hasContactChannel = email.trim().length > 0 || phone.trim().length > 0;
  const showContactInvalid = formStatus.type === "error" && !hasContactChannel;
  const showConsentInvalid = formStatus.type === "error" && !consent;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!consent) {
      setFormStatus({
        type: "error",
        message: "Confirm privacy consent before sending.",
      });
      return;
    }

    if (!trimmedEmail && !trimmedPhone) {
      setFormStatus({
        type: "error",
        message: "Please add a phone number or email so we can reach you.",
      });
      return;
    }

    const preferredContact =
      trimmedEmail && trimmedPhone ? "any" : trimmedEmail ? "email" : "phone";

    const payload = {
      name: name.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      message: `${brief.trim()}\nCity: ${city.trim()}`,
      requirement: "Workspace planning",
      preferredContact,
      source: "homepage-quick-brief",
      sourcePath: window.location.pathname,
    };

    setIsSubmitting(true);
    setFormStatus({ type: "idle", message: "" });
    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit now.");
      }

      setName("");
      setCity("");
      setPhone("");
      setEmail("");
      setBrief("");
      setConsent(false);
      trackContactSubmission({
        pathname: window.location.pathname,
        surface: "contact-teaser",
        source: "homepage-quick-brief",
        status: "success",
      });
      setFormStatus({ type: "success", message: "Brief received. Our team will contact you shortly." });
    } catch (error) {
      trackContactSubmission({
        pathname: window.location.pathname,
        surface: "contact-teaser",
        source: "homepage-quick-brief",
        status: "error",
      });
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="home-section home-section--soft border-t border-theme-soft section-y-sm scroll-mt-24"
    >
      <div className="home-shell-xl">
        <div className="contact-teaser contact-teaser__shell">
          <div className="contact-teaser__layout grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(13.75rem,2fr)_minmax(0,3fr)] md:gap-6">
            <motion.div className="contact-teaser__intro" {...fadeUp(12, 0.06)}>
              <h2 className="typ-subsection-title max-w-xl">
                {HOMEPAGE_CONTACT_CONTENT.titleLead} {HOMEPAGE_CONTACT_CONTENT.titleAccent}
              </h2>
              <p className="page-copy mt-5 max-w-xl text-muted">
                {HOMEPAGE_CONTACT_CONTENT.subtitle}
              </p>
            </motion.div>

            <motion.form
              aria-label="Project brief enquiry"
              className="contact-teaser__form"
              onSubmit={handleSubmit}
              {...fadeUp(16, 0.14)}
            >
              <div className="contact-teaser__mini-grid grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="contact-teaser__field" htmlFor="contact-teaser-name">
                  <span className="contact-teaser__field-label typ-body-sm text-muted">Name</span>
                  <input
                    id="contact-teaser-name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="contact-teaser__input"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={180}
                    placeholder="Your name"
                  />
                </label>
                <label className="contact-teaser__field" htmlFor="contact-teaser-city">
                  <span className="contact-teaser__field-label typ-body-sm text-muted">City</span>
                  <input
                    id="contact-teaser-city"
                    name="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="contact-teaser__input"
                    type="text"
                    autoComplete="address-level2"
                    required
                    maxLength={120}
                    placeholder="Project city"
                  />
                </label>
                <label className="contact-teaser__field" htmlFor="contact-teaser-phone">
                  <span className="contact-teaser__field-label typ-body-sm text-muted">Phone</span>
                  <input
                    id="contact-teaser-phone"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="contact-teaser__input"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={50}
                    placeholder="+91 …"
                    aria-invalid={showContactInvalid || undefined}
                    aria-describedby={
                      showContactInvalid
                        ? "contact-teaser-status"
                        : "contact-teaser-channel-hint"
                    }
                  />
                </label>
                <label className="contact-teaser__field" htmlFor="contact-teaser-email">
                  <span className="contact-teaser__field-label typ-body-sm text-muted">Email</span>
                  <input
                    id="contact-teaser-email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="contact-teaser__input"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={180}
                    placeholder="you@company.com"
                    aria-invalid={showContactInvalid || undefined}
                    aria-describedby={
                      showContactInvalid
                        ? "contact-teaser-status"
                        : "contact-teaser-channel-hint"
                    }
                  />
                </label>
              </div>
              <p id="contact-teaser-channel-hint" className="contact-teaser__hint typ-body-sm text-muted">
                Phone or email — at least one is required.
              </p>

              <label className="contact-teaser__field contact-teaser__field--brief" htmlFor="contact-teaser-brief">
                <div className="flex items-center justify-between gap-2">
                  <span className="contact-teaser__field-label typ-body-sm text-muted">Brief</span>
                  <span className="typ-body-sm text-muted" aria-live="polite" aria-atomic="true">
                    {brief.length}/5000
                  </span>
                </div>
                <textarea
                  id="contact-teaser-brief"
                  name="brief"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  className="contact-teaser__input contact-teaser__input--textarea"
                  rows={2}
                  required
                  maxLength={5000}
                  placeholder="Team size, scope, or timeline — optional detail helps."
                />
              </label>

              <label
                htmlFor="contact-teaser-consent"
                className="contact-teaser__field flex items-start gap-3 font-normal"
              >
                <input
                  id="contact-teaser-consent"
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  required
                  aria-required="true"
                  aria-invalid={showConsentInvalid || undefined}
                  aria-describedby={
                    showConsentInvalid ? "contact-teaser-status" : "contact-teaser-consent-hint"
                  }
                  data-testid="contact-teaser-consent"
                />
                <span>
                  I agree that One&Only may use these details to respond to my enquiry.{" "}
                  <a href="/privacy" className="font-semibold text-primary hover:text-primary-hover">
                    Privacy policy
                  </a>
                  <span className="text-primary"> *</span>
                </span>
              </label>
              <p id="contact-teaser-consent-hint" className="contact-teaser__hint typ-body-sm text-muted">
                Required to send. We do not sell contact data.
              </p>

              <div className="contact-teaser__cta-stack">
                <button
                  type="submit"
                  disabled={isSubmitting || !consent || !hasContactChannel}
                  className="btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ChatText size={16} weight="duotone" aria-hidden="true" />
                  {isSubmitting ? "Sending..." : "Send Brief"}
                </button>

                <div className="contact-teaser__support-row">
                  {directActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={action.external ? "noopener noreferrer" : undefined}
                        className={`contact-teaser__support-link typ-cta min-h-11${
                          action.type === "whatsapp" ? " contact-teaser__support-link--whatsapp" : ""
                        }`}
                        onClick={() =>
                          trackSiteCtaClick({
                            href: action.href,
                            label: action.label,
                            pathname: window.location.pathname,
                            surface: "contact-teaser",
                          })
                        }
                      >
                        <span className="contact-teaser__support-link-icon">
                          <Icon size={16} weight="duotone" aria-hidden="true" />
                        </span>
                        <span>{action.label}</span>
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {formStatus.type !== "idle" ? (
                <p
                  id="contact-teaser-status"
                  className={`contact-teaser__status contact-teaser__status--${formStatus.type}`}
                  role={formStatus.type === "error" ? "alert" : "status"}
                >
                  {formStatus.message}
                </p>
              ) : null}
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
