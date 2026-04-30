/**
 * Ledgerly Demo Site - Rebrandly Conversion Tracking Events
 *
 * Three conversion events fire from this site:
 *
 * 1. "purchase"        — fires on checkout form submit on:
 *                          - checkout-starter.html       ($19 revenue)
 *                          - checkout-professional.html  ($79 revenue)
 *                        Carries plan + first/last name as properties.
 *
 * 2. "signup"          — fires on free signup form submit on signup.html (no revenue).
 *                        Carries first/last name + email + company.
 *
 * 3. "talk_to_sales"   — fires on sales form submit on:
 *                          - pricing.html (#talk-to-sales-form, source: pricing_footer)
 *                          - contact-enterprise.html (#contact-sales-form, source: enterprise_cta)
 *
 * Page views fire automatically from the Rebrandly SDK on every page.
 * Nothing else is tracked — nav clicks, CTA clicks, etc. are silent.
 */

(function () {
  "use strict";

  var PLAN_PRICES = {
    starter: 19.0,
    professional: 79.0,
    enterprise: 299.0,
  };

  function track(eventName, revenue, currency, properties) {
    var props = properties || {};
    if (window.rbly && typeof window.rbly.track === "function") {
      if (revenue != null) {
        window.rbly.track(eventName, props, revenue, currency || "USD");
      } else {
        window.rbly.track(eventName, props);
      }
    } else {
      console.warn("[Rebrandly CT] rbly.track not available — SDK may not be loaded yet");
    }
    console.log("[Rebrandly CT]", eventName, { revenue: revenue, currency: currency, properties: properties });
  }

  function replaceFormWithConfirmation(form, headline, subtext) {
    form.innerHTML = '<div style="padding: 2rem; text-align: center;">' +
      '<div style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--success);">✓</div>' +
      '<h2 style="margin-bottom: 0.5rem;">' + headline + '</h2>' +
      '<p style="color: var(--text-light); margin-bottom: 1.5rem;">' + subtext + '</p>' +
      '<a href="index.html" class="btn btn-secondary">Back to home</a>' +
      '</div>';
  }

  // 1. Checkout form (Starter or Professional) → purchase
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

      var planTitle = plan.charAt(0).toUpperCase() + plan.slice(1);
      replaceFormWithConfirmation(
        checkoutForm,
        "Payment confirmed",
        "Welcome to Ledgerly " + planTitle + ". Setup instructions are on their way to your inbox."
      );
    });
  }

  // 2. Free signup form → signup
  var freeSignupForm = document.getElementById("free-signup-form");
  if (freeSignupForm) {
    freeSignupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(freeSignupForm);

      track("signup", null, null, {
        plan: "free",
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        company: data.get("company"),
      });

      replaceFormWithConfirmation(
        freeSignupForm,
        "You're in",
        "Welcome to Ledgerly Free. Check your inbox for setup instructions."
      );
    });
  }

  // 3a. Talk to Sales (pricing page footer) → talk_to_sales
  var salesForm = document.getElementById("talk-to-sales-form");
  if (salesForm) {
    salesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(salesForm);

      track("talk_to_sales", null, null, {
        source: "pricing_footer",
        name: data.get("name"),
        email: data.get("email"),
        company: data.get("company"),
      });

      salesForm.innerHTML = '<div style="padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.15); border-radius: 8px;"><strong>✓ Thanks — sales will be in touch.</strong></div>';
    });
  }

  // 3b. Contact Sales (Enterprise CTA page) → talk_to_sales
  var contactSalesForm = document.getElementById("contact-sales-form");
  if (contactSalesForm) {
    contactSalesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactSalesForm);

      track("talk_to_sales", null, null, {
        source: contactSalesForm.getAttribute("data-source") || "contact_page",
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        company: data.get("company"),
        employees: data.get("employees"),
      });

      replaceFormWithConfirmation(
        contactSalesForm,
        "Thanks — we'll be in touch",
        "An account exec will reach out within one business day."
      );
    });
  }
})();
