"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messageTypes = [
  { id: "bug", label: "Report Bug" },
  { id: "question", label: "Ask Question" },
  { id: "feedback", label: "Feedback" },
];

export default function Support() {
  const [activeType, setActiveType] = useState("bug");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { email, message, type: activeType });
  };

  return (
    <section className="w-full bg-[#fbfbfd] py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Left Column: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold tracking-[0.2em] text-[#86868b] mb-4 uppercase">
              Support
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-[#1d1d1f] leading-tight mb-8">
              We're here to help.
            </h2>
            <p className="text-lg md:text-xl text-[#86868b] leading-relaxed mb-12 max-w-lg">
              Have a question, found a bug, or just want to say hi? Drop us a message and our team will get back to you swiftly.
            </p>
            
            <div className="flex flex-col gap-4">
              <a 
                href="mailto:support@lufra.app" 
                className="text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                support@lufra.app
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                Browse Documentation
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/[0.03]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Segmented Control */}
              <div className="flex p-1 bg-[#f5f5f7] rounded-xl relative">
                {messageTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setActiveType(type.id)}
                    className={`relative flex-1 py-1.5 text-sm font-medium transition-colors z-10 ${
                      activeType === type.id ? "text-[#1d1d1f]" : "text-[#86868b]"
                    }`}
                  >
                    {type.label}
                    {activeType === type.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-[10px] shadow-sm z-[-1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f5f5f7] rounded-xl px-4 py-3.5 text-[#1d1d1f] placeholder-[#86868b] focus:ring-2 focus:ring-black/10 focus:outline-none transition-all"
                />
              </div>

              {/* Message Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#f5f5f7] rounded-xl px-4 py-3.5 text-[#1d1d1f] placeholder-[#86868b] focus:ring-2 focus:ring-black/10 focus:outline-none transition-all resize-none min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#1d1d1f] text-white rounded-xl py-4 font-medium transition-transform"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
