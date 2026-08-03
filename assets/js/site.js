(() => {
  "use strict";

  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  });

  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".page-progress span");
  const updateScroll = () => {
    const current = window.scrollY;
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle("is-scrolled", current > 28);
    if (progress) progress.style.width = `${maximum > 0 ? (current / maximum) * 100 : 0}%`;
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });

  const cinematicSections = [...document.querySelectorAll(".closing-cta")];
  if (cinematicSections.length && !reduceMotion) {
    let cinematicFrame = 0;
    const updateCinematicSections = () => {
      cinematicFrame = 0;
      cinematicSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const start = window.innerHeight * 0.9;
        const end = window.innerHeight * 0.18;
        const progressValue = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        section.style.setProperty("--cinema-progress", progressValue.toFixed(3));
        section.style.setProperty("--cinema-image-brightness", (.78 + progressValue * .16).toFixed(3));
        section.style.setProperty("--cinema-image-scale", (1.08 - progressValue * .035).toFixed(4));
        section.style.setProperty("--cinema-image-shift", `${((.5 - progressValue) * 12).toFixed(2)}px`);
        section.style.setProperty("--cinema-content-opacity", (.72 + progressValue * .28).toFixed(3));
        section.style.setProperty("--cinema-content-shift", `${((1 - progressValue) * 34).toFixed(2)}px`);
      });
    };
    const requestCinematicUpdate = () => {
      if (cinematicFrame) return;
      cinematicFrame = window.requestAnimationFrame(updateCinematicSections);
    };
    updateCinematicSections();
    window.addEventListener("scroll", requestCinematicUpdate, { passive: true });
    window.addEventListener("resize", requestCinematicUpdate, { passive: true });
  } else {
    cinematicSections.forEach((section) => {
      section.style.setProperty("--cinema-progress", "1");
      section.style.setProperty("--cinema-image-brightness", ".94");
      section.style.setProperty("--cinema-image-scale", "1.045");
      section.style.setProperty("--cinema-image-shift", "-6px");
      section.style.setProperty("--cinema-content-opacity", "1");
      section.style.setProperty("--cinema-content-shift", "0px");
    });
  }

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const setMenu = (open) => {
    menuButton?.setAttribute("aria-expanded", String(open));
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    mobileMenu?.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      setCart(false);
    }
  });

  const revealElements = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.11, rootMargin: "0px 0px -4% 0px" },
    );
    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const heroVideo = document.querySelector("[data-hero-video]");
  const soundButton = document.querySelector("[data-sound]");
  const soundLabel = document.querySelector("[data-sound-label]");
  soundButton?.addEventListener("click", async () => {
    if (!heroVideo) return;
    heroVideo.muted = !heroVideo.muted;
    soundButton.classList.toggle("is-playing", !heroVideo.muted);
    if (soundLabel) soundLabel.textContent = heroVideo.muted ? "סרט שקט" : "הקול פעיל";
    if (heroVideo.paused) {
      try {
        await heroVideo.play();
      } catch {
        heroVideo.muted = true;
      }
    }
  });

  const typingTarget = document.querySelector("[data-typing]");
  const ribbonMessages = [
    "ה־Masterclass המקצועי לייצור יין — במחיר השקה",
    "YAYIN · גיליון היין הדיגיטלי החדש — לפתיחה",
    "סדנאות טעימה וימי חברה — להזמנת חוויה",
    "הצטרפו לעדכוני הבציר והקמת בית היין",
  ];
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const animateRibbon = async () => {
    if (!typingTarget) return;
    if (reduceMotion) {
      typingTarget.textContent = ribbonMessages[0];
      return;
    }
    let messageIndex = 0;
    while (document.contains(typingTarget)) {
      const message = ribbonMessages[messageIndex % ribbonMessages.length];
      for (let index = 0; index <= message.length; index += 1) {
        typingTarget.textContent = message.slice(0, index);
        await wait(34);
      }
      await wait(1800);
      for (let index = message.length; index >= 0; index -= 1) {
        typingTarget.textContent = message.slice(0, index);
        await wait(18);
      }
      await wait(260);
      messageIndex += 1;
    }
  };
  window.setTimeout(animateRibbon, 650);

  const adRotator = document.querySelector("[data-ad-rotator]");
  if (adRotator) {
    const slides = [...adRotator.querySelectorAll(".ad-slide")];
    const dotsWrap = adRotator.querySelector("[data-ad-dots]");
    let adIndex = 0;
    let adTimer;
    const showAd = (index) => {
      adIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === adIndex));
      dotsWrap?.querySelectorAll("button").forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === adIndex));
    };
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `באנר ${index + 1}`);
      dot.addEventListener("click", () => {
        showAd(index);
        window.clearInterval(adTimer);
        adTimer = window.setInterval(() => showAd(adIndex + 1), 10000);
      });
      dotsWrap?.append(dot);
    });
    showAd(0);
    if (!reduceMotion) adTimer = window.setInterval(() => showAd(adIndex + 1), 10000);
  }

  document.querySelectorAll(".testimonial-track").forEach((track) => {
    [...track.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    });
  });

  const reserveWines = [
    {
      id: "reserve-red",
      name: "SADAFRONIA Reserve Red",
      kicker: "RESERVE · RED",
      price: 119,
      image: "assets/images/generated/reserve-red.webp",
      note: "סדרת האשכול · אדום Reserve",
      description: "יין אדום מובחר מסדרת Reserve, בעל עומק, מבנה וסיומת ארוכה. סמל האשכול האדום הוא סימן ההיכר של הסדרה.",
    },
    {
      id: "reserve-white",
      name: "SADAFRONIA Reserve White",
      kicker: "RESERVE · WHITE",
      price: 119,
      image: "assets/images/generated/reserve-white.webp",
      note: "סדרת האשכול · לבן Reserve",
      description: "יין לבן מובחר מסדרת Reserve, רענן ומדויק, עם עומק ומרקם אלגנטי. סמל האשכול הזהוב־ירוק מייחד את היין הלבן בסדרה.",
    },
    {
      id: "reserve-rose",
      name: "SADAFRONIA Reserve Rosé",
      kicker: "RESERVE · ROSÉ",
      price: 99,
      image: "assets/images/generated/reserve-rose.webp",
      note: "סדרת האשכול · רוזה Reserve",
      description: "רוזה Reserve יבש ומעודן, בעל צבע סלמון אלגנטי, פרי אדום רענן וסיומת נקייה. סמל האשכול הוורוד משלים את זהות הסדרה.",
    },
  ];
  document.querySelectorAll(".product-marquee-group").forEach((group, groupIndex) => {
    reserveWines.forEach((wine) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.productCard = "";
      if (groupIndex === 0) card.id = wine.id;
      card.innerHTML = `
        <button type="button" class="product-image" data-product-open data-id="${wine.id}" data-name="${wine.name}" data-kicker="${wine.kicker}" data-price="${wine.price}" data-image="${wine.image}" data-note="${wine.note}" data-description="${wine.description}" data-quote="false" aria-label="פרטים על ${wine.name}">
          <img src="${wine.image}" alt="${wine.name}" loading="lazy" /><span class="product-view">לצפייה בפרטים</span>
        </button>
        <div class="product-copy"><small>${wine.kicker}</small><h3>${wine.name}</h3><span>${wine.note}</span><p>${wine.description}</p><div><strong>${money.format(wine.price)}</strong><button type="button" data-product-open data-id="${wine.id}" data-name="${wine.name}" data-kicker="${wine.kicker}" data-price="${wine.price}" data-image="${wine.image}" data-note="${wine.note}" data-description="${wine.description}" data-quote="false">פרטים ורכישה ←</button></div></div>`;
      group.append(card);
    });
  });

  const counters = [...document.querySelectorAll("[data-count]")];
  if (counters.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = Number(entry.target.dataset.count || 0);
          const started = performance.now();
          const duration = reduceMotion ? 1 : 1100;
          const tick = (now) => {
            const ratio = Math.min((now - started) / duration, 1);
            entry.target.textContent = String(Math.round(target * (1 - (1 - ratio) ** 3)));
            if (ratio < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((counter) => countObserver.observe(counter));
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const move = (direction) => {
      if (!track) return;
      track.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: reduceMotion ? "auto" : "smooth" });
    };
    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => move(-1));
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => move(1));
  });

  const yayinCover = document.querySelector(".yayin-cover");
  if (yayinCover && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    yayinCover.addEventListener("pointermove", (event) => {
      const bounds = yayinCover.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      yayinCover.style.animation = "none";
      yayinCover.style.transform = `perspective(1100px) rotateY(${x * -7}deg) rotateX(${y * 6}deg) translateY(-7px)`;
    });
    yayinCover.addEventListener("pointerleave", () => {
      yayinCover.style.animation = "";
      yayinCover.style.transform = "";
    });
  }

  const search = document.querySelector("[data-search]");
  const searchable = [...document.querySelectorAll("[data-searchable]")];
  const noResults = document.querySelector("[data-no-results]");
  search?.addEventListener("input", (event) => {
    const term = event.target.value.trim().toLowerCase();
    let visible = 0;
    searchable.forEach((card) => {
      const matches = !term || card.dataset.searchable.toLowerCase().includes(term);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (noResults) noResults.hidden = visible !== 0;
  });

  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  };

  const productModal = document.querySelector("[data-product-modal]");
  const productModalImage = document.querySelector("[data-product-modal-image]");
  const productModalName = document.querySelector("[data-product-modal-name]");
  const productModalKicker = document.querySelector("[data-product-modal-kicker]");
  const productModalNote = document.querySelector("[data-product-modal-note]");
  const productModalDescription = document.querySelector("[data-product-modal-description]");
  const productModalPrice = document.querySelector("[data-product-modal-price]");
  const productModalCart = document.querySelector("[data-product-modal-cart]");
  const productModalQuote = document.querySelector("[data-product-modal-quote]");
  const openProduct = (button) => {
    if (!productModal) return;
    const quoteOnly = button.dataset.quote === "true";
    if (productModalImage) {
      productModalImage.src = button.dataset.image || "";
      productModalImage.alt = button.dataset.name || "";
    }
    if (productModalName) productModalName.textContent = button.dataset.name || "";
    if (productModalKicker) productModalKicker.textContent = button.dataset.kicker || "";
    if (productModalNote) productModalNote.textContent = button.dataset.note || "";
    if (productModalDescription) productModalDescription.textContent = button.dataset.description || "";
    if (productModalPrice) productModalPrice.textContent = quoteOnly ? "הצעת מחיר מותאמת" : money.format(Number(button.dataset.price || 0));
    if (productModalCart) {
      productModalCart.hidden = quoteOnly;
      productModalCart.dataset.id = button.dataset.id || "";
      productModalCart.dataset.name = button.dataset.name || "";
      productModalCart.dataset.price = button.dataset.price || "0";
      productModalCart.dataset.image = button.dataset.image || "";
    }
    if (productModalQuote) {
      productModalQuote.hidden = !quoteOnly;
      productModalQuote.href = `contact.html?topic=quote&service=${encodeURIComponent(button.dataset.name || "")}`;
    }
    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  };
  const closeProduct = () => {
    productModal?.classList.remove("is-open");
    productModal?.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };
  document.querySelectorAll("[data-product-open]").forEach((button) => button.addEventListener("click", () => openProduct(button)));
  document.querySelector("[data-product-close]")?.addEventListener("click", closeProduct);

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-target]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const closeLightbox = () => {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };
  document.querySelectorAll("[data-lightbox-image]").forEach((button) => {
    button.addEventListener("click", () => {
      if (lightboxImage) {
        lightboxImage.src = button.dataset.lightboxImage || "";
        lightboxImage.alt = button.dataset.lightboxTitle || "";
      }
      if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxTitle || "";
      lightbox?.classList.add("is-open");
      lightbox?.setAttribute("aria-hidden", "false");
      body.classList.add("modal-open");
    });
  });
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const formEndpoint = "https://formsubmit.co/ajax/sadafronia@gmail.com";
  const submitByEmail = async (form, subject, successMessage) => {
    const submitButton = form.querySelector('[type="submit"]');
    const originalLabel = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }
    try {
      const formData = new FormData(form);
      formData.set("_subject", subject);
      formData.set("_template", "table");
      formData.set("_captcha", "false");
      formData.set("source_page", document.title);
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!response.ok) throw new Error(`Form service returned ${response.status}`);
      form.reset();
      showToast(successMessage);
    } catch (error) {
      console.error("SADAFRONIA form submission failed", error);
      showToast("השליחה לא הושלמה. אפשר לפנות אלינו במייל: SADAFRONIA@GMAIL.COM");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        if (originalLabel) submitButton.innerHTML = originalLabel;
      }
    }
  };

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) emailInput.name = "email";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitByEmail(form, "הצטרפות חדשה לניוזלטר SADAFRONIA", "תודה — הצטרפתם לעדכוני SADAFRONIA.");
    });
  });

  const cartDrawer = document.querySelector("[data-cart-drawer]");
  const cartItems = document.querySelector("[data-cart-items]");
  const cartTotal = document.querySelector("[data-cart-total]");
  const cartCount = document.querySelector("[data-cart-count]");
  const checkoutItems = document.querySelector("[data-checkout-items]");
  const checkoutTotal = document.querySelector("[data-checkout-total]");
  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem("sadafronia-cart") || "[]");
    } catch {
      return [];
    }
  };
  let cart = loadCart();

  productModalCart?.addEventListener("click", () => {
    const existing = cart.find((item) => item.id === productModalCart.dataset.id);
    if (existing) existing.quantity += 1;
    else {
      cart.push({
        id: productModalCart.dataset.id,
        name: productModalCart.dataset.name,
        price: Number(productModalCart.dataset.price || 0),
        image: productModalCart.dataset.image,
        quantity: 1,
      });
    }
    saveCart();
    closeProduct();
    showToast(`${productModalCart.dataset.name} נוסף לסל.`);
    setCart(true);
  });

  function setCart(open) {
    cartDrawer?.classList.toggle("is-open", open);
    cartDrawer?.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("cart-open", open);
  }

  const saveCart = () => {
    localStorage.setItem("sadafronia-cart", JSON.stringify(cart));
    renderCart();
  };

  const orderItem = (item, withRemove = false) => `<div class="cart-item">
    <img src="${item.image}" alt="" />
    <div><strong>${item.name}</strong><small>${item.quantity} × ${money.format(item.price)}</small></div>
    ${withRemove ? `<button type="button" data-remove-cart="${item.id}" aria-label="הסרת ${item.name}">×</button>` : `<b>${money.format(item.price * item.quantity)}</b>`}
  </div>`;

  const renderCart = () => {
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (cartCount) cartCount.textContent = String(quantity);
    if (cartItems) cartItems.innerHTML = cart.length ? cart.map((item) => orderItem(item, true)).join("") : "<p>הסל עדיין ריק.</p>";
    if (cartTotal) cartTotal.textContent = money.format(total);
    if (checkoutItems) checkoutItems.innerHTML = cart.length ? cart.map((item) => orderItem(item)).join("") : "<p>לא נוספו פריטים להזמנה.</p>";
    if (checkoutTotal) checkoutTotal.textContent = money.format(total);
    document.querySelectorAll("[data-remove-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        cart = cart.filter((item) => item.id !== button.dataset.removeCart);
        saveCart();
      });
    });
  };

  document.querySelector("[data-cart-open]")?.addEventListener("click", () => setCart(true));
  document.querySelector("[data-cart-close]")?.addEventListener("click", () => setCart(false));
  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const existing = cart.find((item) => item.id === id);
      if (existing) existing.quantity += 1;
      else {
        cart.push({
          id,
          name: button.dataset.name,
          price: Number(button.dataset.price || 0),
          image: button.dataset.image,
          quantity: 1,
        });
      }
      saveCart();
      showToast(`${button.dataset.name} נוסף לסל.`);
      setCart(true);
    });
  });
  renderCart();

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic");
    if (topic) {
      const select = contactForm.querySelector("select");
      const topicMap = {
        tasting: "סדנה או אירוע",
        winemaker: "סדנה או אירוע",
        corporate: "סדנה או אירוע",
        private: "סדנה או אירוע",
        advertising: "פרסום ב־YAYIN",
      };
      if (select && topicMap[topic]) select.value = topicMap[topic];
    }
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(contactForm));
      localStorage.setItem("sadafronia-contact-draft", JSON.stringify({ ...formData, savedAt: new Date().toISOString() }));
      submitByEmail(contactForm, "פנייה חדשה מאתר SADAFRONIA", "תודה — הפנייה נשלחה ונחזור אליכם בהקדם.");
    });
  }

  document.querySelector("[data-checkout-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cart.length) {
      showToast("הסל ריק. הוסיפו מוצר לפני השלמת הזמנה.");
      return;
    }
    showToast("ההזמנה נשמרה. סליקה אמיתית תחובר לאחר בחירת ספק מאובטח.");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeProduct();
    closeLightbox();
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
