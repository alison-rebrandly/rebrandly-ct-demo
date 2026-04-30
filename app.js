/**
 * MetricFlow Demo Site - Rebrandly Conversion Tracking Events
 *
 * Events tracked (only 2 — everything else is silent):
 * 1. "purchase"        — fires on Buy Now click for one of 3 paid plans (Starter $19, Professional $79, Enterprise $299)
 * 2. "talk_to_sales"   — fires on Talk to Sales form submit
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

  // Buy Now buttons (pricing.html — 3 paid plans)
  document.querySelectorAll(".buy-now").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var plan = btn.getAttribute("data-plan");
      var revenue = PLAN_PRICES[plan] || 0;

      track("purchase", revenue, "USD", {
        plan: plan,
        billingCycle: "monthly",
      });

      var originalText = btn.textContent;
      btn.textContent = "✓ Purchased!";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    });
  });

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
