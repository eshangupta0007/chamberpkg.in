import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public/images/logo-seal.png"),
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          backgroundColor: "#17140F",
          fontFamily: "serif",
        }}
      >
        <img src={logoSrc} width={160} height={158} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "#F5EFE0",
          }}
        >
          Chamber of Praveen Kumar Gupta
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#B8860B" }}>
          Advocates · Since 1991
        </div>
      </div>
    ),
    { ...size },
  );
}
