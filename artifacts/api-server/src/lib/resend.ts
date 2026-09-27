import { Resend } from 'resend';

// Initialize Resend with your API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
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
  try {
    const data = await resend.emails.send({
      from: "Khalid Hawari Portfolio <onboarding@resend.dev>", // Using Resend Test Mode
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
    });

    if (!data.error) {
      // Success
    } else {
      throw new Error(`Resend API error: ${data.error.message}`);
    }
  } catch (error) {
    throw new Error(`Resend error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
