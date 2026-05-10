import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user ?? "noreply@insisint.com";

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass, from };
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const config = getSmtpConfig();

  if (!config) {
    console.warn("[mailer] SMTP não configurado — email não enviado.");
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
  });

  return { skipped: false };
}
