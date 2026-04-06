"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Settings,
  Command,
  Info,
  LayoutList,
  LayoutGrid,
  RefreshCw,
  Play,
  Square as SquareIcon,
  Crop,
  ExternalLink,
  Minus,
  Ghost,
  Circle,
} from "lucide-react";
import Image from "next/image";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const FinderIcon = () => (
  <div className="w-full h-full bg-gradient-to-b from-[#4eb6ff] to-[#007aff] relative overflow-hidden flex items-center justify-center p-1">
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[#004e9a] rounded-full shadow-sm" />
        <div className="w-1.5 h-1.5 bg-[#004e9a] rounded-full shadow-sm" />
      </div>
      <div className="w-4 h-1 border-b-[1.5px] border-[#004e9a] rounded-full mt-0.5" />
    </div>
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
  </div>
);

type WindowData = {
  id: string;
  title: string;
  sub: string;
  res: string;
  iconType: string;
};

export default function WindowSelectorDemo({ autoPlay = false }: { autoPlay?: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>("public");
  const [isStreaming, setIsStreaming] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 500, y: 800 });
  const [cursorScale, setCursorScale] = useState(1);

  React.useEffect(() => {
    if (!autoPlay) return;

    let mounted = true;

    const runSimulation = async () => {
      // Give initial delay
      await new Promise((r) => setTimeout(r, 1000));

      while (mounted) {
        // 1. Reset state
        setIsStreaming(false);
        setCursorPos({ x: 400, y: 700 });
        await new Promise((r) => setTimeout(r, 1000));
        if (!mounted) break;

        // 2. Move to first item's play button
        // x: ~900 (right-aligned area), y: ~218 (first item center below header)
        setCursorPos({ x: 960, y: 222 });
        await new Promise((r) => setTimeout(r, 1000));
        if (!mounted) break;

        // 3. Click down
        setCursorScale(0.8);
        await new Promise((r) => setTimeout(r, 150));
        if (!mounted) break;

        // 4. Click up + trigger action
        setCursorScale(1);
        await new Promise((r) => setTimeout(r, 200));
        setIsStreaming(true);
        setSelectedId("public");
        await new Promise((r) => setTimeout(r, 1000));
        if (!mounted) break;

        // 5. Move to PIP window center
        setCursorPos({ x: 740, y: 560 });
        await new Promise((r) => setTimeout(r, 2000));
        if (!mounted) break;

        // 6. Move back to stop button (item is now in the "Selected Windows" section)
        // The "Selected Windows" header adds ~40px of space above the item
        setCursorPos({ x: 960, y: 262 });
        await new Promise((r) => setTimeout(r, 1500));
        if (!mounted) break;

        // 7. Click down
        setCursorScale(0.8);
        await new Promise((r) => setTimeout(r, 150));
        if (!mounted) break;

        // 8. Click up + close stream
        setCursorScale(1);
        await new Promise((r) => setTimeout(r, 200));
        setIsStreaming(false);

        // 9. Move cursor away
        setCursorPos({ x: 400, y: 700 });
        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    runSimulation();
    return () => {
      mounted = false;
    };
  }, [autoPlay]);

  const windows: WindowData[] = [
    {
      id: "public",
      title: "public",
      sub: "Finder",
      res: "920x464",
      iconType: "finder",
    },
    {
      id: "lufra",
      title: "lufra — icon.png",
      sub: "Antigravity",
      res: "",
      iconType: "lufra",
    },
    {
      id: "lufra-lp",
      title: "lufra-lp — icon.png",
      sub: "Antigravity",
      res: "1710x1073",
      iconType: "lufra",
    },
  ];

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  const handlePlayToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isStreaming && selectedId === id) {
      setIsStreaming(false);
    } else {
      setSelectedId(id);
      setIsStreaming(true);
    }
  };

  const WindowItem = ({
    window,
    isSelected,
    isStreamingState,
    isIsolated,
    isFirst,
    isLast,
  }: {
    window: WindowData;
    isSelected: boolean;
    isStreamingState: boolean;
    isIsolated: boolean;
    isFirst: boolean;
    isLast: boolean;
  }) => {
    const active = isSelected && isStreamingState;

    return (
      <div
        onClick={() => handleItemClick(window.id)}
        className={classNames(
          "flex flex-row items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-white/[0.03]",
          isSelected ? "bg-[#007AFF]" : "bg-transparent hover:bg-white/5",
          isIsolated ? "rounded-[1rem] border-none shadow-lg" : "",
          !isIsolated && isFirst ? "rounded-t-[1rem]" : "",
          !isIsolated && isLast ? "rounded-b-[1rem] border-none" : ""
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[10px] bg-[#1e1e1e] flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/5">
            {window.iconType === "finder" ? (
              <FinderIcon />
            ) : (
              <Image
                src="/icon.png"
                alt="Icon"
                width={48}
                height={48}
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium tracking-tight">
              {window.title}
            </span>
            <span
              className={classNames(
                "text-[13px] tracking-tight mt-0.5",
                isSelected ? "text-white/80" : "text-[#86868b]"
              )}
            >
              {window.sub}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {window.res && (
            <span
              className={classNames(
                "text-[13px] font-medium tracking-wide",
                isSelected ? "text-white/80" : "text-[#86868b]"
              )}
            >
              {window.res}
            </span>
          )}

          <button
            onClick={(e) => handlePlayToggle(e, window.id)}
            className={classNames(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
              active
                ? "bg-[#FF3B30] text-white hover:bg-red-600 border-none"
                : isSelected
                  ? "bg-white/20 text-white hover:bg-white/30 border-none"
                  : "bg-[#2c2c2e] text-white/80 hover:text-white border border-white/10"
            )}
          >
            {active ? (
              <div className="w-[10px] h-[10px] bg-white rounded-[2px]" />
            ) : (
              <Play size={14} className="ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames(
        "mx-auto overflow-hidden bg-[#1c1c1e] text-white font-sans relative selection:bg-blue-500/30 select-none",
        autoPlay ? "w-full h-full shadow-none rounded-none border-none" : "w-full max-w-5xl rounded-xl shadow-2xl border border-white/10"
      )}
    >
      {/* Animated Cursor for simulation */}
      {autoPlay && (
        <motion.div
          initial={false}
          animate={{ x: cursorPos.x, y: cursorPos.y, scale: cursorScale }}
          transition={{
            x: { type: "spring", stiffness: 120, damping: 25 },
            y: { type: "spring", stiffness: 120, damping: 25 },
            scale: { duration: 0.1 },
          }}
          className="absolute top-0 left-0 z-[100] pointer-events-none"
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.4))' }}>
            <path d="M5.5 32.5L1 1.5L22.5 22.5H13L5.5 32.5Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
      <div className="h-[72px] flex px-4 items-center justify-between border-b border-black/20 bg-[#252528]/80 backdrop-blur-md">
        <div className="flex items-center w-1/3">
          <div className="flex gap-2 mr-4 ml-1">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 shadow-inner" />
          </div>
          <span className="text-[#86868b] text-[13px] font-semibold tracking-wide ml-2">
            Lufra — Select a Window
          </span>
        </div>

        <div className="flex justify-center items-center space-x-1 w-1/3 pt-1">
          <div className="flex flex-col items-center justify-center w-[72px] h-[58px] bg-[#3a3a3c] rounded-[14px] text-[#0A84FF] shadow-sm">
            <Video size={20} className="mb-1" strokeWidth={2.5} />
            <span className="text-[10px] font-semibold tracking-wide text-white">
              Capture
            </span>
          </div>
          <div className="flex flex-col items-center justify-center w-[72px] h-[58px] text-[#86868b] hover:text-white transition-colors cursor-pointer group">
            <Settings size={20} className="mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">
              General
            </span>
          </div>
          <div className="flex flex-col items-center justify-center w-[72px] h-[58px] text-[#86868b] hover:text-white transition-colors cursor-pointer group">
            <Command size={20} className="mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">
              Shortcuts
            </span>
          </div>
          <div className="flex flex-col items-center justify-center w-[72px] h-[58px] text-[#86868b] hover:text-white transition-colors cursor-pointer group">
            <Info size={20} className="mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">About</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/3 pr-2">
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                className="flex items-center gap-2 bg-[#263e2e] px-3 py-[5px] rounded-full shadow-inner border border-green-500/10"
              >
                <div className="w-[6px] h-[6px] rounded-full bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.8)]" />
                <span className="text-[#34C759] text-[10px] font-bold tracking-widest">
                  1 ACTIVE
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-8 flex flex-col h-full overflow-hidden relative bg-[#1c1c1e] min-h-[600px]">
        <div className="mt-8 mb-6 flex justify-between items-end shrink-0">
          <div>
            <h2 className="text-[28px] font-bold text-white mb-1 tracking-tight">
              Select Window
            </h2>
            <p className="text-[#86868b] text-[15px] font-medium tracking-wide">
              3 available
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex bg-[#2c2c2e] rounded-[10px] p-[3px] border border-white/5 shadow-sm">
              <button className="w-9 h-7 bg-[#4a4a4e] rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-white">
                <LayoutList size={16} strokeWidth={2} />
              </button>
              <button className="w-9 h-7 flex items-center justify-center text-[#86868b] hover:text-white transition-colors">
                <LayoutGrid size={16} strokeWidth={2} />
              </button>
            </div>

            <button className="text-[#86868b] hover:text-white transition-colors hover:rotate-180 duration-500 origin-center">
              <RefreshCw size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <div className="flex flex-col gap-0 relative z-10 w-full mb-10">
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-bold text-[#86868b] tracking-[0.1em] mb-2 mt-4 ml-2"
              >
                SELECTED WINDOWS
              </motion.div>
            )}

            {isStreaming && selectedId ? (
              <motion.div layoutId={`window-${selectedId}`} className="mb-6">
                <WindowItem
                  window={windows.find((w) => w.id === selectedId)!}
                  isSelected={true}
                  isStreamingState={true}
                  isIsolated={true}
                  isFirst={false}
                  isLast={false}
                />
              </motion.div>
            ) : null}

            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] font-bold text-[#86868b] tracking-[0.1em] mb-2 ml-2"
              >
                OTHER WINDOWS
              </motion.div>
            )}

            <motion.div layout className="bg-[#2a2a2e] rounded-[1rem] flex flex-col pt-0 pb-0 overflow-hidden shadow-md">
              {windows
                .filter((w) => !isStreaming || w.id !== selectedId)
                .map((w, i, arr) => (
                  <motion.div key={w.id} layout>
                    <WindowItem
                      window={w}
                      isSelected={!isStreaming && selectedId === w.id}
                      isStreamingState={false}
                      isIsolated={false}
                      isFirst={i === 0}
                      isLast={i === arr.length - 1}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-0">
          <div className="text-[#86868b] font-bold tracking-[0.15em] text-[11px] mb-1.5 uppercase">
            Did you know?
          </div>
          <div className="text-[#86868b] text-[13px] font-medium tracking-wide">
            Pinning: Windows always stay on top by default.
          </div>
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/80 to-transparent -z-10 h-32 -translate-y-20" />
        </div>

        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute bottom-32 right-10 w-[440px] h-[280px] rounded-2xl bg-black shadow-2xl border border-white/10 overflow-hidden flex flex-col z-50 ring-1 ring-black/50"
            >
              <div className="flex-1 w-full relative cursor-grab active:cursor-grabbing">
                {/* Header Toolbar matching image */}
                <div className="absolute top-0 left-0 right-0 h-[52px] bg-black/90 backdrop-blur-xl flex items-center px-4 justify-between z-20 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    <span className="text-white text-[13px] font-bold tracking-tight">
                      lufra — icon.png
                    </span>
                    <div className="bg-[#1c1c1e] text-white/70 text-[10px] font-bold px-2 py-1 rounded-[6px] border border-white/10 ml-1">
                      55 fps
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 text-white/50">
                    <Settings
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <Crop
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <ExternalLink
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <Minus
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <div className="w-[1px] h-3.5 bg-white/10" />
                    <Ghost
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <Circle
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                    <SquareIcon
                      size={15}
                      className="cursor-pointer hover:text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 pt-[52px]">
                  <Image
                    src="/app-bg.png"
                    alt="Window Content"
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-cover opacity-90"
                  />
                </div>

                <div className="absolute right-[-24px] bottom-[-20px] w-28 h-28 bg-black/80 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-center text-white cursor-nwse-resize shadow-2xl z-20">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-[-16px] ml-[-16px] opacity-40"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M9 21H3v-6" />
                    <path d="M21 3l-7 7" />
                    <path d="M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
