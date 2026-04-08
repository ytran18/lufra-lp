"use client";

import React from "react";
import { motion } from "framer-motion";
import { Apple } from "lucide-react";

export default function CtaFooter() {
  return (
    <>
      {/* CTA Section */}
      <section aria-label="Download Lufra" className="w-full bg-[#fbfbfd] pt-32 pb-24 md:pt-48 md:pb-32 px-6">
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
            Download Lufra today and experience boundless multitasking on macOS.
          </p>

          <div className="mt-12 flex flex-col items-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1d1d1f] text-white rounded-full px-10 py-5 font-medium text-lg transition-transform flex items-center justify-center gap-2"
            >
              <Apple className="w-5 h-5" fill="currentColor" aria-hidden="true" />
              Download for macOS
            </motion.button>
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
              Lufra © 2026. <span className="text-[#1d1d1f]">Crafted for focus.</span>
            </div>
            <nav aria-label="Footer links">
              <ul className="flex gap-8 list-none m-0 p-0">
                {["Twitter", "Support", "Privacy", "Terms"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium"
                    >
                      {link}
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
