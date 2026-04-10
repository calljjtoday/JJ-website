/* ============================================================
   calljjtoday.com — Shared Components
   Inject nav and footer into every page
   ============================================================ */

const NAV_HTML = `
<nav class="nav">
  <div class="nav-inner">
    <!-- Left: CALL JJ TODAY | John L. Scott — mirrors Image 2 layout -->
    <a href="/index.html" class="nav-brand">
      <img src="/calljj-logo.svg" alt="Call JJ Today" class="nav-jls-logo">
    </a>
    <!-- Center: nav links -->
    <ul class="nav-links">
      <li><a href="/pages/buy.html">Buy</a></li>
      <li><a href="/pages/sell.html">Sell</a></li>
      <li><a href="/pages/invest.html">Invest</a></li>
      <li><a href="/index.html#areas">Areas</a></li>
      <li><a href="/pages/about.html">About JJ</a></li>
    </ul>
    <!-- Right: CTA + hamburger -->
    <a href="tel:+18663145072" class="nav-cta">Call Now</a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-mobile" id="nav-mobile">
  <a href="/pages/buy.html">🏠 Buy a Home</a>
  <a href="/pages/sell.html">💵 Sell Your Home</a>
  <a href="/pages/invest.html">📈 Investment Properties</a>
  <a href="/index.html#areas">📍 Areas Served</a>
  <a href="/pages/about.html">👤 About JJ</a>
  <a href="/pages/contact.html">✉️ Contact</a>
  <a href="tel:5418402992" class="nav-mobile-cta">📞 (541) 840-2992</a>
</div>`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <img src="/calljj-logo.svg" alt="Call JJ Today · John L. Scott" style="height: 60px; width: auto; margin-bottom: 16px; display: block;">
      <p>Southern Oregon's #1 ranked real estate agent. Serving Jackson County and the Rogue Valley since 2002.</p>
      <small>Licensed Oregon Broker · John L. Scott Real Estate · Equal Housing Opportunity</small>
    </div>
    <div class="footer-col">
      <h4>Buy</h4>
      <a href="/pages/buy.html">Search All Homes</a>
      <a href="/pages/buy.html#map">Map Search</a>
      <a href="/pages/buy.html#new">New Listings</a>
      <a href="/pages/buy.html#guide">Buyer's Guide</a>
    </div>
    <div class="footer-col">
      <h4>Sell</h4>
      <a href="/pages/sell.html">Free Home Valuation</a>
      <a href="/pages/sell.html#process">Selling Process</a>
      <a href="/pages/sell.html#stats">Market Reports</a>
    </div>
    <div class="footer-col">
      <h4>Invest</h4>
      <a href="/pages/invest.html">Investment Listings</a>
      <a href="/pages/invest.html#calculator">ROI Calculator</a>
      <a href="/pages/invest.html#alerts">Deal Alerts</a>
      <a href="/pages/invest.html#guide">1031 Exchange Guide</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 calljjtoday.com · JJ Kramer · John L. Scott Real Estate · All Rights Reserved</p>
    <p><a href="/pages/privacy.html" style="color:rgba(255,255,255,0.2)">Privacy Policy</a> · Equal Housing Opportunity</p>
  </div>
</footer>`;

// Inject into page
document.getElementById('nav-placeholder')?.insertAdjacentHTML('afterbegin', NAV_HTML);
document.getElementById('footer-placeholder')?.insertAdjacentHTML('afterbegin', FOOTER_HTML);
