/* Kanika & Deepankar — wedding invitation (bride & groom side share this script) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG
     rsvpEndpoint: Google Apps Script web-app URL (see rsvp-backend/Code.gs).
  ------------------------------------------------------------------ */
  var CONFIG = {
    rsvpEndpoint: "https://script.google.com/macros/s/AKfycbxcxqdug-dxhjbNFHIW2rXNj6A783n8OZST6gjKdB6LP3eAs5_RBWeFBeu-odE8M2AUFQ/exec",
    weddingStart: "2026-12-10T11:00:00+05:30",
    venueQuery: "Ramaya Motel & Resort, Chandesra, Dewas Road, Ujjain, Madhya Pradesh 456006"
  };

  var SIDE = document.body.getAttribute("data-side") === "groom" ? "groom" : "bride";

  // one entry per function; time may differ per side
  var EVENTS = {
    tilak: { day: 1, name: "Tilak", sub: "Tilak · Katha · Mehndi", time: "11:00 AM", accent: "#5e8b6b",
      note: "A morning of blessings, prayers and henna." },
    sangeet: { day: 1, name: "Sangeet & Ring Ceremony", sub: "Followed by Cocktail", time: "7:00 PM", accent: "#4f7fa6",
      note: "An evening of music, dance and the exchange of rings, then raise a glass with us." },
    haldi: { day: 2, name: "Haldi", time: "10:00 AM", accent: "#c08a0c", note: "Turmeric, laughter and a splash of sunshine." },
    matri: { day: 2, name: "Matri Pooja", time: "2:00 PM", accent: "#a8455a", note: "Seeking the blessings of the divine mothers and our ancestors." },
    baraat: { day: 2, name: "Baraat", time: "8:00 PM", accent: "#b0354f", note: "The groom's grand procession. Come dance along to the dhol!" },
    reception: { day: 2, name: "Jaimala & Reception", time: { bride: "8:00 PM onwards", groom: "To follow" }, accent: "#b0354f",
      note: "The exchange of garlands, followed by the reception." }
  };
  // one full page per entry: illustration (assets/art) + the functions on it
  var PAGES = {
    bride: [
      { id: "tilak", art: "mehendi", hi: "॥ तिलक ॥", ev: ["tilak"] },
      { id: "sangeet", art: "sangeet", hi: "॥ संगीत एवं सगाई ॥", ev: ["sangeet"] },
      { id: "haldi", art: "haldi", hi: "॥ हल्दी ॥", ev: ["haldi"] },
      { id: "reception", art: "wedding", hi: "॥ जयमाला एवं स्वागत ॥", ev: ["reception"] }
    ],
    groom: [
      { id: "tilak", art: "mehendi", hi: "॥ तिलक एवं मातृ पूजा ॥", ev: ["tilak", "matri"] },
      { id: "sangeet", art: "sangeet", hi: "॥ संगीत एवं सगाई ॥", ev: ["sangeet"] },
      { id: "haldi", art: "haldi", hi: "॥ हल्दी ॥", ev: ["haldi"] },
      { id: "reception", art: "wedding", hi: "॥ बारात एवं जयमाला ॥", ev: ["baraat", "reception"] }
    ]
  };
  var DAYS = {
    1: { pill: "Day One", date: "Thursday, 10 December 2026", short: "Thu, 10 Dec" },
    2: { pill: "Day Two", date: "Friday, 11 December 2026", short: "Fri, 11 Dec" }
  };

  var CONTACTS = {
    kf: { who: "Kanika's Father", accent: "#c4687e", nums: ["+919479873683"] },
    ku: { who: "Kanika's Uncle", accent: "#c4687e", nums: ["+919644455666"] },
    df: { who: "Deepankar's Father", accent: "#c98576", nums: ["+918744045556"] },
    db: { who: "Deepankar's Brother", accent: "#c98576", nums: ["+918744865556"] }
  };

  var SIDES = {
    bride: { label: "Bride side", couple: "Kanika & Deepankar", contacts: ["kf", "ku", "df", "db"] },
    groom: { label: "Groom side", couple: "Deepankar & Kanika", contacts: ["df", "db", "kf", "ku"] }
  };
  var S = SIDES[SIDE];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------------- Toran (marigold garland) ---------------- */
  var TORAN = {
    gate: { H: 190, len: [6, 9, 7, 11, 7, 9] },
    hero: { H: 96, len: [3, 5, 4, 6, 4, 5] }
  };
  function buildToran(kind) {
    var cfg = TORAN[kind] || TORAN.hero, W = 400, H = cfg.H;
    var parts = ['<svg class="toran" viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'];
    var ropeY = function (x) { var t = (2 * x) / W - 1; return 5 + 9 * (1 - t * t); };
    var count = 18, gap = W / count;
    for (var i = 0; i < count; i++) {
      var x = gap / 2 + i * gap, y0 = ropeY(x), n = cfg.len[i % 6], orange = i % 2 === 0;
      var c1 = orange ? "#f2a9b6" : "#fff4ee", c2 = orange ? "#d0798a" : "#e2b9ae";
      var g = '<g class="strand" style="animation-delay:-' + ((i * 0.37) % 4.5).toFixed(2) + 's">';
      g += '<path d="M' + x + " " + y0 + "V" + (y0 + n * 9.4 + 6) + '" stroke="#b88a7e" stroke-width=".8"/>';
      for (var k = 0; k < n; k++) {
        var cy = y0 + 8 + k * 9.4;
        g += '<circle cx="' + x + '" cy="' + cy + '" r="5.1" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1.6" stroke-dasharray="1.2 1.1"/>';
        g += '<circle cx="' + x + '" cy="' + cy + '" r="1.5" fill="' + c2 + '" opacity=".7"/>';
      }
      var ey = y0 + 8 + n * 9.4;
      g += '<circle cx="' + x + '" cy="' + (ey - 2) + '" r="2.4" fill="#c06a7d"/>';
      g += '<path d="M' + (x - 3.2) + " " + (ey + 6) + "Q" + x + " " + (ey - 3) + " " + (x + 3.2) + " " + (ey + 6) + 'z" fill="#f3cfc4" stroke="#b07a6c" stroke-width=".6"/>';
      parts.push(g + "</g>");
    }
    parts.push('<path d="M0 5Q' + W / 2 + " 23 " + W + ' 5" fill="none" stroke="#b88a7e" stroke-width="2.2"/>');
    for (var j = 0; j <= 34; j++) {
      var lx = j * (W / 34), ly = ropeY(lx) + 1, col = j % 2 ? "#9db89a" : "#7d9c7a", tilt = (j % 2 ? 1 : -1) * 6;
      var rot = ' transform="rotate(' + tilt + " " + lx + " " + ly + ')"';
      parts.push("<path" + rot + ' d="M' + lx + " " + ly + "C" + (lx - 5) + " " + (ly + 7) + " " + (lx - 3) + " " + (ly + 17) + " " + lx + " " + (ly + 22) + "C" + (lx + 3) + " " + (ly + 17) + " " + (lx + 5) + " " + (ly + 7) + " " + lx + " " + ly + 'z" fill="' + col + '"/>');
      parts.push("<path" + rot + ' d="M' + lx + " " + (ly + 2) + "V" + (ly + 19) + '" stroke="#e3efd9" stroke-width=".5" opacity=".7"/>');
    }
    parts.push("</svg>");
    return parts.join("");
  }
  $$("[data-toran]").forEach(function (el) { el.innerHTML = buildToran(el.getAttribute("data-toran")); });

  /* ---------------- Personalised guest name (?to=Sharma%20Family) ---------------- */
  var params = new URLSearchParams(location.search);
  var guest = (params.get("to") || params.get("guest") || "").trim().slice(0, 60);
  if (guest) {
    var gl = $("#guestLine");
    gl.textContent = "";
    [["em", "Dear"], ["strong", guest], ["em", "you are cordially invited"]].forEach(function (p) {
      var el = document.createElement(p[0]); el.textContent = p[1]; gl.appendChild(el);
    });
    $("#name").value = guest;
  }

  // ?print=1 renders every section as a 9:16 page for the PDF (tools/render.sh)
  var PRINT = params.get("print") === "1";
  if (PRINT) { document.documentElement.classList.add("pm"); document.body.classList.remove("locked"); reduceMotion = true; }
  // balanced headings are measured before the web fonts arrive; re-measure once they have
  if (document.fonts) document.fonts.ready.then(function () { var h = document.documentElement; h.classList.add("relayout"); void h.offsetHeight; h.classList.remove("relayout"); });

  /* ---------------- Gate ---------------- */
  var gate = $("#gate");
  function openGate() {
    if (gate.classList.contains("open")) return;
    gate.classList.add("open");
    document.body.classList.remove("locked");
    burstPetals();
    setTimeout(function () { $$(".hero .reveal").forEach(function (el) { el.classList.add("in"); }); }, 450);
  }
  $("#openBtn").addEventListener("click", openGate);
  gate.addEventListener("click", function (e) { if (e.target === gate || e.target.classList.contains("door")) openGate(); });

  /* ---------------- Petals ---------------- */
  var petalBox = $("#petals");
  var PETAL_COLORS = ["#f4b6c2", "#f9d5dc", "#eaa0b0", "#fbe3e8", "#f2c2b3"];
  function spawnPetal(opts) {
    if (reduceMotion) return;
    var p = document.createElement("span"), size = 8 + Math.random() * 9;
    p.className = "petal";
    p.style.width = size + "px"; p.style.height = size * 1.3 + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
    p.style.setProperty("--drift", (Math.random() * 160 - 80).toFixed(0) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360).toFixed(0) + "deg");
    var dur = opts.fast ? 3.5 + Math.random() * 2.5 : 9 + Math.random() * 7;
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = (opts.delay ? Math.random() * opts.delay : 0) + "s";
    p.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
    p.style.animationIterationCount = opts.once ? "1" : "infinite";
    petalBox.appendChild(p);
    if (opts.once) setTimeout(function () { p.remove(); }, (dur + 3) * 1000);
  }
  function burstPetals() { for (var i = 0; i < 36; i++) spawnPetal({ fast: true, once: true, delay: 1.2 }); }
  for (var i = 0; i < 8; i++) spawnPetal({ delay: 12 });

  /* ---------------- Countdown ---------------- */
  var target = new Date(CONFIG.weddingStart).getTime();
  var cdEls = {}; $$("[data-cd]").forEach(function (el) { cdEls[el.getAttribute("data-cd")] = el; });
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) { $("#countdown").innerHTML = '<p class="title" style="grid-column:1/-1;font-size:40px">The celebrations have begun!</p>'; return; }
    var s = Math.floor(diff / 1000);
    cdEls.d.textContent = Math.floor(s / 86400);
    cdEls.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cdEls.m.textContent = pad(Math.floor((s % 3600) / 60));
    cdEls.s.textContent = pad(s % 60);
    setTimeout(tick, 1000);
  }
  tick();

  /* ---------------- Functions: one full page each ---------------- */
  function perSide(v) { return v && typeof v === "object" ? v[SIDE] : v; }
  var BASE = document.body.getAttribute("data-base") || "";
  function dayHtml(d) { return '<span class="fn-day">' + DAYS[d].pill + '</span><span class="fn-date">' + DAYS[d].date + "</span>"; }
  $("#events").innerHTML = PAGES[SIDE].map(function (pg, n) {
    var evs = pg.ev.map(function (k) { return EVENTS[k]; });
    var oneDay = evs.every(function (e) { return e.day === evs[0].day; });
    var body = evs.map(function (ev, i) {
      return '<div class="fn-ev" style="--accent:' + ev.accent + '">' + (i ? '<svg class="fn-split" aria-hidden="true"><use href="#ornament"/></svg>' : "") +
        (oneDay ? "" : '<span class="fn-day">' + DAYS[ev.day].pill + " · " + DAYS[ev.day].short + "</span>") +
        '<h2 class="fn-name' + (ev.name.length > 12 ? " long" : "") + '">' + esc(ev.name) + "</h2>" +
        (ev.sub ? '<p class="fn-sub">' + esc(ev.sub) + "</p>" : "") +
        '<span class="fn-time">' + esc(perSide(ev.time)) + "</span>" +
        '<p class="fn-note">' + esc(ev.note) + "</p></div>";
    }).join("");
    return '<section class="fn' + (evs.length > 1 ? " two" : "") + (evs[0].name.length > 12 ? " longname" : "") + (n % 2 ? " flip" : "") + '" id="fn-' + pg.id + '">' +
      '<img class="fn-rose top" src="' + BASE + 'assets/art/roses.webp" alt="" aria-hidden="true" />' +
      '<img class="fn-rose bot" src="' + BASE + 'assets/art/roses.webp" alt="" aria-hidden="true" />' +
      '<img class="fn-petal p1" src="' + BASE + 'assets/art/petal1.webp" alt="" aria-hidden="true" />' +
      '<img class="fn-petal p2" src="' + BASE + 'assets/art/petal2.webp" alt="" aria-hidden="true" />' +
      '<div class="fn-text reveal"><p class="fn-hi">' + pg.hi + "</p>" + (oneDay ? dayHtml(evs[0].day) : "") +
      '<img class="fn-art" src="' + BASE + "assets/art/" + pg.art + '.webp" alt="" />' + body + "</div></section>";
  }).join("");

  /* ---------------- Contacts ---------------- */
  function prettyNum(n) { var d = n.replace(/\D/g, "").slice(-10); return "+91 " + d.slice(0, 5) + " " + d.slice(5); }
  $("#contacts").innerHTML = S.contacts.map(function (key) {
    var c = CONTACTS[key];
    return '<div class="contact reveal" style="--accent:' + c.accent + '"><h3>' + esc(c.who) + "</h3>" +
      c.nums.map(function (n) {
        return '<div class="num"><a class="call" href="tel:' + n + '"><svg><use href="#u-phone"/></svg>' + prettyNum(n) + "</a>" +
          '<a class="wa" href="https://wa.me/' + n.replace(/\D/g, "") + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + prettyNum(n) + '"><svg><use href="#u-wa"/></svg></a></div>';
      }).join("") + "</div>";
  }).join("");

  /* ---------------- Venue ---------------- */
  $("#mapsBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.venueQuery);
  var mapEl = $("#map");
  function loadMap() {
    if (mapEl.firstChild) return;
    var f = document.createElement("iframe");
    f.title = "Map to Ramaya Resort, Ujjain";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://maps.google.com/maps?q=" + encodeURIComponent(CONFIG.venueQuery) + "&z=13&output=embed";
    mapEl.appendChild(f);
  }

  /* ---------------- RSVP ---------------- */
  var form = $("#rsvpForm"), card = $("#rsvpCard"), errEl = $("#formError");
  var attendInput = $("#attendingInput"), guestsInput = $("#guestsInput"), guestOut = $("#guestCount");
  var STORE = "kd-wedding-rsvp";

  $$("[data-attend]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-attend]").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      attendInput.value = b.getAttribute("data-attend");
      form.classList.toggle("yes", attendInput.value === "yes");
      errEl.textContent = "";
    });
  });
  $$("[data-step]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = Math.min(15, Math.max(1, (+guestsInput.value || 1) + +b.getAttribute("data-step")));
      guestsInput.value = v; guestOut.textContent = v;
    });
  });

  function showThanks(data) {
    var who = (data.name || "").trim();
    if (data.attending === "yes") {
      $("#thanksTitle").textContent = "Thank you" + (who ? ", " + who : "") + "!";
      $("#thanksMsg").textContent = "We're overjoyed you'll be with us. See you in Ujjain! 🌼";
    } else {
      $("#thanksTitle").textContent = "We'll miss you" + (who ? ", " + who : "");
      $("#thanksMsg").textContent = "Thank you for letting us know — your blessings mean the world to us.";
    }
    card.classList.add("done");
  }
  $("#editRsvp").addEventListener("click", function () { card.classList.remove("done"); });

  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && saved.name) {
      $("#name").value = saved.name;
      if (saved.phone) $("#phone").value = saved.phone;
      var btn = $('[data-attend="' + saved.attending + '"]'); if (btn) btn.click();
      if (saved.guests && saved.guests !== "0") { guestsInput.value = saved.guests; guestOut.textContent = saved.guests; }
      showThanks(saved);
    }
  } catch (e) {}

  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errEl.textContent = "";
    var name = $("#name").value.trim();
    if (!name) { errEl.textContent = "Please tell us your name 🙏"; $("#name").focus(); return; }
    if (!attendInput.value) { errEl.textContent = "Please choose whether you'll be attending."; return; }
    if (form.company.value) return; // bot

    var yes = attendInput.value === "yes", id;
    try { id = localStorage.getItem(STORE + "-id") || newId(); localStorage.setItem(STORE + "-id", id); } catch (e3) { id = newId(); }
    var data = {
      id: id,
      side: S.label,
      name: name,
      attending: attendInput.value,
      guests: yes ? guestsInput.value : "0",
      day1: yes && form.day1.checked ? "yes" : "no",
      day2: yes && form.day2.checked ? "yes" : "no",
      phone: $("#phone").value.trim(),
      message: $("#message").value.trim(),
      // shows up in the Sheet's "Invite link name" column, so each row says which invitation it came from
      invitedAs: S.label + (guest ? " · " + guest : "")
    };
    if (yes && data.day1 === "no" && data.day2 === "no") { errEl.textContent = "Please pick at least one day."; return; }

    var submit = $("#rsvpSubmit");
    submit.disabled = true; submit.style.opacity = ".7"; submit.lastChild.textContent = " Sending…";
    // Apps Script doesn't send CORS headers; an opaque no-cors POST still records the row.
    fetch(CONFIG.rsvpEndpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) }).then(function () {
      try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e2) {}
      showThanks(data);
      if (yes) burstPetals();
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }).catch(function () {
      errEl.textContent = "Couldn't send right now — please check your connection and try again.";
    }).then(function () {
      submit.disabled = false; submit.style.opacity = ""; submit.lastChild.textContent = " Send RSVP";
    });
  });

  /* ---------------- Reveal on scroll + lazy map ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !en.target.closest(".hero")) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    new IntersectionObserver(function (en) { if (en[0].isIntersecting) loadMap(); }, { rootMargin: "400px" }).observe(mapEl);
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); }); loadMap();
  }

  /* ---------------- Dock: show after hero, highlight current section ---------------- */
  var dock = $("#dock"), cue = $("#scrollCue");
  var navLinks = $$("[data-nav]");
  var navSections = navLinks.map(function (a) { return document.getElementById(a.getAttribute("data-nav")); });
  var lockUntil = 0;
  function setActive(id) { navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-nav") === id); }); }
  navLinks.forEach(function (a) {
    a.addEventListener("click", function () { setActive(a.getAttribute("data-nav")); lockUntil = Date.now() + 1200; });
  });
  function onScroll() {
    var y = window.scrollY;
    dock.classList.toggle("show", y > window.innerHeight * 0.5);
    cue.classList.toggle("gone", y > 40);
    if (Date.now() < lockUntil) return; // let the tapped tab stay lit while smooth-scrolling
    var probe = window.innerHeight * 0.4, current = "";
    navSections.forEach(function (sec) { if (sec && sec.getBoundingClientRect().top <= probe) current = sec.id; });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = "contact";
    setActive(current);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
