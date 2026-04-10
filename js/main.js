/* ============================================================
   calljjtoday.com — Main JavaScript
   Nav, ROI Calculator, Form Handling, Animations
   ============================================================ */

/* ── MOBILE NAV ── */
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── ROI CALCULATOR ── */
function formatCurrency(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n;
}

function updateROI() {
  const priceEl = document.getElementById('calc-price');
  const rentEl  = document.getElementById('calc-rent');
  const downEl  = document.getElementById('calc-down');
  if (!priceEl) return;

  const price = +priceEl.value;
  const rent  = +rentEl.value;
  const down  = +downEl.value;

  // Update display labels
  document.getElementById('price-display').textContent = formatCurrency(price);
  document.getElementById('rent-display').textContent  = '$' + rent.toLocaleString();
  document.getElementById('down-display').textContent  = down + '%';

  // Calculations
  const annualRent = rent * 12;
  const expenses   = annualRent * 0.40; // 40% expense ratio
  const noi        = annualRent - expenses;
  const capRate    = ((noi / price) * 100).toFixed(1);

  const downAmt     = price * (down / 100);
  const loanAmt     = price - downAmt;
  const monthlyRate = 0.0725 / 12; // ~7.25% mortgage rate
  const n           = 360;
  const mortgage    = loanAmt > 0
    ? loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : 0;

  const monthlyCF = Math.round(rent - (expenses / 12) - mortgage);
  const cocReturn = downAmt > 0 ? ((monthlyCF * 12 / downAmt) * 100).toFixed(1) : '0.0';
  const grm       = (price / annualRent).toFixed(1);

  // Update results
  document.getElementById('result-cap').textContent = capRate + '%';
  document.getElementById('result-cf').textContent  =
    (monthlyCF >= 0 ? '+$' : '-$') + Math.abs(monthlyCF).toLocaleString();
  document.getElementById('result-coc').textContent = cocReturn + '%';
  document.getElementById('result-grm').textContent = grm + 'x';

  // Color cash flow
  const cfEl = document.getElementById('result-cf');
  if (cfEl) cfEl.style.color = monthlyCF >= 0 ? '#6EE7A0' : '#FC8181';
}

// Init calculator
const calcInputs = document.querySelectorAll('#calc-price, #calc-rent, #calc-down');
calcInputs.forEach(input => input.addEventListener('input', updateROI));
if (document.getElementById('calc-price')) updateROI();

/* ── NETLIFY FORM HANDLING ── */
function handleFormSubmit(formId, successId) {
  const form = document.getElementById(formId);
  const successEl = document.getElementById(successId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        form.style.display = 'none';
        if (successEl) {
          successEl.classList.add('show');
        }
        // Send to Zapier webhook if configured
        sendToZapier(Object.fromEntries(formData));
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      submitBtn.textContent = 'Try Again';
      submitBtn.disabled = false;
      alert('Something went wrong. Please call JJ directly at (541) 840-2992.');
    }
  });
}

// Wire up all forms
handleFormSubmit('hero-form', 'hero-success');
handleFormSubmit('valuation-form', 'valuation-success');
handleFormSubmit('sell-form', 'sell-success');
handleFormSubmit('investor-form', 'investor-success');
handleFormSubmit('contact-form', 'contact-success');

/* ── ZAPIER WEBHOOK (optional — add your webhook URL) ── */
async function sendToZapier(data) {
  const ZAPIER_WEBHOOK = ''; // Add your Zapier webhook URL here
  if (!ZAPIER_WEBHOOK) return;

  try {
    await fetch(ZAPIER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source_url: window.location.href
      })
    });
  } catch (err) {
    console.warn('Zapier webhook failed:', err);
  }
}

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });
