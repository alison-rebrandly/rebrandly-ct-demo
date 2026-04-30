# Ledgerly — Rebrandly Conversion Tracking demo

A live demoable site that shows how Rebrandly's Conversion Tracking attributes clicks, page views, and revenue back to the marketing channel that generated them.

The site mocks a fictional fintech product (**Ledgerly**, an AP automation platform) so the demo feels like attribution working on a real customer's site — independent of Rebrandly's own product.

## Live URLs

- **Ledgerly demo site:** https://alison-rebrandly.github.io/rebrandly-ct-demo/
- **Channel mockup view:** https://alison-rebrandly.github.io/rebrandly-ct-demo/channels.html

The channel view shows 11 platform mockups (Instagram, Reddit, email, LinkedIn ad, Google ad, Facebook ad, Twitter, newsletter, affiliate blog, Slack DM referral, direct browser) each with a real Rebrandly tracked CTA. Click any of them and you land on the Ledgerly site with channel attribution.

## What gets tracked

| Event | Where it fires | Revenue |
|---|---|---|
| `page_view` | Every Ledgerly page (auto from Rebrandly SDK) | — |
| `signup` | Free signup form submit (`/signup.html`) | — |
| `purchase` | Starter checkout submit (`/checkout-starter.html`) | $19 USD |
| `purchase` | Professional checkout submit (`/checkout-professional.html`) | $79 USD |
| `talk_to_sales` | Pricing page footer form, or Enterprise contact form (`/contact-enterprise.html`) | — |

## Running the demo

1. Open the channel mockup view above.
2. Click any of the 11 platform CTAs — you'll be redirected through a Rebrandly short link to the Ledgerly site, with the channel attribution recorded.
3. Browse Ledgerly. Sign up free, buy a Starter or Professional plan with the test card number `12345`, or fill the Enterprise sales form.
4. The conversion event lands in the Rebrandly Conversion Tracking dashboard, attributed to whichever channel you clicked from.

## Site structure

- `index.html` — Ledgerly home
- `features.html` + `feature-*.html` — feature overview and deep-dives
- `industry-*.html` — industry pages (SaaS, Professional Services, Healthcare, Manufacturing, Nonprofits)
- `pricing.html` — 4 plans (Free, Starter, Professional, Enterprise) + Talk to Sales form
- `checkout-{plan}.html` — Starter and Professional checkout
- `contact-enterprise.html` — Enterprise sales form
- `signup.html` — Free signup
- `channels.html` — audience-facing channel mockup view
- `app.js` — fires the conversion events
- `style.css` — site styling

## Credits

Forked from [karlissaablay/rebrandly-ct-demo](https://github.com/karlissaablay/rebrandly-ct-demo) — the original MetricFlow demo built by Karlissa Ablay. This fork was rebranded to Ledgerly so it doesn't visually overlap with marketing-attribution use cases when used in product/sales presentations.
