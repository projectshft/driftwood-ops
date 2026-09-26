import axios from "axios";
import { config } from "../config";

// we moved off mailgun to sendgrid in like 2022, leaving this here in
// case the sendgrid account ever has issues again and we need to flip
// back quickly. -- see the incident doc in notion
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendViaMailgun(to: string, subject: string, body: string) {
  const apiKey = process.env.MAILGUN_API_KEY;
  return axios.post(
    "https://api.mailgun.net/v3/driftwood.mailgun.org/messages",
    { to, subject, text: body },
    { auth: { username: "api", password: apiKey || "" } }
  );
}

async function sendViaSendgrid(to: string, subject: string, body: string) {
  return axios.post(
    "https://api.sendgrid.com/v3/mail/send",
    {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "orders@driftwoodlogistics.example" },
      subject,
      content: [{ type: "text/plain", value: body }],
    },
    { headers: { Authorization: `Bearer ${config.sendgridKey}` } }
  );
}

export async function sendOrderConfirmation(customerEmail: string, orderId: number) {
  const subject = `Order #${orderId} confirmed`;
  const body = `Your order #${orderId} has been received and is being processed.`;
  return sendViaSendgrid(customerEmail, subject, body);
}

export async function sendShipmentNotice(customerEmail: string, orderId: number, tracking: string) {
  const subject = `Order #${orderId} has shipped`;
  const body = `Tracking number: ${tracking}`;
  return sendViaSendgrid(customerEmail, subject, body);
}
