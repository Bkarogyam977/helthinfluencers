import nodemailer from 'nodemailer';

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export async function POST(request) {
  const body = await request.json();
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const social = (body.social || '').trim();

  if (!name || !email || !phone) {
    return Response.json(
      { success: false, message: 'Name, email and phone are required.' },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"BK Arogyam Website" <${process.env.EMAIL_HOST_USER}>`,
      to: 'arnovchaurasia8@gmail.com',
      replyTo: email,
      subject: 'New BK Arogyam Partner Registration',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInstagram/YouTube: ${social || '-'}`,
      html: `
        <h2>New Partner Registration</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Instagram/YouTube:</strong> ${escapeHtml(social) || '-'}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('SMTP send error:', err);
    return Response.json(
      { success: false, message: 'Could not send email.' },
      { status: 500 }
    );
  }
}
