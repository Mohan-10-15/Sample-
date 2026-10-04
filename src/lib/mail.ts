import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { RegistrationInput } from "./schema";
import { siteConfig, formatEventDate, formatEventTime } from "./site";

/**
 * Confirmation email via Gmail SMTP.
 * Required env vars (see .env.example):
 *   SMTP_HOST     (smtp.gmail.com)
 *   SMTP_PORT     (465)
 *   SMTP_USER     (the sending Gmail address — an app password works best)
 *   SMTP_PASS     (Gmail app password)
 *   MAIL_FROM     (fallback: SMTP_USER)
 */

function getMailer(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

export async function sendConfirmationEmail(
  input: RegistrationInput,
  registrationId: string,
): Promise<boolean> {
  const transporter = getMailer();
  if (!transporter) return false;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const membersLine =
    input.members.length === 1 ? "one crewmate" : `${input.members.length} crewmates`;

  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;background:#0A0A0A;color:#EFE6D8;padding:40px 24px;">
    <div style="max-width:560px;margin:0 auto;border:1px solid #C9A227;padding:32px;background:#141414;">
      <p style="margin:0 0 6px;color:#C9A227;letter-spacing:3px;font-size:12px;">Reverse Hackathon 2026</p>
      <h1 style="margin:0 0 18px;font-size:28px;color:#EFE6D8;">Welcome to the Family.</h1>
      <p style="line-height:1.6;color:#C9BBA3;">The Family does not forget a name — and now, neither will we. Your seat at the table is reserved.</p>
      <table style="width:100%;margin:20px 0;border-top:1px solid #333;border-bottom:1px solid #333;padding:12px 0;color:#EFE6D8;">
        <tr><td style="padding:6px 0;color:#C9BBA3;">Registration ID</td><td style="padding:6px 0;text-align:right;color:#C9A227;letter-spacing:2px;">${registrationId}</td></tr>
        <tr><td style="padding:6px 0;color:#C9BBA3;">Team</td><td style="padding:6px 0;text-align:right;"><strong>${input.teamName}</strong> (Capo: ${input.leader.fullName})</td></tr>
        <tr><td style="padding:6px 0;color:#C9BBA3;">Date</td><td style="padding:6px 0;text-align:right;">${formatEventDate()} at ${formatEventTime()} IST</td></tr>
        <tr><td style="padding:6px 0;color:#C9BBA3;">Venue</td><td style="padding:6px 0;text-align:right;">${siteConfig.venue.name},<br/>${siteConfig.venue.college}</td></tr>
        <tr><td style="padding:6px 0;color:#C9BBA3;">Track</td><td style="padding:6px 0;text-align:right;">${siteConfig.tracks.find((t) => t.id === input.track)?.label ?? input.track}</td></tr>
        <tr><td style="padding:6px 0;color:#C9BBA3;">Crew</td><td style="padding:6px 0;text-align:right;">${membersLine} besides the Capo</td></tr>
      </table>
      <p style="line-height:1.6;color:#C9BBA3;">Bring a laptop, a charger, an open mind — and a steady nerve. Everything else is taken care of. For questions, write to <a href="mailto:${siteConfig.contact.email}" style="color:#C9A227;">${siteConfig.contact.email}</a>.</p>
      <p style="margin:24px 0 0;color:#8F7420;font-size:12px;letter-spacing:2px;">WHITEHAT CLUB · DEPARTMENT OF CYBER SECURITY</p>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: `"Reverse Hackathon 2026 — Whitehat Club" <${from}>`,
      to: input.leader.email,
      subject: `${registrationId} — You are part of the Family | Reverse Hackathon 2026`,
      html,
    });
    return true;
  } catch (error) {
    console.error("Confirmation email failed:", error);
    return false;
  }
}