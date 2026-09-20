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
          backgroundColor: "#0E1113",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(201,169,97,0.16), rgba(14,17,19,0) 42%)",
          fontFamily: "serif",
        }}
      >
        {/* Gilt edge along the head, as on the site. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
            background: "linear-gradient(to right, #B8984F, #E4CA82 50%, #B8984F)",
          }}
        />
        <img src={logoSrc} width={168} height={166} alt="" />
        <div
          style={{
            marginTop: 30,
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.028em",
            color: "#EFE9DC",
          }}
        >
          Chamber of Praveen Kumar Gupta
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            width: 220,
            height: 2,
            backgroundColor: "#C9A961",
          }}
        />
        <div
          style={{
            marginTop: 20,
            fontSize: 25,
            letterSpacing: "0.16em",
            color: "#C9A961",
          }}
        >
          ADVOCATES · SINCE 1991
        </div>
      </div>
    ),
    { ...size },
  );
}
