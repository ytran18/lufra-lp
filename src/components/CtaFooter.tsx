"use client";

import React from "react";
import { motion } from "framer-motion";
import { GUMROAD_URL } from "@/constants/links";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 384 512"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export default function CtaFooter() {
  return (
    <>
      {/* CTA Section */}
      <section aria-label="Get Lufra" className="w-full bg-[#fbfbfd] pt-32 pb-24 md:pt-48 md:pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#1d1d1f] leading-tight max-w-3xl mx-auto">
            Ready to elevate your workspace?
          </h2>
          <p className="text-lg md:text-xl text-[#86868b] mt-6 max-w-xl mx-auto leading-relaxed">
            Get Lufra today and experience boundless multitasking on macOS.
          </p>

          <div className="mt-12 flex flex-col items-center">
            <motion.a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1d1d1f] text-white rounded-full px-10 py-5 font-medium text-lg transition-transform flex items-center justify-center gap-2"
            >
              <AppleLogo className="w-[18px] h-[18px] -mt-0.5" />
              Get Lufra for macOS
            </motion.a>
            <p className="text-xs text-[#86868b] mt-6 font-medium tracking-tight">
              Requires macOS 13.0 or later. Universal for Intel and Apple Silicon.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#fbfbfd] px-6 border-t border-black/5">
        <div className="container mx-auto py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
            <div className="text-sm text-[#86868b] font-medium">
              Lufra © {new Date().getFullYear()}.{" "}
              <span className="text-[#1d1d1f]">Crafted for focus.</span>
            </div>
            <nav aria-label="Footer links">
              <ul className="flex gap-8 list-none m-0 p-0">
                {[
                  { label: "Blog", href: "/blog" },
                  { label: "Support", href: "/#support" },
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
