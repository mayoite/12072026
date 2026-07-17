import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";
import { trackContactSubmission } from "@/lib/analytics/siteEvents";
import { CONTACT_FORM_CONTEXT_COPY } from "@/features/site/data/routeCopy";

vi.mock("next/navigation", () => ({
  usePathname: () => "/contact",
}));

vi.mock("@/lib/analytics/siteEvents", () => ({
  trackContactSubmission: vi.fn(),
}));

function fillRequiredFields(options?: { channel?: "email" | "phone" }) {
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText(/Message/i), {
    target: { value: "I need a workstation" },
  });
  if (options?.channel === "phone") {
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "+919835630940" } });
  } else {
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
  }
  fireEvent.click(screen.getByTestId("contact-form-consent"));
}

describe("CustomerQueryForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders labeled fields with initial empty state", () => {
    render(<CustomerQueryForm />);

    expect(screen.getByLabelText(/^Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/^Company$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^Email$/i)).toHaveValue("");
    expect(screen.getByLabelText(/Phone/i)).toHaveValue("");
    expect(screen.getByLabelText(/Preferred Contact/i)).toHaveValue("any");
    expect(screen.getByLabelText(/^Message/i)).toHaveValue("");
    expect(screen.getByTestId("contact-form-consent")).not.toBeChecked();
    expect(screen.getByTestId("contact-form-submit")).toBeDisabled();
  });

  it("associates required labels with controls and privacy policy", () => {
    render(<CustomerQueryForm />);

    expect(screen.getByLabelText(/Name/i)).toHaveAttribute("id", "name");
    expect(screen.getByLabelText(/Message/i)).toHaveAttribute("id", "message");
    expect(screen.getByLabelText(/Preferred Contact/i)).toHaveAttribute(
      "id",
      "preferredContact",
    );
    expect(screen.getByTestId("contact-form-consent")).toHaveAttribute(
      "id",
      "contact-consent",
    );
    expect(screen.getByRole("link", { name: /Privacy policy/i })).toHaveAttribute(
      "href",
      "/privacy",
    );
    // Honeypot is present but excluded from the accessibility tree.
    const honeypot = screen.getByTestId("contact-form-honeypot");
    expect(honeypot).toHaveAttribute("name", "website");
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
  });

  it("validates required fields and consent before submitting", () => {
    render(<CustomerQueryForm />);
    const submitBtn = screen.getByTestId("contact-form-submit");
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: "Hello workspace" },
    });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    // Still disabled until privacy consent
    expect(submitBtn).toBeDisabled();

    fireEvent.click(screen.getByTestId("contact-form-consent"));
    expect(submitBtn).toBeEnabled();
  });

  it("enables submit with phone-only contact channel and consent", () => {
    render(<CustomerQueryForm />);
    fillRequiredFields({ channel: "phone" });
    expect(screen.getByTestId("contact-form-submit")).toBeEnabled();
  });

  it("submits correctly on success and shows status region", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        queryId: "Q-12345",
        followUp: { email: "mailto:ops@oando.co.in", whatsapp: "https://wa.me/xyz" },
      }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Query submitted/i);
      expect(screen.getByText("Q-12345")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/customer-queries",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0]?.[1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      message: "I need a workstation",
      source: "website-contact",
      sourcePath: "/contact",
      website: "",
    });

    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: "/contact",
      surface: "contact-page-form",
      source: "website-contact",
      status: "success",
    });

    expect(screen.getByRole("link", { name: "Reply by Email" })).toHaveAttribute(
      "href",
      "mailto:ops@oando.co.in",
    );
    expect(screen.getByRole("link", { name: "Reply on WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/xyz",
    );

    // Form resets after success
    expect(screen.getByLabelText(/Name/i)).toHaveValue("");
    expect(screen.getByTestId("contact-form-consent")).not.toBeChecked();
  });

  it("seeds context message when intent is quote and source is compare", async () => {
    render(<CustomerQueryForm intent="quote" source="compare" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Message/i)).toHaveValue(
        CONTACT_FORM_CONTEXT_COPY.quote.compare.seededMessage,
      );
    });

    expect(screen.getByText(CONTACT_FORM_CONTEXT_COPY.quote.compare.title)).toBeInTheDocument();
  });

  it("seeds quote-cart context and posts attributed source", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        queryId: "Q-CART-1",
        followUp: { email: null, whatsapp: null },
      }),
    } as Response);

    render(<CustomerQueryForm intent="quote" source="quote-cart" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Message/i)).toHaveValue(
        CONTACT_FORM_CONTEXT_COPY.quote["quote-cart"].seededMessage,
      );
    });

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Cart Buyer" } });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "cart@example.com" },
    });
    fireEvent.click(screen.getByTestId("contact-form-consent"));
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Q-CART-1");
    });

    const body = JSON.parse(
      (fetchMock.mock.calls[0]?.[1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.source).toBe("website-contact-quote-cart");
    expect(body.sourcePath).toBe("/contact?intent=quote&source=quote-cart");
    expect(body.requirement).toBe(
      CONTACT_FORM_CONTEXT_COPY.quote["quote-cart"].requirement,
    );
  });

  it("handles response errors", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Form validation failed" }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Form validation failed");
    });

    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: "/contact",
      surface: "contact-page-form",
      source: "website-contact",
      status: "error",
    });
  });

  it("reads nested API error.message envelopes from the live route shape", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: { code: "MISSING_REQUIRED_FIELD", message: "Name and message are required." },
      }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Name and message are required.");
    });
  });

  it("falls back via readApiErrorMessage when envelope has no usable message", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, error: { code: "UNKNOWN" } }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Unable to submit right now.");
    });
  });

  it("handles network errors", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValue(new Error("Network error"));

    render(<CustomerQueryForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error. Please try again.");
    });

    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: "/contact",
      surface: "contact-page-form",
      source: "website-contact",
      status: "error",
    });
  });

  it("treats honest honeypot success envelope as success (no error alert)", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        queryId: "submitted",
        createdAt: "2026-01-01T00:00:00Z",
        followUp: { email: null, whatsapp: null },
      }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();
    fireEvent.change(screen.getByTestId("contact-form-honeypot"), {
      target: { value: "http://spam.example" },
    });
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Query submitted/i);
      expect(screen.getByText("submitted")).toBeInTheDocument();
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    const body = JSON.parse(
      (fetchMock.mock.calls[0]?.[1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.website).toBe("http://spam.example");
  });

  it("surfaces rate-limit envelope message from API", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many submissions. Please try again after some time.",
        },
      }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Too many submissions. Please try again after some time.",
      );
    });
  });

  it("accepts success:true live envelope shape with followUp", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        queryId: "query-live-1",
        createdAt: "2026-07-17T00:00:00Z",
        followUp: {
          email: "mailto:buyer@example.com?subject=Query%20query-live-1",
          whatsapp: null,
        },
      }),
    } as Response);

    render(<CustomerQueryForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByTestId("contact-form-submit"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("query-live-1");
    });
    expect(screen.getByRole("link", { name: "Reply by Email" })).toHaveAttribute(
      "href",
      "mailto:buyer@example.com?subject=Query%20query-live-1",
    );
  });
});
