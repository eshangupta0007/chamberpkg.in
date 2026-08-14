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
          backgroundColor: "#1F3629",
          fontFamily: "serif",
        }}
      >
        <img src={logoSrc} width={160} height={158} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.021em",
            color: "#F3ECD8",
          }}
        >
          Chamber of Praveen Kumar Gupta
        </div>
        {/* Rule between the name and the standing line, matching the
            double-rule used at section heads on the site itself. */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            width: 220,
            height: 2,
            backgroundColor: "#C6A461",
          }}
        />
        <div
          style={{
            marginTop: 22,
            fontSize: 26,
            letterSpacing: "0.14em",
            color: "#C6A461",
          }}
        >
          ADVOCATES · SINCE 1991
        </div>
      </div>
    ),
    { ...size },
  );
}
