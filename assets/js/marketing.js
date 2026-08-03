(function () {
  "use strict";

  // Add the real GTM container ID here only after it is supplied by the owner.
  const GTM_CONTAINER_ID = "";

  window.dataLayer = window.dataLayer || [];
  window.sadafroniaTrack = function (eventName, parameters) {
    window.dataLayer.push(Object.assign({ event: eventName }, parameters || {}));
  };

  // Consent Mode defaults to denied until a consent interface records a choice.
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  if (GTM_CONTAINER_ID && /^GTM-[A-Z0-9]+$/.test(GTM_CONTAINER_ID)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_CONTAINER_ID);
    document.head.appendChild(script);
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("tel:")) window.sadafroniaTrack("contact_click", { method: "phone" });
    if (href.startsWith("mailto:")) window.sadafroniaTrack("contact_click", { method: "email" });
    if (href.includes("wa.me/")) window.sadafroniaTrack("contact_click", { method: "whatsapp" });
    if (href.includes("contact.html")) window.sadafroniaTrack("generate_lead", { destination: href });
  });

  document.addEventListener("click", function (event) {
    const addToCart = event.target.closest("[data-product-modal-cart]");
    if (addToCart) window.sadafroniaTrack("add_to_cart");
    const checkout = event.target.closest(".cart-checkout");
    if (checkout) window.sadafroniaTrack("begin_checkout");
    const product = event.target.closest("[data-product-open]");
    if (product) window.sadafroniaTrack("view_item", {
      item_id: product.dataset.id || "",
      item_name: product.dataset.name || ""
    });
  });

  document.addEventListener("submit", function (event) {
    if (event.target.matches("[data-contact-form]")) {
      window.sadafroniaTrack("generate_lead", { method: "contact_form" });
    }
    if (event.target.matches("[data-newsletter]")) {
      window.sadafroniaTrack("sign_up", { method: "newsletter" });
    }
    if (event.target.matches("[data-checkout-form]")) {
      window.sadafroniaTrack("purchase_intent", { method: "checkout_form" });
    }
  });

  const trackedDepths = new Set();
  window.addEventListener("scroll", function () {
    const available = document.documentElement.scrollHeight - innerHeight;
    if (available <= 0) return;
    const depth = Math.round((scrollY / available) * 100);
    [25, 50, 75, 90].forEach(function (threshold) {
      if (depth >= threshold && !trackedDepths.has(threshold)) {
        trackedDepths.add(threshold);
        window.sadafroniaTrack("scroll_depth", { percent: threshold });
      }
    });
  }, { passive: true });
})();
