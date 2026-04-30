/**
 * Ledgerly Demo Site - Rebrandly Conversion Tracking Events
 *
 * Events tracked (only 2 — everything else is silent):
 * 1. "purchase"        — fires on checkout form submit (Starter $19, Professional $79, Enterprise $299).
 *                        Fires from the per-plan checkout page (checkout-starter.html etc.), NOT the pricing page.
 * 2. "talk_to_sales"   — fires on Talk to Sales form submit (pricing page).
 *
 * Page views are tracked automatically by the Rebrandly SDK snippet.
 * Free plan signup, nav clicks, and other CTAs are NOT tracked by design.
 */

(function () {
  "use strict";

  var PLAN_PRICES = {
    starter: 19.0,
    professional: 79.0,
    enterprise: 299.0,
  };

  function track(eventName, revenue, currency, properties) {
    if (typeof trackConversion === "function") {
      var payload = { eventName: eventName };
      if (revenue != null) payload.revenue = revenue;
      if (currency) payload.currency = currency;
      if (properties) payload.properties = properties;
      trackConversion(payload);
    }
    console.log("[Rebrandly CT]", eventName, { revenue: revenue, currency: currency, properties: properties });
  }

  // Checkout form (one of checkout-starter.html, checkout-professional.html, checkout-enterprise.html)
  var checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var plan = checkoutForm.getAttribute("data-plan");
      var revenue = PLAN_PRICES[plan] || 0;
      var data = new FormData(checkoutForm);

      track("purchase", revenue, "USD", {
        plan: plan,
        billingCycle: "monthly",
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
      });

      checkoutForm.innerHTML = '<div style="padding: 2rem; text-align: center;"><div style="font-size: 2.5rem; margin-bottom: 0.5rem;">✓</div><h2 style="margin-bottom: 0.5rem;">Payment confirmed</h2><p style="color: var(--text-light); margin-bottom: 1.5rem;">Welcome to Ledgerly ' + plan.charAt(0).toUpperCase() + plan.slice(1) + '. Setup instructions are on their way to your inbox.</p><a href="index.html" class="btn btn-secondary">Back to home</a></div>';
    });
  }

  // Talk to Sales form (pricing.html)
  var salesForm = document.getElementById("talk-to-sales-form");
  if (salesForm) {
    salesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(salesForm);

      track("talk_to_sales", null, null, {
        name: data.get("name"),
        email: data.get("email"),
        company: data.get("company"),
      });

      salesForm.innerHTML = '<div style="padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.15); border-radius: 8px;"><strong>✓ Thanks — sales will be in touch.</strong></div>';
    });
  }
})();
