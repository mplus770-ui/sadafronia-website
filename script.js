function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function handleFormSubmit(e) {
  e.preventDefault();
  alert('הטופס נשלח. כאן אפשר לחבר אינטגרציה למערכת דיוור או CRM.');
}

const heroMedia = document.getElementById('hero-media');
window.addEventListener('scroll', () => {
  const y = window.scrollY || window.pageYOffset;
  const offset = Math.min(y / 40, 8);
  heroMedia.style.transform = `translateY(${offset}px)`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('section, .about-winemaker, .two-col, .testimonials, .contact-grid')
  .forEach(el => observer.observe(el));

function acceptCookies() {
  localStorage.setItem('sadafronia_cookies_accepted', 'yes');
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.style.display = 'none';
}

window.addEventListener('load', () => {
  const accepted = localStorage.getItem('sadafronia_cookies_accepted');
  const banner = document.getElementById('cookie-banner');
  if (!accepted && banner) {
    banner.style.display = 'flex';
  }
});

// ===== Hamburger Menu =====
(function(){
  var btn     = document.getElementById('hamburger-btn');
  var drawer  = document.getElementById('mobile-nav-drawer');
  var overlay = document.getElementById('mobile-nav-overlay');
  if(!btn||!drawer) return;
  function toggleMenu(open){
    btn.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    if(overlay) overlay.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function(){ toggleMenu(!drawer.classList.contains('open')); });
  if(overlay) overlay.addEventListener('click', function(){ toggleMenu(false); });
  document.querySelectorAll('.mobile-nav-link').forEach(function(a){
    a.addEventListener('click', function(){ toggleMenu(false); });
  });
})();

// ===== Google Translate =====
function googleTranslateElementInit(){
  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: '',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

(function(){
  var langBtn = document.getElementById('lang-toggle-btn');
  var gtDiv   = document.getElementById('google_translate_element');
  if(!langBtn || !gtDiv) return;
  gtDiv.style.cssText = 'position:fixed;z-index:10001;background:#fff;border-radius:10px;'
    +'box-shadow:0 6px 24px rgba(0,0,0,0.14);display:none;min-width:180px;overflow:visible;';
  document.body.appendChild(gtDiv);
  function positionDD(){
    var r = langBtn.getBoundingClientRect();
    gtDiv.style.top   = (r.bottom + 6) + 'px';
    gtDiv.style.right = (window.innerWidth - r.right) + 'px';
    gtDiv.style.left  = 'auto';
  }
  langBtn.addEventListener('click', function(e){
    e.stopPropagation();
    var open = gtDiv.style.display !== 'none';
    if(!open){ positionDD(); }
    gtDiv.style.display = open ? 'none' : 'block';
  });
  document.addEventListener('click', function(e){
    if(!langBtn.contains(e.target) && !gtDiv.contains(e.target))
      gtDiv.style.display = 'none';
  });
})();

// ===== Geo-Redirect =====
(function(){
  var redirected = sessionStorage.getItem('geo_redirected');
  if(redirected) return;
  sessionStorage.setItem('geo_redirected','1');
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var country = (d && d.country_code) ? d.country_code.toUpperCase() : '';
      if(country && country !== 'IL'){
        var tries = 0;
        var iv = setInterval(function(){
          var sel = document.querySelector('.goog-te-combo');
          if(sel && sel.options.length > 1){
            sel.value = 'en';
            sel.dispatchEvent(new Event('change'));
            clearInterval(iv);
          }
          if(++tries > 30) clearInterval(iv);
        }, 400);
      }
    })
    .catch(function(){});
})();
