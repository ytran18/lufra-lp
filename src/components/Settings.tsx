"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Settings as SettingsIcon,
  Command,
  Info,
  List as ListIcon,
  Grid as GridIcon,
  RefreshCw,
  Play,
  Settings,
  Crop,
  ExternalLink,
  Minus,
  Ghost,
  Circle,
  Square as SquareIcon,
  Lock,
  RotateCcw,
} from "lucide-react";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const appsData = [
  {
    id: "antigravity",
    iconBg: "#0B0B0B",
    iconContent: (
      <div className="text-[#2b88ff] font-bold font-serif italic text-[18px]">
        A
      </div>
    ),
    title: "Antigravity",
    subtitle: "Lufra PiP Window",
    resolution: "1710×1073",
  },
  {
    id: "vscode",
    iconBg: "#0065A9",
    iconContent: (
      <div className="w-5 h-5 flex items-center justify-center text-white">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .327 8.742L3.8 12 .327 15.258a1 1 0 0 0 0 1.482l1.322 1.201a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.494 1.494 0 0 0 1.705.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
        </svg>
      </div>
    ),
    title: "VS Code",
    subtitle: "Visual Studio Code",
  },
  {
    id: "slack",
    iconBg: "#4A154B",
    iconContent: (
      <div className="w-5 h-5 flex items-center justify-center text-white">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M22.2 62.4c0-4.6-3.8-8.4-8.4-8.4-4.6 0-8.4 3.8-8.4 8.2s3.8 8.4 8.4 8.4h8.4v-8.2zM27.2 62.4c0 4.6 3.8 8.4 8.4 8.4 4.6 0 8.4-3.8 8.4-8.4V27.4c0-4.6-3.8-8.4-8.4-8.4-4.6 0-8.4 3.8-8.4 8.4v35zM37.6 22.2c4.6 0 8.4-3.8 8.4-8.4 0-4.6-3.8-8.4-8.4-8.4-4.6 0-8.4 3.8-8.4 8.4v8.4h8.4zM37.6 27.2c-4.6 0-8.4 3.8-8.4 8.4 0 4.6 3.8 8.4 8.4 8.4h35c4.6 0 8.4-3.8 8.4-8.4 0-4.6-3.8-8.4-8.4-8.4h-35zM77.8 37.6c0 4.6 3.8 8.4 8.4 8.4 4.6 0 8.4-3.8 8.4-8.4 0-4.6-3.8-8.4-8.4-8.4h-8.4v8.4zM72.8 37.6c0-4.6-3.8-8.4-8.4-8.4-4.6 0-8.4 3.8-8.4 8.4v35c0 4.6 3.8 8.4 8.4 8.4 4.6 0 8.4-3.8 8.4-8.4v-35zM62.4 77.8c-4.6 0-8.4 3.8-8.4 8.4 0 4.6 3.8 8.4 8.4 8.4 4.6 0 8.4-3.8 8.4-8.4V77.8h-8.4zM62.4 72.8c4.6 0 8.4-3.8 8.4-8.4 0-4.6-3.8-8.4-8.4-8.4h-35c-4.6 0-8.4 3.8-8.4 8.4 0 4.6 3.8 8.4 8.4 8.4h35z" />
        </svg>
      </div>
    ),
    title: "Slack",
    subtitle: "Lufra Design Team",
  },
  {
    id: "chrome",
    iconBg: "#fff",
    iconContent: (
      <div className="w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.21 0 4.83 1.75 2.64 4.5l3.86 6.69C7.15 8.75 9.4 7.2 12 7.2c1.72 0 3.25.75 4.3 1.95l3.86-6.69C17.97 1 15.15 0 12 0zM5.31 5.37C3.12 7.56 1.8 10.63 1.8 14c0 1.72.35 3.35 1 4.84l5.34-9.25C9.4 8.75 10.75 8.04 12.25 8.04H6.31c-.34 0-.67-.1-.97-.27-.01-.11-.03-.23-.03-.35l.001-.05zm14.05-.87c3.12 2.19 4.44 5.26 4.44 8.63 0 1.72-.35 3.35-1 4.84l-5.34-9.25C14.6 8.75 13.25 8.04 11.75 8.04h5.94c.34 0 .67.1.97.27.01.11.03.23.03.35l-.001-.05z" />
        </svg>
      </div>
    ),
    title: "Google Chrome",
    subtitle: "Lufra Landing Page",
  },
  {
    id: "spotify",
    iconBg: "#1DB954",
    iconContent: (
      <div className="text-black font-bold">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.306c-.215.353-.675.463-1.028.249-2.856-1.745-6.45-2.14-10.684-1.173-.404.092-.812-.16-.905-.563-.092-.403.16-.811.563-.904 4.636-1.06 8.601-.601 11.803 1.355.354.215.465.675.251 1.028v.008zm1.468-3.258c-.27.439-.844.582-1.282.311-3.27-2.008-8.254-2.592-12.12-1.417-.492.15-.1.87-.26.581-.439-.149-.583-.438-.311-.844 4.417-1.341 9.902-.686 13.666 1.624.44.27.583.844.312 1.282v.011zm.126-3.376c-3.922-2.329-10.402-2.545-14.175-1.4-.6.183-1.238-.158-1.421-.758-.182-.6.158-1.237.758-1.42 4.339-1.319 11.517-1.06 16.02 1.616.539.32.716 1.015.397 1.554s-1.015.717-1.554.397l-.025.011z" />
        </svg>
      </div>
    ),
    title: "Spotify",
    subtitle: "Deep Focus Playlist",
  },
  {
    id: "figma",
    iconBg: "#1E1E1E",
    iconContent: (
      <div className="w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 38 57" fill="currentColor">
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0zM0 9.5A9.5 9.5 0 0 1 9.5 0h9.5v19H9.5A9.5 9.5 0 0 1 0 9.5zm0 19A9.5 9.5 0 0 1 9.5 19h9.5v19H9.5A9.5 9.5 0 0 1 0 28.5zM0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 0 1 9.5 57 9.5 9.5 0 0 1 0 47.5zM19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z" />
        </svg>
      </div>
    ),
    title: "Figma",
    subtitle: "Lufra v2.0 Design",
  },
];

// ─── Hook: measure element position relative to a container ──────────────────
function useElementPos(
  elementRef: React.RefObject<HTMLElement | null>,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const getPos = useCallback(() => {
    if (!elementRef.current || !containerRef.current) return null;
    const elRect = elementRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: elRect.left - containerRect.left + elRect.width / 2,
      y: elRect.top - containerRect.top + elRect.height / 2,
    };
  }, [elementRef, containerRef]);
  return getPos;
}

export default function SettingsTabsDemo() {
  const [activeTab, setActiveTab] = useState<
    "Capture" | "General" | "Shortcuts" | "About"
  >("Capture");

  // ─── Refs ──────────────────────────────────────────────────────────────────
  // Container ref — all cursor positions are relative to this
  const containerRef = useRef<HTMLDivElement>(null);

  // Capture tab
  const capturePlayRef = useRef<HTMLDivElement>(null);
  const captureStopRef = useRef<HTMLDivElement>(null);

  // General tab
  const generalLowRef = useRef<HTMLDivElement>(null);
  const generalHighestRef = useRef<HTMLDivElement>(null);
  const generalToggleRef = useRef<HTMLDivElement>(null);

  // Shortcuts tab
  const shortcutInputRef = useRef<HTMLDivElement>(null);

  // ─── Cursor State ──────────────────────────────────────────────────────────
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 400 });
  const [cursorScale, setCursorScale] = useState(1);
  const [showCursor, setShowCursor] = useState(true);

  // ─── Feature State ────────────────────────────────────────────────────────
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoQuality, setVideoQuality] = useState("highest");
  const [launchLogin, setLaunchLogin] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [ghostKeys, setGhostKeys] = useState(["⇧", "⌘", "G"]);

  // Helper: get center of an element relative to containerRef
  const getPosOf = useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current || !containerRef.current) return null;
      const el = ref.current.getBoundingClientRect();
      const box = containerRef.current.getBoundingClientRect();
      return {
        x: el.left - box.left + el.width / 2,
        y: el.top - box.top + el.height / 2,
      };
    },
    []
  );

  const moveTo = useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      const pos = getPosOf(ref);
      if (pos) setCursorPos(pos);
    },
    [getPosOf]
  );

  const click = useCallback(async () => {
    setCursorScale(0.8);
    await sleep(120);
    setCursorScale(1);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // ─── Sequence Runner ───────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const runSequence = async () => {
      // Small initial pause after tab switch
      await sleep(800);
      if (!mounted) return;

      // Wait one frame so refs can paint before we measure
      await new Promise((r) => requestAnimationFrame(r));
      if (!mounted) return;

      while (mounted) {
        if (activeTab === "Capture") {
          setIsStreaming(false);
          // Reset cursor to a neutral spot
          const containerPos = containerRef.current?.getBoundingClientRect();
          if (containerPos)
            setCursorPos({ x: containerPos.width / 2, y: containerPos.height * 0.6 });

          await sleep(800);
          if (!mounted || activeTab !== "Capture") break;

          // Move to Play button of Antigravity row
          moveTo(capturePlayRef);
          await sleep(1200);
          if (!mounted || activeTab !== "Capture") break;

          await click();
          setIsStreaming(true);
          await sleep(2500);
          if (!mounted || activeTab !== "Capture") break;

          // Move to Stop button (same ref, now shows stop icon)
          moveTo(captureStopRef);
          await sleep(1000);
          if (!mounted || activeTab !== "Capture") break;

          await click();
          setIsStreaming(false);
          await sleep(800);
          if (!mounted || activeTab !== "Capture") break;

        } else if (activeTab === "General") {
          setVideoQuality("highest");
          const containerPos = containerRef.current?.getBoundingClientRect();
          if (containerPos)
            setCursorPos({ x: containerPos.width / 2, y: containerPos.height * 0.6 });

          await sleep(800);
          if (!mounted || activeTab !== "General") break;

          // Click Low
          moveTo(generalLowRef);
          await sleep(1000);
          if (!mounted || activeTab !== "General") break;

          await click();
          setVideoQuality("low");
          await sleep(1000);
          if (!mounted || activeTab !== "General") break;

          // Click Highest
          moveTo(generalHighestRef);
          await sleep(800);
          if (!mounted || activeTab !== "General") break;

          await click();
          setVideoQuality("highest");
          await sleep(1000);
          if (!mounted || activeTab !== "General") break;

          // Toggle launch at login
          moveTo(generalToggleRef);
          await sleep(1000);
          if (!mounted || activeTab !== "General") break;

          await click();
          setLaunchLogin((prev) => !prev);
          await sleep(1500);
          if (!mounted || activeTab !== "General") break;

        } else if (activeTab === "Shortcuts") {
          setIsAssigning(false);
          setGhostKeys(["⇧", "⌘", "G"]);
          const containerPos = containerRef.current?.getBoundingClientRect();
          if (containerPos)
            setCursorPos({ x: containerPos.width / 2, y: containerPos.height * 0.6 });

          await sleep(800);
          if (!mounted || activeTab !== "Shortcuts") break;

          moveTo(shortcutInputRef);
          await sleep(1000);
          if (!mounted || activeTab !== "Shortcuts") break;

          await click();
          setIsAssigning(true);
          await sleep(1000);
          if (!mounted || activeTab !== "Shortcuts") break;

          setGhostKeys(["⇧", "⌘", "G"]);
          await sleep(800);
          if (!mounted || activeTab !== "Shortcuts") break;

          setIsAssigning(false);
          await sleep(2000);
          if (!mounted) break;

          // Auto-cycle back to Capture after shortcuts demo
          setActiveTab("Capture");
          return;
        } else {
          break;
        }
      }
    };

    runSequence();
    return () => {
      mounted = false;
    };
  }, [activeTab, moveTo, click]);

  return (
    <section className="relative w-full bg-[#fbfbfd] py-20 sm:py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Intro Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-center text-center mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] font-semibold tracking-[0.12em] text-[#6e6e73] uppercase mb-4 block">
            Customization
          </span>
          <h2 className="text-[clamp(28px,5vw,56px)] font-semibold tracking-[-0.025em] text-[#1d1d1f] leading-[1.1] mb-6">
            Your rules. Your workspace.
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#6e6e73] max-w-2xl mx-auto leading-relaxed">
            Fine-tune every aspect of Lufra to match your exact workflow. From
            global hotkeys to precision window controls.
          </p>
        </motion.div>
      </div>

      {/* Mockup Wrapper — true responsive, no CSS scale trick */}
      <div className="w-full px-4 sm:px-6 flex justify-center">
        <motion.div
          ref={containerRef}
          className="relative w-full max-w-[800px] rounded-[16px] sm:rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.22)] border border-white/10 bg-[#1c1c1e] text-white font-sans text-left flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Cursor — hidden on touch/small screens */}
          <motion.div
            animate={{ x: cursorPos.x, y: cursorPos.y, scale: cursorScale }}
            transition={{
              x: { type: "spring", stiffness: 120, damping: 25 },
              y: { type: "spring", stiffness: 120, damping: 25 },
              scale: { duration: 0.1 },
            }}
            className="absolute top-0 left-0 z-[100] pointer-events-none hidden sm:block"
            style={{ translateX: "-50%", translateY: "-50%" }}
          >
            <svg
              width="22"
              height="33"
              viewBox="0 0 24 36"
              fill="none"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
            >
              <path
                d="M5.5 32.5L1 1.5L22.5 22.5H13L5.5 32.5Z"
                fill="black"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Mac Window Bar */}
          <div className="h-[44px] sm:h-[48px] rounded-t-[16px] sm:rounded-t-[24px] flex px-3 sm:px-4 items-center justify-between border-b border-black/40 bg-[#242426] backdrop-blur-md relative z-40 shrink-0">
            <div className="flex items-center">
              <div className="flex gap-1.5 mr-3 ml-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-black/20" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-black/20" />
              </div>
              <span className="text-[#86868b] text-[11px] sm:text-[13px] font-semibold tracking-tight ml-1 select-none truncate max-w-[140px] sm:max-w-none">
                Lufra — Select a Window
              </span>
            </div>

            <AnimatePresence>
              {isStreaming && activeTab === "Capture" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  className="flex items-center gap-1.5 sm:gap-2 bg-[#263e2e] px-2.5 sm:px-3 py-[4px] sm:py-[5px] rounded-full border border-green-500/10"
                >
                  <div className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[#34C759] shadow-[0_0_6px_rgba(52,199,89,0.8)]" />
                  <span className="text-[#34C759] text-[9px] sm:text-[10px] font-bold tracking-widest">
                    1 ACTIVE
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Body */}
          <div className="relative w-full bg-[#1c1c1e] flex flex-col rounded-b-[16px] sm:rounded-b-[24px] overflow-hidden">
            {/* Tabs */}
            <div className="flex justify-start sm:justify-center items-center gap-1 sm:gap-2 py-3 sm:py-4 px-3 sm:px-4 overflow-x-auto no-scrollbar select-none z-40 relative border-b border-white/5 bg-[#1c1c1e] shrink-0">
              <TabButton
                icon={
                  <Video
                    size={18}
                    className="mb-1"
                    strokeWidth={activeTab === "Capture" ? 2.5 : 2}
                  />
                }
                label="Capture"
                active={activeTab === "Capture"}
                onClick={() => setActiveTab("Capture")}
              />
              <TabButton
                icon={
                  <SettingsIcon
                    size={18}
                    className="mb-1"
                    strokeWidth={activeTab === "General" ? 2.5 : 2}
                  />
                }
                label="General"
                active={activeTab === "General"}
                onClick={() => setActiveTab("General")}
              />
              <TabButton
                icon={
                  <Command
                    size={18}
                    className="mb-1"
                    strokeWidth={activeTab === "Shortcuts" ? 2.5 : 2}
                  />
                }
                label="Shortcuts"
                active={activeTab === "Shortcuts"}
                onClick={() => setActiveTab("Shortcuts")}
              />
              <div className="opacity-40 pointer-events-none">
                <TabButton
                  icon={
                    <Info
                      size={18}
                      className="mb-1"
                      strokeWidth={activeTab === "About" ? 2.5 : 2}
                    />
                  }
                  label="About"
                  active={activeTab === "About"}
                  onClick={() => { }}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                {/* ── CAPTURE TAB ──────────────────────────────────────── */}
                {activeTab === "Capture" && (
                  <motion.div
                    key="capture"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full px-4 sm:px-8 py-4 sm:py-6 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-end mb-4 sm:mb-6 gap-3">
                      <div>
                        <h2 className="text-[18px] sm:text-[24px] font-semibold text-white mb-0.5 tracking-tight">
                          Select Window
                        </h2>
                        <p className="text-[#86868b] text-[12px] sm:text-[14px]">
                          5 available
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex bg-[#2a2a2e] border border-white/5 rounded-xl overflow-hidden">
                          <div className="px-2.5 sm:px-3 py-1.5 bg-[#4a4a4e] text-white shadow-sm">
                            <ListIcon size={14} />
                          </div>
                          <div className="px-2.5 sm:px-3 py-1.5 text-[#86868b]">
                            <GridIcon size={14} />
                          </div>
                        </div>
                        <RefreshCw size={14} className="text-[#86868b]" />
                      </div>
                    </div>

                    {/* App list */}
                    <div className="flex-1 w-full relative">
                      {isStreaming && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] sm:text-[11px] font-bold text-[#86868b] tracking-widest mb-2 ml-1"
                        >
                          SELECTED WINDOWS
                        </motion.div>
                      )}

                      {isStreaming && (
                        <motion.div layoutId="app-antigravity" className="mb-4 sm:mb-6">
                          <AppListItem
                            {...appsData.find((a) => a.id === "antigravity")!}
                            isStreaming={true}
                            isIsolated={true}
                            stopRef={captureStopRef}
                          />
                        </motion.div>
                      )}

                      {isStreaming && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] sm:text-[11px] font-bold text-[#86868b] tracking-widest mb-2 ml-1"
                        >
                          OTHER WINDOWS
                        </motion.div>
                      )}

                      <motion.div
                        layout
                        className="bg-[#242425] border border-white/5 mb-6 sm:mb-10 rounded-[1rem] sm:rounded-[1.25rem] overflow-hidden flex flex-col shadow-md relative z-10 w-full"
                      >
                        {appsData
                          .filter((a) => !isStreaming || a.id !== "antigravity")
                          .map((app, i, arr) => (
                            <motion.div
                              key={app.id}
                              layout
                              layoutId={`app-${app.id}`}
                            >
                              <AppListItem
                                {...app}
                                isStreaming={false}
                                isLast={i === arr.length - 1}
                                // attach play ref only to antigravity row
                                playRef={
                                  app.id === "antigravity"
                                    ? capturePlayRef
                                    : undefined
                                }
                              />
                            </motion.div>
                          ))}
                      </motion.div>
                    </div>

                    {/* Floating PiP */}
                    <AnimatePresence>
                      {isStreaming && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 28,
                          }}
                          // On mobile: bottom sheet style; on sm+: floating corner
                          className="
                            absolute left-3 right-3 bottom-3
                            sm:left-auto sm:right-4 sm:bottom-4
                            sm:w-[85%] sm:max-w-[420px]
                            h-[160px] sm:h-[260px]
                            rounded-[16px] sm:rounded-[20px]
                            bg-black shadow-2xl border border-white/10 overflow-hidden flex flex-col z-50 ring-1 ring-black/50
                          "
                        >
                          {/* PiP Header */}
                          <div className="absolute top-0 left-0 right-0 h-[44px] sm:h-[52px] bg-black/90 backdrop-blur-xl flex items-center px-3 sm:px-4 justify-between z-20 border-b border-white/5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                              <span className="text-white text-[12px] sm:text-[13px] font-bold tracking-tight">
                                Antigravity
                              </span>
                              <div className="bg-[#1c1c1e] text-white/70 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[5px] sm:rounded-[6px] border border-white/10">
                                55 fps
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3.5 text-white/50">
                              <Settings size={13} />
                              <Crop size={13} />
                              <ExternalLink size={13} />
                              <Minus size={13} />
                              <div className="w-px h-3 bg-white/10" />
                              <Ghost size={13} />
                              <Circle size={13} />
                              <SquareIcon size={13} />
                            </div>
                          </div>
                          <div className="absolute inset-0 pt-[44px] sm:pt-[52px] bg-gradient-to-br from-neutral-800 to-neutral-900 border border-t-0 border-white/5">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://transparenttextures.com/patterns/cubes.png')]" />
                            <div className="p-4 sm:p-6">
                              <div className="w-3/4 h-6 sm:h-8 bg-white/10 rounded-lg mb-3 sm:mb-4" />
                              <div className="w-1/2 h-4 sm:h-6 bg-white/5 rounded-lg mb-2" />
                              <div className="w-5/6 h-4 sm:h-6 bg-white/5 rounded-lg" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ── GENERAL TAB ───────────────────────────────────────── */}
                {activeTab === "General" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full px-4 sm:px-10 py-4 sm:py-6 flex flex-col items-center"
                  >
                    <div className="w-full max-w-[640px] mt-2 sm:mt-4 shrink-0 px-1 pb-8 sm:pb-12">
                      {/* Startup */}
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#86868b] uppercase mb-2 ml-1">
                        Startup
                      </div>
                      <div
                        ref={generalToggleRef}
                        className="bg-[#262629] border border-white/5 rounded-xl mb-6 sm:mb-8 flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4"
                      >
                        <div>
                          <div className="text-[14px] sm:text-[15px] font-medium text-white mb-0.5">
                            Launch at Login
                          </div>
                          <div className="text-[12px] sm:text-[13px] text-[#86868b]">
                            Start Lufra hidden in the menu bar
                          </div>
                        </div>
                        <Toggle active={launchLogin} />
                      </div>

                      {/* Onboarding */}
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#86868b] uppercase mb-2 ml-1">
                        Onboarding
                      </div>
                      <div className="bg-[#262629] border border-white/5 rounded-xl mb-6 sm:mb-8 flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4">
                        <div>
                          <div className="text-[14px] sm:text-[15px] font-medium text-white mb-0.5">
                            Play Tutorial
                          </div>
                          <div className="text-[12px] sm:text-[13px] text-[#86868b]">
                            Re-run the interactive onboarding guide
                          </div>
                        </div>
                        <button className="px-3 sm:px-4 py-1.5 rounded-lg border border-blue-500/30 text-[#0A84FF] font-medium text-[12px] sm:text-[13px] bg-[#0A84FF]/10 shrink-0 ml-4">
                          Start
                        </button>
                      </div>

                      {/* Video Quality */}
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#86868b] uppercase mb-2 ml-1">
                        Video Quality
                      </div>
                      <div className="bg-[#262629] border border-white/5 rounded-xl flex flex-col">
                        <div ref={generalHighestRef}>
                          <RadioItem
                            title="Highest (1080p, 60fps)"
                            sub="Default for new streams"
                            active={videoQuality === "highest"}
                          />
                        </div>
                        <div className="h-px w-full bg-white/5" />
                        <RadioItem
                          title="Balanced (720p, 60fps)"
                          active={videoQuality === "balanced"}
                        />
                        <div className="h-px w-full bg-white/5" />
                        <div ref={generalLowRef}>
                          <RadioItem
                            title="Low (720p, 30fps)"
                            active={videoQuality === "low"}
                            isLast
                          />
                        </div>
                      </div>
                      <div className="text-[#86868b] text-[11px] sm:text-[12px] mt-3 ml-1">
                        Applies to all new streams. Each PiP window can override
                        individually.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── SHORTCUTS TAB ─────────────────────────────────────── */}
                {activeTab === "Shortcuts" && (
                  <motion.div
                    key="shortcuts"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full px-4 sm:px-10 py-6 sm:py-10 flex flex-col md:flex-row gap-6 md:gap-0"
                  >
                    {/* Left */}
                    <div className="w-full md:w-1/2 md:pr-8 md:border-r border-white/5">
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#86868b] uppercase mb-3 ml-1">
                        Hotkeys
                      </div>
                      <div className="bg-[#262629] border border-white/5 rounded-xl overflow-hidden mb-3">
                        {/* Assignable Row */}
                        <div
                          ref={shortcutInputRef}
                          className="p-3 sm:p-4 border-b border-white/5 flex justify-between items-center gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-[13px] sm:text-[14px] font-medium text-white leading-tight">
                              Toggle Ghost Mode{" "}
                              <span className="text-[#86868b] font-normal text-[11px] sm:text-[12px] ml-1">
                                Default
                              </span>
                            </div>
                            <div className="text-[11px] sm:text-[12px] text-[#86868b] mt-1">
                              Make floating windows pass-through clicks
                            </div>
                          </div>
                          <div
                            className={classNames(
                              "px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-[12px] sm:text-[13px] font-mono tracking-tight transition-all shadow-inner flex items-center gap-1 sm:gap-1.5 shrink-0",
                              isAssigning
                                ? "border-[#0A84FF] bg-[#1e1e1e] text-[#0066ff] shadow-[0_0_0_2px_rgba(10,132,255,0.2)]"
                                : "border-white/10 bg-[#3a3a3c] text-white/90"
                            )}
                          >
                            {ghostKeys.map((k, i) => (
                              <span
                                key={i}
                                className={classNames(
                                  "px-1 sm:px-1.5 py-0.5 rounded-md min-w-[18px] sm:min-w-[20px] text-center",
                                  isAssigning
                                    ? "bg-blue-500/10"
                                    : "bg-white/5 border border-white/5"
                                )}
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Locked Row */}
                        <div className="p-3 sm:p-4 flex justify-between items-center opacity-70 gap-3">
                          <div className="min-w-0">
                            <div className="text-[13px] sm:text-[14px] font-medium text-white leading-tight">
                              Refresh Window List
                            </div>
                            <div className="text-[11px] sm:text-[12px] text-[#86868b] mt-1">
                              Capture screen only — not assignable
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 bg-[#3a3a3c] text-[12px] sm:text-[13px] text-white/50 font-mono tracking-widest whitespace-nowrap shadow-inner">
                              ⌘ R
                            </div>
                            <Lock size={13} className="text-[#86868b]" />
                          </div>
                        </div>
                      </div>

                      {isAssigning && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] sm:text-[12px] text-[#86868b] mb-6 ml-1"
                        >
                          Press your desired key combination. Escape to cancel.
                        </motion.div>
                      )}
                      {!isAssigning && (
                        <div className="text-[11px] sm:text-[12px] text-[#86868b] mb-6 ml-1">
                          Global shortcuts work system-wide, even when the app
                          is in the background.
                        </div>
                      )}

                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#86868b] uppercase mb-3 ml-1">
                        Reset
                      </div>
                      <div className="bg-[#262629] border border-white/5 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer">
                        <RotateCcw size={15} className="text-[#86868b] shrink-0" />
                        <div>
                          <div className="text-[13px] sm:text-[14px] font-medium text-white leading-tight">
                            Reset to Default
                          </div>
                          <div className="text-[11px] sm:text-[12px] text-[#86868b] mt-0.5">
                            Restore all hotkeys to factory settings
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right — key display */}
                    <div className="w-full md:w-1/2 md:pl-8 flex flex-col items-center justify-center py-4 sm:py-8 md:py-0 md:-mt-10">
                      <div
                        className={classNames(
                          "text-[11px] sm:text-[12px] font-bold tracking-widest uppercase mb-6 sm:mb-8",
                          isAssigning ? "text-[#0A84FF]" : "text-[#86868b]"
                        )}
                      >
                        {isAssigning
                          ? "Listening for keys..."
                          : "Current Shortcut"}
                      </div>

                      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {ghostKeys.map((k, i) => (
                          <div
                            key={i}
                            className={classNames(
                              "w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-[22px] sm:text-[28px] font-semibold transition-all duration-300",
                              isAssigning
                                ? "bg-gradient-to-b from-[#41a0ff] to-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.4)] border border-[#7ec0ff] text-white"
                                : "bg-[#252528] border border-white/10 shadow-[0_6px_12px_rgba(0,0,0,0.4)] text-white/90"
                            )}
                          >
                            {k}
                          </div>
                        ))}
                      </div>

                      <p className="text-center text-[12px] sm:text-[13px] text-[#86868b] max-w-[240px] sm:max-w-[280px] leading-relaxed">
                        {isAssigning
                          ? "Press your desired combination of modifiers and exactly one regular key. Escape to cancel."
                          : "This shortcut instantly toggles floating windows into pass-through mode."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex flex-col items-center justify-center w-[64px] sm:w-[76px] h-[56px] sm:h-[64px] rounded-xl sm:rounded-2xl cursor-pointer group transition-colors select-none",
        active
          ? "bg-[#333336] text-[#0A84FF] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          : "text-[#86868b] hover:text-white"
      )}
    >
      <div
        className={classNames(
          "transition-transform",
          !active && "group-hover:scale-105"
        )}
      >
        {icon}
      </div>
      <span
        className={classNames(
          "text-[10px] sm:text-[11px] font-medium tracking-wide",
          active && "font-semibold text-white"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div
      className={classNames(
        "relative w-[40px] sm:w-[44px] h-[24px] sm:h-[26px] rounded-full transition-colors duration-300 ease-in-out shadow-inner border shrink-0",
        active
          ? "bg-[#34C759] border-[#34C759]/20"
          : "bg-[#3a3a3c] border-black/20"
      )}
    >
      <div
        className={classNames(
          "absolute top-[2px] left-[2px] w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out border border-black/5",
          active ? "translate-x-[16px] sm:translate-x-[18px]" : "translate-x-0"
        )}
      />
    </div>
  );
}

function RadioItem({
  title,
  sub,
  active,
  isLast,
}: {
  title: string;
  sub?: string;
  active: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4",
        !isLast && "border-white/5"
      )}
    >
      <div>
        <div className="text-[13px] sm:text-[15px] font-medium text-white">
          {title}
        </div>
        {sub && (
          <div className="text-[11px] sm:text-[13px] text-[#86868b] mt-0.5">
            {sub}
          </div>
        )}
      </div>
      <div
        className={classNames(
          "w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ml-4",
          active ? "border-[#0A84FF]" : "border-[#86868b]"
        )}
      >
        {active && (
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#0A84FF] rounded-full" />
        )}
      </div>
    </div>
  );
}

function AppListItem({
  iconBg,
  iconContent,
  title,
  subtitle,
  resolution,
  isStreaming,
  isIsolated,
  isLast,
  playRef,
  stopRef,
}: any) {
  const active = title === "Antigravity" && isStreaming;
  return (
    <div
      className={classNames(
        "flex items-center px-3 sm:px-4 py-2.5 sm:py-3 transition-colors",
        active ? "bg-[#2b88ff]" : "hover:bg-white/5",
        !isIsolated && !isLast ? "border-b border-white/[0.04]" : "",
        isIsolated
          ? "rounded-xl sm:rounded-2xl bg-[#2b88ff] border-none shadow-lg"
          : ""
      )}
    >
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-white/5"
        style={{ background: iconBg }}
      >
        {iconContent}
      </div>
      <div className="ml-3 sm:ml-4 flex-1 min-w-0">
        <div
          className={classNames(
            "text-[13px] sm:text-[14px] font-medium mb-0.5 tracking-tight truncate",
            active ? "text-white" : "text-white"
          )}
        >
          {title}
        </div>
        <div
          className={classNames(
            "text-[11px] sm:text-[12px] truncate",
            active ? "text-white/80" : "text-[#86868b]"
          )}
        >
          {subtitle}
        </div>
      </div>
      {resolution && (
        <div className="flex items-center gap-3 sm:gap-5 text-[#86868b] shrink-0 ml-2">
          <span
            className={classNames(
              "text-[11px] sm:text-[12px] font-mono font-medium hidden xs:block",
              active ? "text-white/80" : "text-[#86868b]"
            )}
          >
            {resolution}
          </span>
          {/* Play/Stop button — ref attached here for cursor targeting */}
          <div
            ref={active ? stopRef : playRef}
            className={classNames(
              "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer",
              active
                ? "bg-[#FF3B30] text-white border-none"
                : "bg-[#2c2c2e] hover:bg-white/20 text-white/80 hover:text-white border border-white/10"
            )}
          >
            {active ? (
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-sm" />
            ) : (
              <Play size={12} fill="currentColor" className="ml-0.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}