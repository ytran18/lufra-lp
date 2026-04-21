import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of the Lufra application and website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24 text-neutral-900">
      <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
        Terms of Service
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
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the Lufra application (the &ldquo;Software&rdquo;) and website.
          By downloading, installing, or using Lufra, you agree to be bound by
          these Terms.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          License
        </h2>
        <p>
          Lufra is provided free of charge for personal and commercial use. We
          grant you a non-exclusive, non-transferable, revocable license to
          install and use the Software on macOS devices that you own or control.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Restrictions
        </h2>
        <p>
          You may not reverse engineer, decompile, or disassemble the Software;
          redistribute modified copies of the Software; or use the Software for
          any unlawful purpose.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Disclaimer
        </h2>
        <p>
          The Software is provided &ldquo;as is&rdquo; without warranty of any
          kind. We do not guarantee that the Software will be error-free or
          uninterrupted.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, Lufra shall not be liable for
          any indirect, incidental, special, or consequential damages arising
          out of or related to your use of the Software.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Changes to Terms
        </h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          Software after changes are posted constitutes acceptance of the
          revised Terms.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Contact
        </h2>
        <p>
          Questions about these Terms can be sent via the support form on our{" "}
          <Link href="/#support" className="text-[#0066cc] underline">
            homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
