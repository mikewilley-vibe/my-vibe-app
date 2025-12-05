import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!message || !email) {
      return new Response("Missing required fields", { status: 400 });
    }

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "no-reply@example.com",
      to: process.env.CONTACT_TO_EMAIL || "you@example.com",
      subject: name
        ? `New message from ${name} via Mike's Vibe Coder HQ`
        : "New contact form message",
      reply_to: email,
      text: `
From: ${name || "Unknown"}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response("Error sending email", { status: 500 });
  }
}