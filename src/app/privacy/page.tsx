import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lufra collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24 text-neutral-900">
      <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Last updated: {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="space-y-6 text-neutral-700 leading-relaxed">
        <p>
          Lufra (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects
          your privacy. This Privacy Policy explains what information we collect,
          how we use it, and your rights.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Information We Collect
        </h2>
        <p>
          The Lufra macOS application runs locally on your Mac and does not
          collect personal data by default. When you submit a bug report,
          question, or feedback through our website, we collect the email
          address and message you provide.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          How We Use Information
        </h2>
        <p>
          We use the information you provide solely to respond to your request,
          improve the product, and fix reported issues. We do not sell your
          personal data.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Data Storage
        </h2>
        <p>
          Support submissions are stored in our internal Notion workspace,
          accessible only to the Lufra team.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Your Rights
        </h2>
        <p>
          You can request access to, correction of, or deletion of your personal
          data at any time by contacting us through the support form on the
          homepage.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Contact
        </h2>
        <p>
          For any privacy-related questions, please reach out via the support
          form on our{" "}
          <Link href="/#support" className="text-[#0066cc] underline">
            homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
