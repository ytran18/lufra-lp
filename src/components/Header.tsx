"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Guide", href: "#guide" },
    { name: "Achievements", href: "#achievements" },
    { name: "Settings", href: "#settings" },
];

/**
 * Header Component - Apple-esque Light Theme Minimalism
 * Designed for Lufra macOS PiP App
 */
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll state for subtle glass refinement
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any
            }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-black/5 ${scrolled ? "bg-white/80 backdrop-blur-lg py-3" : "bg-white/40 backdrop-blur-md py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-sm border border-black/5 bg-white p-1">
                        <Image
                            src="/icon.png"
                            alt="Lufra Logo"
                            fill
                            className="object-contain p-1"
                            priority
                        />
                    </div>
                    <span className="text-[#1d1d1f] font-bold text-2xl tracking-tighter font-heading">
                        Lufra
                    </span>
                </Link>

                {/* Nav Links - Desktop */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-black/50 hover:text-black text-sm font-medium tracking-tight transition-all duration-300 relative group/link"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover/link:w-full" />
                        </Link>
                    ))}
                </div>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:inline-flex bg-[#1d1d1f] text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20 hover:bg-black"
                    >
                        Download for Free
                    </motion.button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-black/60 hover:text-black transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-24 left-0 w-full px-6 md:hidden"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl border border-black/5 rounded-3xl p-8 shadow-2xl shadow-black/5">
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-2xl font-semibold text-[#1d1d1f] hover:text-black"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-4"
                                >
                                    Download for Free
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
