"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const messageTypes = [
  { id: "bug", label: "Report Bug" },
  { id: "question", label: "Ask Question" },
  { id: "feedback", label: "Feedback" },
] as const;

type MessageType = (typeof messageTypes)[number]["id"];

interface FormValues {
  type: MessageType;
  email: string;
  message: string;
}

interface FormErrors {
  email?: string;
  message?: string;
}

export default function Support() {
  const [formData, setFormData] = useState<FormValues>({
    type: "bug",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return;

      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;

      // Supported hashes:
      // - #support
      // - #support-bug | #support-question | #support-feedback
      if (raw === "support") return;
      if (!raw.startsWith("support-")) return;

      const maybeType = raw.slice("support-".length) as MessageType;
      if (!messageTypes.some((t) => t.id === maybeType)) return;

      setFormData((prev) => ({ ...prev, type: maybeType }));
      document.getElementById("support")?.scrollIntoView({ behavior: "smooth" });
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Message validation
    if (!formData.message) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user types
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleTypeChange = (type: MessageType) => {
    setFormData((prev) => ({ ...prev, type }));
    if (typeof window !== "undefined") {
      // Update URL hash without causing page jump
      window.history.replaceState(null, "", `#support-${type}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Mapping internal types to Notion select types
    const typeMap: Record<MessageType, string> = {
      bug: "Bug",
      question: "Question",
      feedback: "Feedback",
    };

    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          type: typeMap[formData.type],
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message to support");
      }

      setIsSuccess(true);

      // Reset form after success delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ type: "bug", email: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Something went wrong. Please try again.";
        
      setErrors((prev) => ({ 
        ...prev, 
        message: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="support"
      className="w-full bg-[#fbfbfd] py-24 md:py-32 overflow-hidden scroll-mt-24"
    >
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
            <a
              href="#support"
              className="text-xs font-bold tracking-[0.2em] text-[#86868b] mb-4 uppercase w-fit hover:opacity-80 transition-opacity"
            >
              Support
            </a>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-[#1d1d1f] leading-tight mb-8">
              We&apos;re here to help.
            </h2>
            <p className="text-lg md:text-xl text-[#86868b] leading-relaxed mb-12 max-w-lg">
              Have a question, found a bug, or just want to say hi? Drop us a
              message and our team will get back to you swiftly.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#support-bug"
                className="text-sm font-medium text-[#1d1d1f] bg-black/[0.04] hover:bg-black/[0.06] transition-colors rounded-full px-4 py-2"
              >
                Report Bug
              </a>
              <a
                href="#support-question"
                className="text-sm font-medium text-[#1d1d1f] bg-black/[0.04] hover:bg-black/[0.06] transition-colors rounded-full px-4 py-2"
              >
                Ask Question
              </a>
              <a
                href="#support-feedback"
                className="text-sm font-medium text-[#1d1d1f] bg-black/[0.04] hover:bg-black/[0.06] transition-colors rounded-full px-4 py-2"
              >
                Feedback
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {/* <a
                href="mailto:support@lufra.app"
                className="text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                support@lufra.app
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 11L11 1M11 1H3.5M11 1V8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a> */}
              <Link
                href="/blog"
                className="text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                Browse Documentation
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 11L11 1M11 1H3.5M11 1V8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden flex flex-col min-h-[500px]"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="flex flex-col items-center justify-center flex-1 py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-[#86868b] max-w-[280px]">
                    Thank you for reaching out. Our team will get back to you at{" "}
                    <span className="text-[#1d1d1f] font-medium">
                      {formData.email}
                    </span>{" "}
                    shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Segmented Control */}
                  <div className="flex p-1 bg-[#f5f5f7] rounded-xl relative">
                    {messageTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleTypeChange(type.id)}
                        aria-pressed={formData.type === type.id}
                        className={`relative flex-1 py-1.5 text-sm font-medium transition-colors z-10 ${
                          formData.type === type.id
                            ? "text-[#1d1d1f]"
                            : "text-[#86868b]"
                        } disabled:opacity-50`}
                      >
                        {type.label}
                        {formData.type === type.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-[10px] shadow-sm z-[-1]"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#1d1d1f] ml-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.email}
                      className={`w-full bg-[#f5f5f7] rounded-xl px-4 py-3.5 text-[#1d1d1f] placeholder-[#86868b]/50 focus:ring-2 transition-all outline-none ${
                        errors.email
                          ? "ring-2 ring-red-500/20 border-red-200"
                          : "focus:ring-black/10 border-transparent"
                      } border disabled:opacity-50`}
                    />
                    {errors.email && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 ml-1 font-medium"
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-[#1d1d1f] ml-1"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="How can we help you today?"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.message}
                      className={`w-full bg-[#f5f5f7] rounded-xl px-4 py-3.5 text-[#1d1d1f] placeholder-[#86868b]/50 focus:ring-2 transition-all resize-none min-h-[140px] outline-none ${
                        errors.message
                          ? "ring-2 ring-red-500/20 border-red-200"
                          : "focus:ring-black/10 border-transparent"
                      } border disabled:opacity-50`}
                    />
                    {errors.message && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 ml-1 font-medium"
                      >
                        {errors.message}
                      </motion.span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1d1d1f] text-white rounded-xl py-4 font-semibold shadow-lg shadow-black/5 transition-all flex items-center justify-center gap-2 hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
