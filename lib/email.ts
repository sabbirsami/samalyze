import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendTicketResponseEmail(to: string, subject: string, response: string) {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Re: ${subject}`,
      text: response,
      html: `<div>
        <p>Thank you for contacting support. Here's our response:</p>
        <blockquote>${response}</blockquote>
        <p>If you need further assistance, please reply to this email.</p>
      </div>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
