import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone, lawCollege, resumeUrl, company } = body as Record<
    string,
    unknown
  >;

  // Honeypot: real applicants never fill a field named "company" (hidden via CSS).
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof lawCollege !== "string" ||
    !lawCollege.trim() ||
    typeof resumeUrl !== "string" ||
    !resumeUrl.startsWith("https://")
  ) {
    return NextResponse.json(
      { error: "Please complete all fields and attach a resume." },
      { status: 400 },
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`internship:${ip}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.error("Internships form: RESEND_API_KEY or CONTACT_TO_EMAIL not set.");
    return NextResponse.json(
      { error: "The application form is not yet configured. Please email your application directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Chamber Website <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Internship application from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Law College/University: ${lawCollege}`,
      `Resume: ${resumeUrl}`,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Could not send application. Please try again or email directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
