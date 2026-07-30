import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F0",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "3px solid #C9A227",
            alignItems: "center",
            justifyContent: "center",
            color: "#C9A227",
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          CPKG
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "#121212",
          }}
        >
          Chamber of Praveen Kumar Gupta
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#2B2B2E" }}>
          Advocates · Since 1991
        </div>
      </div>
    ),
    { ...size },
  );
}
