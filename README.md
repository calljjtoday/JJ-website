# calljjtoday.com
**JJ Kramer — Southern Oregon's #1 Real Estate Agent**

Built with plain HTML/CSS/JS. Hosted on Netlify. No frameworks, no build step.

---

## Folder Structure

```
calljjtoday/
├── index.html              ← Homepage
├── netlify.toml            ← Netlify config, redirects, headers
├── css/
│   └── style.css           ← All styles (mobile-first)
├── js/
│   ├── main.js             ← Nav, ROI calc, form handling, animations
│   └── components.js       ← Shared nav + footer injected into every page
├── pages/
│   ├── sell.html           ← Seller / Home Valuation page
│   ├── invest.html         ← Investor Hub page
│   ├── buy.html            ← Buyer / MLS Search page (add IDX here)
│   ├── about.html          ← About JJ page
│   ├── contact.html        ← Contact page
│   ├── luxury.html         ← Luxury homes page
│   ├── relocate.html       ← Relocation guide
│   └── areas/              ← Neighborhood landing pages (SEO)
│       ├── central-point.html
│       ├── medford.html
│       └── ... (one per area)
├── images/                 ← Add JJ's photos here
│   └── jj-kramer.jpg       ← Replace placeholder in about-img divs
└── netlify/
    └── functions/
        └── lead-notify.js  ← Serverless: email + Zapier on form submit
```

---

## Deploying to Netlify

### Option A — Drag & Drop (fastest)
1. Go to netlify.com → Log in
2. Drag the entire `calljjtoday` folder onto the Netlify dashboard
3. It's live instantly with a random `.netlify.app` URL

### Option B — GitHub (recommended for ongoing updates)
1. Create a GitHub repo: `calljjtoday`
2. Push this folder: `git init && git add . && git commit -m "init" && git push`
3. In Netlify: New site → Import from GitHub → select repo
4. Auto-deploys on every push

---

## Connecting the Domain (GoDaddy → Netlify)

1. In Netlify: Site settings → Domain management → Add custom domain → `calljjtoday.com`
2. Netlify will show you two nameservers (e.g. `dns1.p01.nsone.net`)
3. In GoDaddy: My Products → calljjtoday.com → DNS → Change Nameservers → paste Netlify's
4. Wait 24–48 hours for propagation
5. SSL certificate is automatic — Netlify handles it

---

## Setting Up Netlify Forms (Lead Capture)

Forms work automatically — no backend code needed for basic capture.

1. Deploy the site
2. Netlify auto-detects `data-netlify="true"` on forms
3. Go to Netlify dashboard → Forms → you'll see all submissions
4. Add email notifications: Forms → select form → Notifications → Email notification

**Forms included:**
- `home-valuation-hero` — hero section
- `home-valuation` — sell page / homepage valuation section
- `home-valuation-sell` — sell page
- `investor-deal-alert` — investor hub deal alerts
- `guide-download` — 1031 guide download
- `contact` — general contact

---

## Setting Up the Lead Notification Function

The `lead-notify.js` serverless function sends JJ an instant branded email on every lead.

### Step 1 — Get Resend API key (free)
1. Go to resend.com → Create account
2. Create API key → copy it

### Step 2 — Set environment variables in Netlify
Netlify dashboard → Site settings → Environment variables → Add:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` (from Resend) |
| `NOTIFY_EMAIL` | `jj@calljjtoday.com` (JJ's email) |
| `ZAPIER_WEBHOOK` | Your Zapier webhook URL (optional) |

### Step 3 — Connect function to forms
Netlify dashboard → Forms → select form → Notifications → Outgoing webhook:
```
https://calljjtoday.com/.netlify/functions/lead-notify
```
Repeat for each form.

---

## Connecting Zapier → Mailchimp

1. Go to zapier.com → Create Zap
2. Trigger: Webhooks by Zapier → Catch Hook → copy the webhook URL
3. Paste URL into `ZAPIER_WEBHOOK` environment variable in Netlify
4. Action: Mailchimp → Add/Update Subscriber
5. Map fields: email → email, name → name, lead-type → tag
6. Create separate Zaps per lead type for different Mailchimp tags:
   - Seller Lead → tag: "Seller Lead"
   - Investor Lead → tag: "Investor Lead"
   - Buyer Lead → tag: "Buyer Lead"

---

## Adding JJ's Photo

Replace the placeholder emoji in any `about-img` div:
```html
<!-- Find this: -->
<div class="about-img"><span>👤</span></div>

<!-- Replace with: -->
<div class="about-img"><img src="/images/jj-kramer.jpg" alt="JJ Kramer"></div>
```

Add photo to `/images/jj-kramer.jpg` — recommend 800×1000px JPG, under 200KB.

---

## Adding IDX (Phase 2)

When MLS access is approved, add the search to `/pages/buy.html`.

**Option A — Showcase IDX widget (quick)**
They'll give you a JS snippet — paste into the buy page where marked.

**Option B — RESO API (custom, no monthly fee)**
- Add Supabase for listing data storage
- Build search UI in `/pages/buy.html`
- Add sync function in `/netlify/functions/mls-sync.js`
- Claude Code can build this entire layer

---

## Google Analytics Setup

Uncomment and replace in `index.html` `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
Replace `G-XXXXXXXXXX` with your GA4 measurement ID.

---

## Facebook Pixel Setup

Uncomment and replace in `index.html` `<head>`:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXXXXXXXX');
  fbq('track', 'PageView');
</script>
```
Replace `XXXXXXXXXXXXXXXX` with your Pixel ID from Meta Business Suite.

---

## Monthly Cost (Full Stack)

| Item | Cost |
|---|---|
| Netlify hosting | Free |
| Netlify Forms (100 sub/mo) | Free |
| Resend email (3,000/mo) | Free |
| Zapier (100 tasks/mo) | Free |
| Mailchimp (500 contacts) | Free |
| GA4 + Facebook Pixel | Free |
| Domain (GoDaddy) | Already paid |
| **Total to launch** | **$0/mo** |

Scales cheaply when needed.
