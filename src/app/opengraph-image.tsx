import { ImageResponse } from "next/og";

export const alt = "Lufra — Picture-in-Picture for macOS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #fbfbfd 0%, #e8e8ed 50%, #d2d2d7 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#6e6e73",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Lufra · macOS
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: "#1d1d1f",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          Multitask.
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: "#1d1d1f",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 40,
          }}
        >
          Without limits.
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#6e6e73",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Float any app above everything else. 60fps. Zero latency. Native macOS design.
        </div>
      </div>
    ),
    { ...size }
  );
}
