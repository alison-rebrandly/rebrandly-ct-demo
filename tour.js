/**
 * Guided Product Tour for Rebrandly Conversion Tracking — Ledgerly Demo
 *
 * Simplified 5-step flow:
 *   1. Install snippet (homepage)
 *   2. Page view auto-tracked (homepage)
 *   3. Custom events catalog (pricing)
 *   4. Form fill = custom event (signup)
 *   5. Revenue captured (thank-you)
 */

(function () {
  "use strict";

  var STEPS = {
    "index.html": [
      {
        target: "head-script",
        title: "1. Install the snippet",
        body:
          "Paste one line into the <code>&lt;head&gt;</code> of your site. That's it." +
          '<div class="tour-code-block"><code>&lt;script\n  src="https://cdn.test.rebrandly.com/sdk/v1/rbly.min.js"\n  data-api-key="YOUR_API_KEY"&gt;\n&lt;/script&gt;</code></div>',
        position: "bottom",
        highlight: ".nav",
        stepLabel: "Install Snippet",
      },
      {
        target: ".hero",
        title: "2. Page views tracked automatically",
        body: "When a visitor lands here from a Rebrandly link, the page view gets recorded. No extra code.",
        position: "bottom",
        stepLabel: "Install Snippet",
      },
      {
        targets: [
          { selector: 'a[href="pricing.html"].btn-primary.btn-large', label: "pricing_page_visit" },
          { selector: 'a[href="features.html"].btn-secondary.btn-large', label: "button_click" },
          { selector: 'a[href="industry-healthcare.html"]', label: "industry_page_visit" },
        ],
        title: "3. Track any custom event",
        body:
          "Beyond page views, fire a custom event for anything that matters — pick what counts as a conversion." +
          "<ul class=\"tour-event-list\">" +
            "<li><code>pricing_page_visit</code> — high-intent navigation</li>" +
            "<li><code>button_click</code> — CTAs, plan buttons</li>" +
            "<li><code>industry_page_visit</code> — segment signals</li>" +
            "<li><code>download</code> — gated assets, PDFs</li>" +
            "<li><code>webinar_signup</code> — form submits</li>" +
          "</ul>",
        position: "center",
        stepLabel: "Custom Events",
        nextPage: "pricing.html?tour=1&step=0",
      },
    ],

    "pricing.html": [
      {
        target: ".pricing-card.featured",
        title: "4. Track revenue events",
        body:
          "On pages where money happens, fire an event with the revenue value attached. That's how attribution flows back to the original link." +
          '<div class="tour-code-block"><code>trackConversion({\n  eventName: \'plan_selected\',\n  revenue: 79.00,\n  currency: \'USD\'\n});</code></div>',
        position: "left",
        stepLabel: "Custom Events",
        nextPage: "signup.html?tour=1&step=0",
      },
    ],

    "signup.html": [
      {
        target: "#signup-form",
        title: "5. Form fill = your conversion",
        body: "Fire one call when the form submits — that's your conversion, tied to the link that drove the click.",
        position: "right",
        stepLabel: "Custom Events",
        nextPage: "thank-you.html?tour=1&step=0&plan=professional",
      },
    ],

    "thank-you.html": [
      {
        target: ".success-icon",
        title: "6. Revenue, attributed back to the link",
        body: "$79 lands in your Rebrandly dashboard — tied to the exact link that drove the click. That's the full loop.",
        position: "bottom",
        stepLabel: "Custom Events",
      },
    ],
  };

  // ==============================
  // Tour Engine
  // ==============================

  var currentStepIndex = 0;
  var pageSteps = [];
  var backdrop, spotlight, tooltip, bar, launchBtn;
  var isActive = false;

  function getPageKey() {
    var path = window.location.pathname;
    var file = path.split("/").pop() || "index.html";
    return file.split("?")[0];
  }

  function init() {
    var pageKey = getPageKey();
    pageSteps = STEPS[pageKey] || [];
    if (pageSteps.length === 0) return;

    createElements();

    var params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "1") {
      var startStep = parseInt(params.get("step")) || 0;
      startTour(startStep);
    }
  }

  function createElements() {
    backdrop = document.createElement("div");
    backdrop.className = "tour-backdrop";
    backdrop.addEventListener("click", endTour);
    document.body.appendChild(backdrop);

    spotlight = document.createElement("div");
    spotlight.className = "tour-spotlight";
    document.body.appendChild(spotlight);

    tooltip = document.createElement("div");
    tooltip.className = "tour-tooltip";
    document.body.appendChild(tooltip);

    bar = document.createElement("div");
    bar.className = "tour-bar";
    document.body.appendChild(bar);

    launchBtn = document.createElement("button");
    launchBtn.className = "tour-launch";
    launchBtn.innerHTML = '<span class="tour-launch-icon">?</span> Start Demo Tour';
    launchBtn.addEventListener("click", function () {
      startTour(0);
    });
    document.body.appendChild(launchBtn);
  }

  function startTour(stepIndex) {
    isActive = true;
    currentStepIndex = stepIndex || 0;
    launchBtn.classList.add("hidden");
    backdrop.classList.add("visible");
    bar.classList.add("visible");
    showStep(currentStepIndex);
  }

  function endTour() {
    isActive = false;
    backdrop.classList.remove("visible");
    tooltip.classList.remove("visible");
    tooltip.classList.remove("tour-tooltip-center");
    bar.classList.remove("visible");
    spotlight.style.display = "none";
    launchBtn.classList.remove("hidden");

    var highlighted = document.querySelectorAll(".tour-highlight");
    highlighted.forEach(function (el) { el.classList.remove("tour-highlight"); });
    var labels = document.querySelectorAll(".tour-multi-label");
    labels.forEach(function (el) { el.remove(); });
  }

  function clearAllHighlights() {
    var prevHighlights = document.querySelectorAll(".tour-highlight");
    prevHighlights.forEach(function (el) { el.classList.remove("tour-highlight"); });
    var prevLabels = document.querySelectorAll(".tour-multi-label");
    prevLabels.forEach(function (el) { el.remove(); });
  }

  function showStep(index) {
    if (index < 0 || index >= pageSteps.length) return;
    currentStepIndex = index;
    var step = pageSteps[index];

    clearAllHighlights();

    // Multi-target step: highlight several elements at once with floating labels.
    if (step.targets && step.targets.length) {
      spotlight.style.display = "none";
      step.targets.forEach(function (t) {
        var el = document.querySelector(t.selector);
        if (!el) return;
        el.classList.add("tour-highlight");
        var label = document.createElement("span");
        label.className = "tour-multi-label";
        label.textContent = t.label;
        document.body.appendChild(label);
        var rect = el.getBoundingClientRect();
        label.style.top = (rect.top + window.scrollY - 28) + "px";
        label.style.left = (rect.left + window.scrollX) + "px";
      });
      // Scroll to the first target so the user can see at least one highlight.
      var firstEl = document.querySelector(step.targets[0].selector);
      if (firstEl) firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
      positionCenter(step);
      updateBar(index);
      return;
    }

    var targetEl = null;
    if (step.target === "head-script") {
      targetEl = document.querySelector(".nav");
    } else if (step.target) {
      targetEl = document.querySelector(step.target);
    }

    if (targetEl && step.position !== "center") {
      targetEl.classList.add("tour-highlight");
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(function () {
        positionTooltip(targetEl, step);
        positionSpotlight(targetEl);
      }, 350);
    } else {
      spotlight.style.display = "none";
      positionCenter(step);
    }

    updateBar(index);
  }

  function positionSpotlight(el) {
    var rect = el.getBoundingClientRect();
    var pad = 8;
    spotlight.style.display = "block";
    spotlight.style.top = (rect.top + window.scrollY - pad) + "px";
    spotlight.style.left = (rect.left + window.scrollX - pad) + "px";
    spotlight.style.width = (rect.width + pad * 2) + "px";
    spotlight.style.height = (rect.height + pad * 2) + "px";
  }

  function positionTooltip(el, step) {
    var rect = el.getBoundingClientRect();
    renderTooltipContent(step);

    tooltip.className = "tour-tooltip visible";
    tooltip.style.position = "absolute";
    var pos = step.position || "bottom";

    tooltip.style.top = "";
    tooltip.style.bottom = "";
    tooltip.style.left = "";
    tooltip.style.right = "";

    var gap = 16;

    if (pos === "bottom") {
      tooltip.classList.add("arrow-top");
      tooltip.style.top = (rect.bottom + window.scrollY + gap) + "px";
      tooltip.style.left = Math.max(16, rect.left + window.scrollX) + "px";
    } else if (pos === "top") {
      tooltip.classList.add("arrow-bottom");
      tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - gap) + "px";
      tooltip.style.left = Math.max(16, rect.left + window.scrollX) + "px";
    } else if (pos === "left") {
      tooltip.classList.add("arrow-right");
      tooltip.style.top = (rect.top + window.scrollY) + "px";
      tooltip.style.left = Math.max(16, rect.left + window.scrollX - tooltip.offsetWidth - gap) + "px";
    } else if (pos === "right") {
      tooltip.classList.add("arrow-left");
      tooltip.style.top = (rect.top + window.scrollY) + "px";
      tooltip.style.left = (rect.right + window.scrollX + gap) + "px";
    }

    var tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth - 16) {
      tooltip.style.left = (window.innerWidth - tooltip.offsetWidth - 16) + "px";
    }
    if (tooltipRect.left < 16) {
      tooltip.style.left = "16px";
    }
  }

  function positionCenter(step) {
    renderTooltipContent(step);
    tooltip.className = "tour-tooltip tour-tooltip-center visible";
  }

  function renderTooltipContent(step) {
    tooltip.style.top = "";
    tooltip.style.left = "";
    tooltip.style.right = "";
    tooltip.style.bottom = "";
    tooltip.classList.remove("tour-tooltip-center");

    var allPages = ["index.html", "pricing.html", "signup.html", "thank-you.html"];
    var pageKey = getPageKey();
    var totalSteps = 0;
    var currentGlobal = 0;
    for (var i = 0; i < allPages.length; i++) {
      var pSteps = STEPS[allPages[i]] || [];
      if (allPages[i] === pageKey) {
        currentGlobal = totalSteps + currentStepIndex;
      }
      totalSteps += pSteps.length;
    }

    var dots = "";
    for (var d = 0; d < totalSteps; d++) {
      var cls = "tour-progress-dot";
      if (d === currentGlobal) cls += " active";
      else if (d < currentGlobal) cls += " done";
      dots += '<span class="' + cls + '"></span>';
    }

    var isLastPage = pageKey === "thank-you.html";
    var isLastStep = currentStepIndex === pageSteps.length - 1;
    var isVeryLast = isLastPage && isLastStep;

    var nextBtnHtml;
    if (isVeryLast) {
      nextBtnHtml = '<button class="tour-btn tour-btn-primary" onclick="window._tour.end()">Finish Tour</button>';
    } else if (step.nextPage) {
      nextBtnHtml = '<button class="tour-btn tour-btn-primary" onclick="window._tour.goPage(\'' + step.nextPage + '\')">Next</button>';
    } else {
      nextBtnHtml = '<button class="tour-btn tour-btn-primary" onclick="window._tour.next()">Next</button>';
    }

    var backBtnHtml = currentGlobal > 0
      ? '<button class="tour-btn tour-btn-secondary" onclick="window._tour.prev()">Back</button>'
      : "";

    tooltip.innerHTML =
      '<button class="tour-btn-close" onclick="window._tour.end()">&times;</button>' +
      '<div class="tour-tooltip-header">' +
        '<span class="tour-tooltip-title">' + step.title + "</span>" +
      "</div>" +
      '<div class="tour-tooltip-body">' + step.body + "</div>" +
      '<div class="tour-tooltip-footer">' +
        '<div class="tour-progress">' + dots + "</div>" +
        '<div class="tour-nav">' + backBtnHtml + nextBtnHtml + "</div>" +
      "</div>";
  }

  function updateBar(index) {
    var stepLabels = ["Install Snippet", "Custom Events"];
    var pageKey = getPageKey();
    var allPages = ["index.html", "pricing.html", "signup.html", "thank-you.html"];
    var pageIndex = allPages.indexOf(pageKey);

    // Phase 0 = Install (index.html). Phase 1 = Custom Events (pricing, signup, thank-you).
    var barStep = pageIndex === 0 ? 0 : 1;

    var html = "";
    for (var i = 0; i < stepLabels.length; i++) {
      var cls = "tour-bar-step";
      if (i === barStep) cls += " active";
      else if (i < barStep) cls += " done";

      var numContent = i < barStep ? "✓" : (i + 1);

      html +=
        '<div class="' + cls + '">' +
          '<span class="tour-bar-step-num">' + numContent + '</span>' +
          '<span>' + stepLabels[i] + '</span>' +
        '</div>';

      if (i < stepLabels.length - 1) {
        var connCls = "tour-bar-connector";
        if (i < barStep) connCls += " done";
        html += '<div class="' + connCls + '"></div>';
      }
    }

    bar.innerHTML = html;
  }

  var PAGE_ORDER = ["index.html", "pricing.html", "signup.html", "thank-you.html"];

  window._tour = {
    start: function (step) { startTour(step); },
    end: function () { endTour(); },
    next: function () {
      if (currentStepIndex < pageSteps.length - 1) {
        showStep(currentStepIndex + 1);
      }
    },
    prev: function () {
      if (currentStepIndex > 0) {
        showStep(currentStepIndex - 1);
        return;
      }
      // At first step of current page — jump to last step of previous page.
      var pageKey = getPageKey();
      var pageIdx = PAGE_ORDER.indexOf(pageKey);
      if (pageIdx > 0) {
        var prevPage = PAGE_ORDER[pageIdx - 1];
        var prevSteps = STEPS[prevPage] || [];
        var lastStep = Math.max(0, prevSteps.length - 1);
        window.location.href = prevPage + "?tour=1&step=" + lastStep;
      }
    },
    goPage: function (url) {
      window.location.href = url;
    },
  };

  document.addEventListener("keydown", function (e) {
    if (!isActive) return;
    if (e.key === "Escape") endTour();
    if (e.key === "ArrowRight" || e.key === "Enter") {
      var step = pageSteps[currentStepIndex];
      if (step && step.nextPage) {
        window.location.href = step.nextPage;
      } else {
        window._tour.next();
      }
    }
    if (e.key === "ArrowLeft") window._tour.prev();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
