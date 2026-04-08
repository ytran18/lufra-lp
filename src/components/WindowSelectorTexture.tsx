"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, SRGBColorSpace, type Texture } from "three";
import { useFrame } from "@react-three/fiber";

type Vec2 = { x: number; y: number };
type TabKey = "capture" | "general" | "shortcut" | "about";

function getHiDPIScale() {
  if (typeof window === "undefined") return 2;
  // Cap to keep GPU uploads reasonable but still crisp.
  const dpr = typeof window.devicePixelRatio === "number" ? window.devicePixelRatio : 1;
  return Math.max(1, Math.min(3, Math.round(dpr * 2) / 2));
}

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

function easeInOutCubic(t: number) {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerp2(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

type Phase =
  | "reset"
  | "moveToPlay"
  | "clickDown1"
  | "clickUp1"
  | "streamOn"
  | "moveToPip"
  | "moveToStop"
  | "clickDown2"
  | "clickUp2"
  | "streamOff"
  | "moveAway";

const phaseDur: Record<Phase, number> = {
  reset: 1.0,
  moveToPlay: 1.0,
  clickDown1: 0.15,
  clickUp1: 0.2,
  streamOn: 1.0,
  moveToPip: 2.0,
  moveToStop: 1.5,
  clickDown2: 0.15,
  clickUp2: 0.2,
  streamOff: 0.0,
  moveAway: 2.0,
};

type SimState = {
  startedAt: number;
  phase: Phase;
  phaseStart: number;
  cursorPos: Vec2;
  cursorFrom: Vec2;
  cursorTo: Vec2;
  cursorScale: number;
  streaming: boolean;
  selectedId: "public";
  activeTab: TabKey;
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  // Guard against negative/invalid sizes (can happen when a layout region collapses).
  const ww = Number.isFinite(w) ? w : 0;
  const hh = Number.isFinite(h) ? h : 0;
  if (ww <= 0 || hh <= 0) return;
  const rr = Math.max(0, Math.min(Math.max(0, r), ww / 2, hh / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(21, 21);
  ctx.lineTo(12.8, 21);
  ctx.lineTo(6.8, 31.5);
  ctx.closePath();

  ctx.fillStyle = "#000";
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function drawFavicon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  variant: "globe" | "doc"
) {
  // Neutral "browser-y" favicons (no brand / no logo).
  drawRoundedRect(ctx, x, y, size, size, Math.max(6, Math.round(size * 0.28)));
  ctx.fillStyle = "#141417";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  if (variant === "doc") {
    // Document with folded corner
    const pad = Math.round(size * 0.22);
    const w = size - pad * 2;
    const h = size - pad * 2;
    const dx = x + pad;
    const dy = y + pad;
    drawRoundedRect(ctx, dx, dy, w, h, 6);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(dx + w * 0.62, dy);
    ctx.lineTo(dx + w, dy);
    ctx.lineTo(dx + w, dy + h * 0.38);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dx + 8, dy + h * 0.48);
    ctx.lineTo(dx + w - 8, dy + h * 0.48);
    ctx.moveTo(dx + 8, dy + h * 0.66);
    ctx.lineTo(dx + w - 16, dy + h * 0.66);
    ctx.stroke();
    return;
  }

  // Globe
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.32;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(78,182,255,0.18)";
  ctx.fill();
  ctx.strokeStyle = "rgba(78,182,255,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.5;
  // meridians
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.55, r, 0, 0, Math.PI * 2);
  ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();
  // equator
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.stroke();
}

function useLoadedImage(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    image.onload = () => {
      if (!cancelled) setImg(image);
    };
    image.onerror = () => {
      if (!cancelled) setImg(null);
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return img;
}

export function useWindowSelectorTexture({
  autoPlay = true,
  width = 1024,
  height = 660,
}: {
  autoPlay?: boolean;
  width?: number;
  height?: number;
}): Texture {
  const hiDpiScale = useMemo(() => getHiDPIScale(), []);
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = Math.round(width * hiDpiScale);
    c.height = Math.round(height * hiDpiScale);
    return c;
  }, [width, height, hiDpiScale]);

  const tex = useMemo(() => {
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [canvas]);

  // Intentionally avoid drawing any real screenshot assets that may include logos/branding.
  // We'll render a neutral "webpage" mock directly on canvas for the PiP preview.

  const simRef = useRef<SimState | null>(null);

  useEffect(() => {
    if (!autoPlay) return;
    const now = performance.now() / 1000;
    simRef.current = {
      startedAt: now,
      phase: "reset",
      phaseStart: now + 1.0, // initial delay like WindowSelectorDemo
      cursorPos: { x: 500, y: 800 },
      cursorFrom: { x: 500, y: 800 },
      cursorTo: { x: 500, y: 800 },
      cursorScale: 1,
      streaming: false,
      selectedId: "public",
      activeTab: "capture",
    };
  }, [autoPlay]);

  const draw = (ctx: CanvasRenderingContext2D, state: SimState) => {
    const W = width;
    const H = height;
    const contentTop = 72;
    const padX = 32;

    // Render at higher resolution, then sample down as a texture.
    ctx.setTransform(hiDpiScale, 0, 0, hiDpiScale, 0, 0);

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#1c1c1e";
    ctx.fillRect(0, 0, W, H);

    // Top bar
    // Subtle vertical gradient for depth.
    const topGrad = ctx.createLinearGradient(0, 0, 0, 72);
    topGrad.addColorStop(0, "rgba(44,44,46,0.92)");
    topGrad.addColorStop(1, "rgba(37,37,40,0.82)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, 72);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, 72.5);
    ctx.lineTo(W, 72.5);
    ctx.stroke();

    // Window dots
    const dotX = 24;
    const dotY = 36;
    const dots = ["#FF5F56", "#FFBD2E", "#27C93F"];
    dots.forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(dotX + i * 18, dotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });

    // Title
    ctx.font =
      "600 13px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillStyle = "rgba(134,134,139,1)";
    ctx.fillText("Lufra — Select a Window", 120, 41);

    // Tabs bar
    const tabs: { key: TabKey; label: string }[] = [
      { key: "capture", label: "Capture" },
      { key: "general", label: "General" },
      { key: "shortcut", label: "Shortcut" },
      { key: "about", label: "About" },
    ];

    const tabsY = 10;
    const segW = 92;
    const gap = 10;
    const segH = 52;
    const tabsW = tabs.length * segW + (tabs.length - 1) * gap;
    const tabsX = W / 2 - tabsW / 2;

    tabs.forEach((tab, i) => {
      const segX = tabsX + i * (segW + gap);
      const isActive = state.activeTab === tab.key;
      if (isActive) {
        // Inset pill so it feels optically centered/balanced.
        const insetX = 4;
        const insetY = 6;
        drawRoundedRect(ctx, segX + insetX, tabsY + insetY, segW - insetX * 2, segH - insetY * 2, 14);
        ctx.fillStyle = "#3a3a3c";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = isActive ? "#fff" : "rgba(134,134,139,1)";
      ctx.font = `${isActive ? 800 : 700} 10px ui-sans-serif, system-ui, -apple-system`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tab.label, segX + segW / 2, tabsY + segH / 2 + 1);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    });

    // Content area
    ctx.fillStyle = "#1c1c1e";
    ctx.fillRect(0, contentTop, W, H - contentTop);

    const drawSectionHeader = (title: string, subtitle?: string) => {
      ctx.fillStyle = "#fff";
      ctx.font = "800 28px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(title, padX, contentTop + 70);
      if (subtitle) {
        ctx.fillStyle = "rgba(134,134,139,1)";
        ctx.font = "700 15px ui-sans-serif, system-ui, -apple-system";
        ctx.fillText(subtitle, padX, contentTop + 98);
      }
    };

    const drawMutedLabel = (text: string, x: number, y: number) => {
      ctx.fillStyle = "rgba(134,134,139,1)";
      ctx.font = "900 11px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(text, x, y);
    };

    const drawInfoCard = (x: number, y: number, w: number, h: number, title: string, lines: string[]) => {
      drawRoundedRect(ctx, x, y, w, h, 18);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#2a2a2e";
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "800 14px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(title, x + 18, y + 28);
      ctx.fillStyle = "rgba(134,134,139,1)";
      ctx.font = "650 13px ui-sans-serif, system-ui, -apple-system";
      lines.forEach((ln, i) => {
        ctx.fillText(ln, x + 18, y + 54 + i * 22);
      });
    };

    // List container
    const listX = padX;
    const listW = W - padX * 2;
    const rowH = 64;
    const radius = 16;

    // Rows
    const selected = state.selectedId;
    const streaming = state.streaming;

    const rows = [
      { id: "public", title: "public — Live preview", sub: "Google Chrome", res: "920×464" },
      { id: "lufra", title: "Lufra Dashboard — Stream", sub: "Google Chrome", res: "1440×900" },
      { id: "lufra-lp", title: "lufra-lp — localhost:3000", sub: "Google Chrome", res: "1710×1073" },
    ] as const;

    const drawListContainer = (x: number, y: number, w: number, h: number) => {
      drawRoundedRect(ctx, x, y, w, h, radius);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#2a2a2e";
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawWindowRow = (r: (typeof rows)[number], y: number, opts: { highlight: boolean; streamingPrimary: boolean }) => {
      const isActive = opts.highlight;
      const isPrimaryStreaming = opts.streamingPrimary;

      if (isActive) {
        ctx.fillStyle = "#007AFF";
        ctx.fillRect(listX, y, listW, rowH);
      }

      // favicon (neutral, browser-like; no app logo)
      const favX = listX + 16;
      const favY = y + 14;
      drawFavicon(ctx, favX, favY, 36, r.id === "public" ? "globe" : "doc");

      // text
      ctx.fillStyle = "#fff";
      ctx.font = "600 15px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(r.title, listX + 66, y + 35);
      ctx.fillStyle = isActive ? "rgba(255,255,255,0.8)" : "rgba(134,134,139,1)";
      ctx.font = "600 13px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(r.sub, listX + 66, y + 54);

      if (r.res) {
        ctx.fillStyle = isActive ? "rgba(255,255,255,0.8)" : "rgba(134,134,139,1)";
        ctx.font = "700 13px ui-sans-serif, system-ui, -apple-system";
        const metrics = ctx.measureText(r.res);
        ctx.fillText(r.res, listX + listW - 16 - 44 - 18 - metrics.width, y + 41);
      }

      // play/stop button
      const btnCx = listX + listW - 34;
      const btnCy = y + rowH / 2;
      ctx.beginPath();
      ctx.arc(btnCx, btnCy, 16, 0, Math.PI * 2);
      if (isPrimaryStreaming) ctx.fillStyle = "#FF3B30";
      else if (isActive) ctx.fillStyle = "rgba(255,255,255,0.2)";
      else ctx.fillStyle = "#2c2c2e";
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#fff";
      if (isPrimaryStreaming) {
        drawRoundedRect(ctx, btnCx - 5, btnCy - 5, 10, 10, 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(btnCx - 3, btnCy - 6);
        ctx.lineTo(btnCx + 7, btnCy);
        ctx.lineTo(btnCx - 3, btnCy + 6);
        ctx.closePath();
        ctx.fill();
      }
    };

    if (state.activeTab === "general") {
      drawSectionHeader("General", "Capture behavior & preferences");
      const cardW = listW;
      drawInfoCard(listX, contentTop + 140, cardW, 152, "Capture", [
        "Start on launch: On",
        "Pin window by default: On",
        "Recording quality: High",
      ]);
      drawInfoCard(listX, contentTop + 310, cardW, 132, "Privacy", [
        "Only capture selected window",
        "Never record audio",
      ]);
    } else if (state.activeTab === "shortcut") {
      drawSectionHeader("Shortcut", "Quick actions");
      const cardW = listW;
      drawInfoCard(listX, contentTop + 140, cardW, 176, "Keyboard", [
        "Start/Stop: ⌘ ⇧ R",
        "Toggle PiP: ⌘ ⌥ P",
        "Next window: ⌘ ⌥ →",
        "Prev window: ⌘ ⌥ ←",
      ]);
    } else if (state.activeTab === "about") {
      drawSectionHeader("About", "Lufra for macOS");
      const cardW = listW;
      drawInfoCard(listX, contentTop + 140, cardW, 170, "App", [
        "Version: 1.0.0",
        "Build: 1024",
        "Made by Antigravity",
      ]);
    } else {
      // capture (default)
      if (streaming) {
        drawSectionHeader("Select Window", "3 available");

        const selectedHeaderY = contentTop + 130;
        drawMutedLabel("SELECTED WINDOWS", listX + 2, selectedHeaderY);

        const selectedY = contentTop + 148;
        drawListContainer(listX, selectedY, listW, rowH);
        const selectedRow = rows.find((r) => r.id === selected) ?? rows[0];
        drawWindowRow(selectedRow, selectedY, { highlight: true, streamingPrimary: true });

        const otherHeaderY = selectedY + rowH + 42;
        drawMutedLabel("OTHER WINDOWS", listX + 2, otherHeaderY);

        const otherRows = rows.filter((r) => r.id !== selected);
        const otherY = otherHeaderY + 18;
        drawListContainer(listX, otherY, listW, rowH * otherRows.length);
        otherRows.forEach((r, i) => {
          const y = otherY + i * rowH;
          if (i !== otherRows.length - 1) {
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.beginPath();
            ctx.moveTo(listX, y + rowH + 0.5);
            ctx.lineTo(listX + listW, y + rowH + 0.5);
            ctx.stroke();
          }
          drawWindowRow(r, y, { highlight: false, streamingPrimary: false });
        });
      } else {
        drawSectionHeader("Select Window", "3 available");

        const listY = contentTop + 140;
        drawListContainer(listX, listY, listW, rowH * rows.length);
        rows.forEach((r, i) => {
          const y = listY + i * rowH;
          const isActive = selected === r.id;
          if (i !== rows.length - 1) {
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.beginPath();
            ctx.moveTo(listX, y + rowH + 0.5);
            ctx.lineTo(listX + listW, y + rowH + 0.5);
            ctx.stroke();
          }
          drawWindowRow(r, y, { highlight: isActive, streamingPrimary: false });
        });
      }
    }

    // Streaming pill on top right
    if (streaming) {
      const pillW2 = 106;
      const pillH2 = 24;
      const px = W - 24 - pillW2;
      const py = 24;
      drawRoundedRect(ctx, px, py, pillW2, pillH2, 999);
      ctx.fillStyle = "#263e2e";
      ctx.fill();
      ctx.strokeStyle = "rgba(52,199,89,0.15)";
      ctx.stroke();

      const label = "1 ACTIVE";
      ctx.font = "800 10px ui-sans-serif, system-ui, -apple-system";
      const tm = ctx.measureText(label);
      const dotR = 3;
      const dotD = dotR * 2;
      const dotGap = 8;
      const groupW = dotD + dotGap + tm.width;
      const gx = px + (pillW2 - groupW) / 2;
      const cy = py + pillH2 / 2;

      ctx.beginPath();
      ctx.arc(gx + dotR, cy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = "#34C759";
      ctx.fill();

      ctx.fillStyle = "#34C759";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, gx + dotD + dotGap, cy + 0.5);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    // PiP window
    if (streaming) {
      const pipW = 440;
      const pipH = 280;
      // Position like CSS: right:-5px; bottom:-5px
      const pipX = W - pipW + 5;
      const pipY = H - pipH + 5;
      drawRoundedRect(ctx, pipX, pipY, pipW, pipH, 20);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 18;
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.stroke();

      // Browser-like chrome (tab + address bar). No logos.
      const chromeH = 68;
      ctx.fillStyle = "rgba(8,8,10,0.92)";
      ctx.fillRect(pipX, pipY, pipW, chromeH);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.moveTo(pipX, pipY + chromeH + 0.5);
      ctx.lineTo(pipX + pipW, pipY + chromeH + 0.5);
      ctx.stroke();

      // Tab pill
      const tabX = pipX + 18;
      const tabY = pipY + 12;
      const tabW = 210;
      const tabH = 22;
      drawRoundedRect(ctx, tabX, tabY, tabW, tabH, 10);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.stroke();
      drawFavicon(ctx, tabX + 6, tabY + 4, 14, "globe");
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "750 11px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("public — Live preview", tabX + 26, tabY + 15);

      // Address bar
      const addrX = pipX + 18;
      const addrY = pipY + 40;
      const addrW = pipW - 18 * 2 - 56;
      const addrH = 22;
      drawRoundedRect(ctx, addrX, addrY, addrW, addrH, 11);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.stroke();
      // lock icon
      ctx.fillStyle = "rgba(52,199,89,0.9)";
      ctx.beginPath();
      ctx.roundRect(addrX + 10, addrY + 8, 10, 10, 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = "700 10px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("https://public.lufra.app/stream", addrX + 28, addrY + 15);

      // Menu dots
      const mdx = pipX + pipW - 28;
      const mdy = addrY + 11;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(mdx, mdy + i * 6, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // fps badge (keep, but move to the right side)
      const fpsW = 52;
      const fpsH = 18;
      const fpsX = pipX + pipW - 18 - 56 - fpsW;
      const fpsY = pipY + 13;
      drawRoundedRect(ctx, fpsX, fpsY, fpsW, fpsH, 6);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "800 10px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("55 fps", fpsX + 12, fpsY + 12);

      // PiP page content (neutral browser page mock; no logos)
      const contentX = pipX;
      const contentY = pipY + chromeH;
      const contentW = pipW;
      const contentH = pipH - chromeH;

      // background gradient
      const bg = ctx.createLinearGradient(contentX, contentY, contentX, contentY + contentH);
      bg.addColorStop(0, "#0b0b0d");
      bg.addColorStop(1, "#111114");
      ctx.fillStyle = bg;
      ctx.fillRect(contentX, contentY, contentW, contentH);

      // subtle hero glow
      ctx.save();
      ctx.globalAlpha = 0.9;
      const glow = ctx.createRadialGradient(
        contentX + contentW * 0.35,
        contentY + contentH * 0.25,
        10,
        contentX + contentW * 0.35,
        contentY + contentH * 0.25,
        contentW * 0.7
      );
      glow.addColorStop(0, "rgba(78,182,255,0.18)");
      glow.addColorStop(1, "rgba(78,182,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(contentX, contentY, contentW, contentH);
      ctx.restore();

      // top page nav
      const navH = 40;
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(contentX, contentY, contentW, navH);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.moveTo(contentX, contentY + navH + 0.5);
      ctx.lineTo(contentX + contentW, contentY + navH + 0.5);
      ctx.stroke();

      // left nav items
      ctx.fillStyle = "rgba(255,255,255,0.70)";
      ctx.font = "800 10px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Dashboard", contentX + 16, contentY + 24);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "700 10px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Streams", contentX + 88, contentY + 24);
      ctx.fillText("Settings", contentX + 142, contentY + 24);

      // right pill button
      const ctaW = 78;
      const ctaH = 18;
      const ctaX = contentX + contentW - 16 - ctaW;
      const ctaY = contentY + 11;
      drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 999);
      ctx.fillStyle = "rgba(52,199,89,0.20)";
      ctx.fill();
      ctx.strokeStyle = "rgba(52,199,89,0.35)";
      ctx.stroke();
      ctx.fillStyle = "rgba(170,255,205,0.9)";
      ctx.font = "800 9px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("LIVE", ctaX + 28, ctaY + 12);
      ctx.beginPath();
      ctx.arc(ctaX + 18, ctaY + 9, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(52,199,89,0.95)";
      ctx.fill();

      // main content cards
      const gridX = contentX + 16;
      const gridY = contentY + navH + 14;
      const cardGap = 10;
      const cardW = (contentW - 16 * 2 - cardGap) / 2;
      const cardH = 70;

      const drawCard = (x: number, y: number, title: string, value: string, accent: string) => {
        drawRoundedRect(ctx, x, y, cardW, cardH, 14);
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.55)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.stroke();

        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = "750 9px ui-sans-serif, system-ui, -apple-system";
        ctx.fillText(title.toUpperCase(), x + 12, y + 22);

        ctx.fillStyle = "rgba(255,255,255,0.90)";
        ctx.font = "900 16px ui-sans-serif, system-ui, -apple-system";
        ctx.fillText(value, x + 12, y + 46);

        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x + cardW - 16, y + 18, 4, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCard(gridX, gridY, "Active viewers", "1,248", "rgba(78,182,255,0.95)");
      drawCard(gridX + cardW + cardGap, gridY, "Bitrate", "6.2 Mbps", "rgba(52,199,89,0.95)");
      drawCard(gridX, gridY + cardH + cardGap, "Latency", "182 ms", "rgba(255,204,0,0.95)");
      drawCard(gridX + cardW + cardGap, gridY + cardH + cardGap, "Dropped frames", "0.3%", "rgba(255,59,48,0.95)");

      // small chart placeholder
      const chartX = gridX;
      const chartY = gridY + (cardH + cardGap) * 2 + 6;
      const chartW = contentW - 32;
      const chartH = contentH - (chartY - contentY) - 14;
      // Only draw if there's enough room; otherwise avoid negative radii/layout.
      if (chartH >= 46) {
        drawRoundedRect(ctx, chartX, chartY, chartW, chartH, 14);
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.stroke();
        ctx.strokeStyle = "rgba(78,182,255,0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
          const xx = chartX + 12 + (i / steps) * (chartW - 24);
          const yy = chartY + chartH - 12 - (Math.sin(i * 0.75) * 0.35 + 0.55) * (chartH - 24);
          if (i === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // resize handle
      drawRoundedRect(ctx, pipX + pipW - 52, pipY + pipH - 52, 84, 84, 40);
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.stroke();
    }

    // Cursor
    drawCursor(ctx, state.cursorPos.x, state.cursorPos.y, state.cursorScale);
  };

  useFrame(() => {
    const ctx = canvas.getContext("2d");
    const sim = simRef.current;
    if (!ctx || !sim || !autoPlay) return;

    const t = performance.now() / 1000;
    if (t < sim.phaseStart) {
      // initial delay period uses default state
      draw(ctx, sim);
      tex.needsUpdate = true;
      return;
    }

    const elapsed = t - sim.phaseStart;
    const d = phaseDur[sim.phase];
    const p = d === 0 ? 1 : clamp01(elapsed / d);

    // Per-phase updates
    if (sim.phase === "moveToPlay" || sim.phase === "moveToPip" || sim.phase === "moveToStop" || sim.phase === "moveAway") {
      const eased = easeInOutCubic(p);
      sim.cursorPos = lerp2(sim.cursorFrom, sim.cursorTo, eased);
    }

    if (sim.phase === "clickDown1" || sim.phase === "clickDown2") {
      sim.cursorScale = 0.8;
    }
    if (sim.phase === "clickUp1" || sim.phase === "clickUp2") {
      sim.cursorScale = 1;
    }

    if (p >= 1) {
      // advance phase
      const advance = (next: Phase) => {
        sim.phase = next;
        sim.phaseStart = t;
      };

      switch (sim.phase) {
        case "reset": {
          sim.streaming = false;
          sim.cursorScale = 1;
          sim.activeTab = "capture";
          sim.cursorFrom = { x: 400, y: 700 };
          sim.cursorTo = { x: 400, y: 700 };
          sim.cursorPos = { x: 400, y: 700 };
          advance("moveToPlay");
          sim.cursorFrom = sim.cursorPos;
          sim.cursorTo = { x: 960, y: 240 };
          break;
        }
        case "moveToPlay":
          advance("clickDown1");
          break;
        case "clickDown1":
          advance("clickUp1");
          break;
        case "clickUp1":
          // trigger streaming
          sim.streaming = true;
          sim.selectedId = "public";
          sim.activeTab = "capture";
          advance("streamOn");
          break;
        case "streamOn":
          advance("moveToPip");
          sim.cursorFrom = sim.cursorPos;
          sim.cursorTo = { x: 740, y: 560 };
          break;
        case "moveToPip":
          advance("moveToStop");
          sim.cursorFrom = sim.cursorPos;
          // Stop button is in the isolated selected row under the "Selected window" tab.
          sim.cursorTo = { x: 960, y: 250 };
          break;
        case "moveToStop":
          advance("clickDown2");
          break;
        case "clickDown2":
          advance("clickUp2");
          break;
        case "clickUp2":
          sim.streaming = false;
          sim.activeTab = "capture";
          advance("streamOff");
          break;
        case "streamOff":
          advance("moveAway");
          sim.cursorFrom = sim.cursorPos;
          sim.cursorTo = { x: 400, y: 700 };
          break;
        case "moveAway":
          // loop
          advance("reset");
          break;
      }
    }

    draw(ctx, sim);
    tex.needsUpdate = true;
  });

  return tex;
}

