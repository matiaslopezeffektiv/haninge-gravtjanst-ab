const { Resend } = require('resend');

// Bas64-uppskattning: ~4 tecken per 3 bytes. 6 MB text ≈ 4,5 MB bifogad fil —
// gott om marginal över den 4 MB-gräns klienten redan sätter.
const MAX_IMAGE_BASE64_LENGTH = 6 * 1024 * 1024;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY saknas i miljövariablerna.');
    res.status(500).json({ error: 'E-postutskick är inte konfigurerat än. Kontakta oss direkt på telefon.' });
    return;
  }

  const { name, phone, email, address, service, message, imageBase64, imageFilename, imageType } = req.body || {};

  if (!name || !email || !phone || !address || !message) {
    res.status(400).json({ error: 'Namn, telefon, e-post, adress/område och beskrivning krävs.' });
    return;
  }

  if (imageBase64 && imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
    res.status(400).json({ error: 'Bilden är för stor. Max 4 MB.' });
    return;
  }

  const subject = `Ny offertförfrågan — ${service || 'Ospecificerad tjänst'}`;

  const html = `
    <h2>Ny offertförfrågan</h2>
    <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
    <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
    <p><strong>Adress/område:</strong> ${escapeHtml(address)}</p>
    ${service ? `<p><strong>Tjänst:</strong> ${escapeHtml(service)}</p>` : ''}
    <p><strong>Beskrivning:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    ${imageBase64 ? '<p><em>Se bifogad bild.</em></p>' : ''}
  `;

  const attachments = [];
  if (imageBase64 && imageFilename) {
    attachments.push({
      filename: imageFilename,
      content: imageBase64,
    });
  }

  try {
    const toEmails = process.env.CONTACT_TO_EMAIL
      ? process.env.CONTACT_TO_EMAIL.split(',').map((addr) => addr.trim())
      : ['matias@effektivmedia.nu'];

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Haninge Grävtjänst AB <no-reply@effektivmedia.nu>',
      to: toEmails,
      reply_to: email,
      subject,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Kunde inte skicka meddelandet. Försök igen senare.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Kunde inte skicka meddelandet. Försök igen senare.' });
  }
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
