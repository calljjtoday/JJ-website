// ============================================================
// netlify/functions/lead-notify.js
// Triggered by Netlify Forms via webhook
// Sends instant SMS/email notification to JJ's team
// ============================================================
//
// SETUP:
// 1. In Netlify dashboard → Forms → select a form → "Notifications"
// 2. Add webhook: https://calljjtoday.com/.netlify/functions/lead-notify
// 3. Set environment variables in Netlify dashboard:
//    - NOTIFY_EMAIL     = jj@calljjtoday.com (or team email)
//    - RESEND_API_KEY   = re_xxxxxxxxxxxx (from resend.com)
//    - ZAPIER_WEBHOOK   = https://hooks.zapier.com/... (optional)
// ============================================================

const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const { form_name, data } = payload;

    // Build notification message
    const leadType  = data['lead-type'] || 'New Lead';
    const source    = data['source']    || form_name;
    const name      = data['name']      || 'Unknown';
    const phone     = data['phone']     || 'Not provided';
    const email     = data['email']     || 'Not provided';
    const address   = data['address']   || '';
    const intent    = data['intent']    || data['timeline'] || '';
    const budget    = data['budget']    || '';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    const subject = `🔔 New ${leadType} — ${name} | calljjtoday.com`;

    const body = `
NEW LEAD — ${leadType.toUpperCase()}
${'='.repeat(40)}

Name:     ${name}
Phone:    ${phone}
Email:    ${email}
${address   ? `Address:  ${address}\n`  : ''}
${intent    ? `Intent:   ${intent}\n`   : ''}
${budget    ? `Budget:   ${budget}\n`   : ''}
Source:   ${source}
Time:     ${timestamp} PT

${'='.repeat(40)}
Respond within 5 minutes for best conversion.
Call or text: ${phone}
    `.trim();

    // ── SEND EMAIL VIA RESEND ──
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFY_EMAIL   = process.env.NOTIFY_EMAIL || 'jj@calljjtoday.com';

    if (RESEND_API_KEY) {
      await sendEmail({
        apiKey: RESEND_API_KEY,
        to:      NOTIFY_EMAIL,
        from:    'leads@calljjtoday.com',
        subject,
        text:    body,
        html:    buildEmailHTML({ leadType, name, phone, email, address, intent, budget, source, timestamp })
      });
    }

    // ── FORWARD TO ZAPIER (routes to Mailchimp + CRM) ──
    const ZAPIER_WEBHOOK = process.env.ZAPIER_WEBHOOK;
    if (ZAPIER_WEBHOOK) {
      await sendWebhook(ZAPIER_WEBHOOK, {
        ...data,
        form_name,
        lead_type:  leadType,
        source,
        timestamp,
        site: 'calljjtoday.com'
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: `Lead notification sent for ${name}` })
    };

  } catch (err) {
    console.error('Lead notify error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// ── EMAIL HTML TEMPLATE ──
function buildEmailHTML({ leadType, name, phone, email, address, intent, budget, source, timestamp }) {
  return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 8px; max-width: 520px; margin: 0 auto; overflow: hidden; }
  .header { background: #0B1F3A; padding: 24px 32px; }
  .header h1 { color: #C9922A; font-size: 18px; margin: 0; }
  .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 4px 0 0; }
  .body { padding: 28px 32px; }
  .badge { display:inline-block; background:#C9922A; color:white; font-size:11px; font-weight:700; padding:4px 12px; border-radius:100px; letter-spacing:1px; text-transform:uppercase; margin-bottom:20px; }
  .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
  .row:last-child { border:none; }
  .label { color: #888; }
  .value { font-weight: 600; color: #1A1A2E; }
  .cta { background:#0B1F3A; border-radius:6px; padding:14px 24px; text-align:center; margin-top:24px; }
  .cta a { color:#C9922A; font-weight:700; font-size:15px; text-decoration:none; }
  .footer { background:#f9f9f9; padding:16px 32px; font-size:11px; color:#999; border-top:1px solid #eee; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>🔔 New Lead — calljjtoday.com</h1>
    <p>${timestamp} PT</p>
  </div>
  <div class="body">
    <div class="badge">${leadType}</div>
    <div class="row"><span class="label">Name</span><span class="value">${name}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value"><a href="tel:${phone.replace(/\D/g,'')}">${phone}</a></span></div>
    <div class="row"><span class="label">Email</span><span class="value">${email}</span></div>
    ${address ? `<div class="row"><span class="label">Address</span><span class="value">${address}</span></div>` : ''}
    ${intent  ? `<div class="row"><span class="label">Intent / Timeline</span><span class="value">${intent}</span></div>` : ''}
    ${budget  ? `<div class="row"><span class="label">Budget</span><span class="value">${budget}</span></div>` : ''}
    <div class="row"><span class="label">Source</span><span class="value">${source}</span></div>
    <div class="cta"><a href="tel:${phone.replace(/\D/g,'')}">📞 Call ${name} Now</a></div>
  </div>
  <div class="footer">Respond within 5 minutes for best conversion rate · calljjtoday.com</div>
</div>
</body>
</html>`;
}

// ── RESEND EMAIL HELPER ──
function sendEmail({ apiKey, to, from, subject, text, html }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ from, to: [to], subject, text, html });
    const options = {
      hostname: 'api.resend.com',
      path:     '/emails',
      method:   'POST',
      headers:  {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── ZAPIER WEBHOOK HELPER ──
function sendWebhook(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
