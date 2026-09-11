import { ReplitConnectors } from "@replit/connectors-sdk";

const notificationRecipient = "khalidhawari763@gmail.com";

type ContactNotification = {
  id: number;
  name: string;
  email: string;
  message: string;
};

export async function sendContactNotification({
  id,
  name,
  email,
  message,
}: ContactNotification): Promise<void> {
  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("resend", "/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Khalid Hawari Portfolio <onboarding@resend.dev>",
      to: [notificationRecipient],
      reply_to: email,
      subject: `New portfolio message from ${name}`,
      text: [
        `New message from ${name}`,
        `Reply to: ${email}`,
        `Message ID: ${id}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend returned ${response.status}: ${detail.slice(0, 300)}`);
  }
}