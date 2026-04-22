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
          We grant you a non-exclusive, non-transferable, revocable license to
          install and use the Software on macOS devices that you own or control,
          for both personal and commercial use, subject to these Terms. The
          Software may be offered through both free and paid distribution
          channels.
        </p>
        <p>
          A paid license is delivered as a license key bound to a unique
          identifier of the Mac on which it is first activated. Each license
          key is intended for use on a single Mac at a time. If you need to
          move your license to a new or replacement Mac, please contact us
          through the support form on the homepage and we will assist with
          deactivating the previous Mac and reactivating your key. Sharing,
          publishing, or reselling license keys is not permitted.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Payment &amp; Refunds
        </h2>
        <p>
          Paid copies of Lufra are distributed through{" "}
          <a
            href="https://gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066cc] underline"
          >
            Gumroad
          </a>
          . When you make a purchase, your transaction is handled entirely by
          Gumroad, and their{" "}
          <a
            href="https://gumroad.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066cc] underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="https://gumroad.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066cc] underline"
          >
            Privacy Policy
          </a>{" "}
          apply to that transaction. Upon successful purchase, you will receive
          a license key as described in the License section above. We do not
          receive or store your payment card information.
        </p>
        <p>
          Refund requests are handled in accordance with Gumroad&apos;s refund
          policy. Please contact Gumroad support directly for purchase-related
          disputes. Prices and availability of paid features may change at any
          time without prior notice, but such changes will not affect a license
          you have already purchased.
        </p>
        <p>
          If Lufra becomes available through additional distribution channels
          in the future, these Terms will be updated to reflect the applicable
          payment, access, and refund terms for each channel.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Updates
        </h2>
        <p>
          Lufra includes a built-in update checker that notifies you when a new
          version is available. You may install updates at any time from within
          the application. Updates may add, modify, or remove features, and may
          include security patches or bug fixes. We strongly recommend keeping
          the Software up to date to ensure reliability and security.
        </p>
        <p>
          Continued use of the Software after an update constitutes your
          acceptance of any updated functionality delivered through that
          release.
        </p>

        <h2 className="text-2xl font-semibold text-neutral-900 mt-10">
          Restrictions
        </h2>
        <p>
          You may not reverse engineer, decompile, or disassemble the Software;
          redistribute modified copies of the Software; resell or sublicense the
          Software without our written consent; or use the Software for any
          unlawful purpose.
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
          Termination
        </h2>
        <p>
          You may stop using the Software at any time by uninstalling it from
          your device. We may suspend or terminate your license immediately, and
          without prior notice, if you breach these Terms or use the Software
          in a way that harms Lufra, other users, or third parties.
        </p>
        <p>
          If your license is terminated for breach, we may revoke the
          associated license key and invalidate its binding to the unique
          identifier of your Mac. Once revoked, the Software will revert to its
          unlicensed state on the affected Macs, and no refund will be issued
          for the revoked license.
        </p>
        <p>
          Upon termination, the license granted to you will cease and you must
          stop using the Software. Sections concerning restrictions, disclaimer,
          limitation of liability, and governing law will survive termination.
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
