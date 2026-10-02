/* Kanika & Deepankar — wedding invitation */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG
     rsvpEndpoint: Google Apps Script web-app URL (see rsvp-backend/Code.gs).
     If empty, the form posts to "/" (works on Netlify Forms).
  ------------------------------------------------------------------ */
  var CONFIG = {
    rsvpEndpoint: "https://script.google.com/macros/s/AKfycbxcxqdug-dxhjbNFHIW2rXNj6A783n8OZST6gjKdB6LP3eAs5_RBWeFBeu-odE8M2AUFQ/exec",
    weddingStart: "2026-12-10T11:00:00+05:30",
    venueQuery: "Ramaya Motel & Resort, Chandesra, Dewas Road, Ujjain, Madhya Pradesh 456006",
    venueLabel: "Ramaya Motel & Resort, Dewas Road, Ujjain"
  };

  var EVENTS = [
    { day: 1, name: "Tilak", sub: "Tilak · Katha · Mehndi", time: "11:00 AM", icon: "thali",
      note: "A morning of blessings, prayers and henna.", start: "20261210T110000", end: "20261210T150000" },
    { day: 1, name: "Sangeet & Ring Ceremony", time: "7:00 PM", icon: "ring",
      note: "An evening of music, dance and the exchange of rings.", start: "20261210T190000", end: "20261210T200000" },
    { day: 1, name: "Cocktail", time: "8:00 PM", icon: "glass",
      note: "Raise a toast to the couple — the night is young!", start: "20261210T200000", end: "20261210T233000" },
    { day: 2, name: "Haldi", time: "10:00 AM", icon: "haldi",
      note: "Turmeric, laughter and a splash of sunshine.", start: "20261211T100000", end: "20261211T130000" },
    { day: 2, name: "Matri Pooja", time: "2:00 PM", icon: "kalash",
      note: "Invoking the blessings of the divine mothers and our ancestors.", start: "20261211T140000", end: "20261211T160000" },
    { day: 2, name: "Baraat", time: "8:00 PM", icon: "dhol",
      note: "The groom's grand procession — come dance along to the dhol!", start: "20261211T200000", end: "20261211T213000" },
    { day: 2, name: "Jaimala & Reception", time: "To follow", icon: "garland",
      note: "The exchange of garlands, followed by the reception.", start: "20261211T213000", end: "20261211T233000" }
  ];
  var DAYS = {
    1: { pill: "Day One", date: "Thursday, 10 December 2026" },
    2: { pill: "Day Two", date: "Friday, 11 December 2026" }
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SVGNS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Toran (marigold garland) ---------------- */
  function buildToran(long) {
    var W = 400, H = long ? 190 : 120;
    var parts = ['<svg class="toran" viewBox="0 0 ' + W + " " + H + '" xmlns="' + SVGNS + '" aria-hidden="true">'];
    var ropeY = function (x) { var t = (2 * x) / W - 1; return 5 + 9 * (1 - t * t); };
    var count = 18, gap = W / count;
    for (var i = 0; i < count; i++) {
      var x = gap / 2 + i * gap, y0 = ropeY(x);
      var n = long ? [6, 9, 7, 11, 7, 9][i % 6] : [4, 6, 5, 7, 5, 6][i % 6];
      var orange = i % 2 === 0;
      var c1 = orange ? "#e8862a" : "#f3b13a", c2 = orange ? "#c0601a" : "#d08c12";
      var g = '<g class="strand" style="animation-delay:-' + ((i * 0.37) % 4.5).toFixed(2) + 's">';
      g += '<path d="M' + x + " " + y0 + "V" + (y0 + n * 9.4 + 6) + '" stroke="#8a5a2b" stroke-width=".8"/>';
      for (var k = 0; k < n; k++) {
        var cy = y0 + 8 + k * 9.4;
        g += '<circle cx="' + x + '" cy="' + cy + '" r="5.1" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1.6" stroke-dasharray="1.2 1.1"/>';
        g += '<circle cx="' + x + '" cy="' + cy + '" r="1.5" fill="' + c2 + '" opacity=".7"/>';
      }
      var ey = y0 + 8 + n * 9.4;
      g += '<circle cx="' + x + '" cy="' + (ey - 2) + '" r="2.4" fill="#a8232f"/>';
      g += '<path d="M' + (x - 3.2) + " " + (ey + 6) + "Q" + x + " " + (ey - 3) + " " + (x + 3.2) + " " + (ey + 6) + 'z" fill="#d6b46a" stroke="#b0842c" stroke-width=".6"/>';
      g += "</g>";
      parts.push(g);
    }
    parts.push('<path d="M0 5Q' + W / 2 + " 23 " + W + ' 5" fill="none" stroke="#8a5a2b" stroke-width="2.2"/>');
    for (var j = 0; j <= 34; j++) {
      var lx = j * (W / 34), ly = ropeY(lx) + 1;
      var col = j % 2 ? "#3f7a4a" : "#2f5b45";
      var tilt = (j % 2 ? 1 : -1) * 6;
      parts.push('<path transform="rotate(' + tilt + " " + lx + " " + ly + ')" d="M' + lx + " " + ly + "C" + (lx - 5) + " " + (ly + 7) + " " + (lx - 3) + " " + (ly + 17) + " " + lx + " " + (ly + 22) + "C" + (lx + 3) + " " + (ly + 17) + " " + (lx + 5) + " " + (ly + 7) + " " + lx + " " + ly + 'z" fill="' + col + '"/>');
      parts.push('<path transform="rotate(' + tilt + " " + lx + " " + ly + ')" d="M' + lx + " " + (ly + 2) + "V" + (ly + 19) + '" stroke="#a9c79a" stroke-width=".5" opacity=".7"/>');
    }
    parts.push("</svg>");
    return parts.join("");
  }
  $$("[data-toran]").forEach(function (el) { el.innerHTML = buildToran(el.getAttribute("data-toran") === "gate"); });

  /* ---------------- Personalised guest name (?to=Sharma%20Family) ---------------- */
  var params = new URLSearchParams(location.search);
  var guest = (params.get("to") || params.get("guest") || "").trim().slice(0, 60);
  if (guest) {
    var gl = $("#guestLine");
    gl.textContent = "";
    var em = document.createElement("em"); em.textContent = "Dear";
    var st = document.createElement("strong"); st.textContent = guest;
    var em2 = document.createElement("em"); em2.textContent = "you are cordially invited";
    gl.appendChild(em); gl.appendChild(st); gl.appendChild(em2);
    $("#name").value = guest;
  }

  /* ---------------- Gate ---------------- */
  var gate = $("#gate");
  function openGate() {
    if (gate.classList.contains("open")) return;
    gate.classList.add("open");
    document.body.classList.remove("locked");
    burstPetals();
    setTimeout(function () { $$(".hero .reveal").forEach(function (el) { el.classList.add("in"); }); }, 500);
  }
  $("#openBtn").addEventListener("click", openGate);
  gate.addEventListener("click", function (e) { if (e.target === gate || e.target.classList.contains("door")) openGate(); });

  /* ---------------- Petals ---------------- */
  var petalBox = $("#petals");
  var PETAL_COLORS = ["#e8862a", "#f3b13a", "#d9485a", "#f08a5d", "#f6c453"];
  function spawnPetal(opts) {
    if (reduceMotion) return;
    var p = document.createElement("span");
    p.className = "petal";
    var size = 8 + Math.random() * 9;
    p.style.width = size + "px"; p.style.height = size * 1.3 + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
    p.style.setProperty("--drift", (Math.random() * 160 - 80).toFixed(0) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360).toFixed(0) + "deg");
    var dur = opts && opts.fast ? 3.5 + Math.random() * 2.5 : 9 + Math.random() * 7;
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = (opts && opts.delay ? Math.random() * opts.delay : 0) + "s";
    p.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
    p.style.animationIterationCount = opts && opts.once ? "1" : "infinite";
    petalBox.appendChild(p);
    if (opts && opts.once) setTimeout(function () { p.remove(); }, (dur + 3) * 1000);
  }
  function burstPetals() { for (var i = 0; i < 36; i++) spawnPetal({ fast: true, once: true, delay: 1.2 }); }
  for (var i = 0; i < 9; i++) spawnPetal({ delay: 12 });

  /* ---------------- Countdown ---------------- */
  var target = new Date(CONFIG.weddingStart).getTime();
  var cdEls = {}; $$("[data-cd]").forEach(function (el) { cdEls[el.getAttribute("data-cd")] = el; });
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      $("#countdown").innerHTML = '<p class="title" style="grid-column:1/-1;font-size:40px">The celebrations have begun!</p>';
      return;
    }
    var s = Math.floor(diff / 1000);
    cdEls.d.textContent = Math.floor(s / 86400);
    cdEls.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cdEls.m.textContent = pad(Math.floor((s % 3600) / 60));
    cdEls.s.textContent = pad(s % 60);
    setTimeout(tick, 1000);
  }
  tick();

  /* ---------------- Events ---------------- */
  function gcalUrl(ev) {
    var q = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.name + " · Kanika & Deepankar's Wedding",
      dates: ev.start + "/" + ev.end,
      ctz: "Asia/Kolkata",
      location: CONFIG.venueQuery,
      details: (ev.sub ? ev.sub + "\n" : "") + "We look forward to celebrating with you! — Kanika & Deepankar"
    });
    return "https://calendar.google.com/calendar/render?" + q.toString();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var html = "";
  [1, 2].forEach(function (d) {
    html += '<div class="day"><div class="day-head reveal"><span class="day-pill">' + DAYS[d].pill + '</span><span class="day-date">' + DAYS[d].date + '</span></div><div class="timeline">';
    EVENTS.filter(function (e) { return e.day === d; }).forEach(function (ev) {
      html += '<article class="event reveal"><div class="icon"><svg><use href="#i-' + ev.icon + '"/></svg></div><div class="card">' +
        '<p class="time">' + esc(ev.time) + "</p><h3>" + esc(ev.name) + "</h3>" +
        (ev.sub ? '<p class="sub">' + esc(ev.sub) + "</p>" : "") +
        "<p>" + esc(ev.note) + "</p>" +
        '<a class="cal" target="_blank" rel="noopener" href="' + esc(gcalUrl(ev)) + '"><svg width="14" height="14"><use href="#u-cal"/></svg>Add to calendar</a>' +
        "</div></article>";
    });
    html += "</div></div>";
  });
  $("#eventDays").innerHTML = html;

  /* ---------------- Venue ---------------- */
  var mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.venueQuery);
  $("#mapsBtn").href = mapsLink;
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

  /* ---------------- Share ---------------- */
  var siteUrl = location.origin + location.pathname.replace(/index\.html$/, "");
  var shareText = "🌼 You're invited! 🌼\n\nKanika & Deepankar's Wedding\n10–11 December 2026 · Ramaya Resort, Ujjain\n\nView the invitation & RSVP: " + siteUrl;
  $("#shareWa").href = "https://wa.me/?text=" + encodeURIComponent(shareText);
  $("#shareWa").addEventListener("click", function (e) {
    if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      e.preventDefault();
      navigator.share({ title: "Kanika & Deepankar · Wedding Invitation", text: "🌼 Kanika & Deepankar's Wedding · 10–11 Dec 2026 · Ramaya Resort, Ujjain", url: siteUrl }).catch(function () {});
    }
  });

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
    var first = (data.name || "").trim();
    if (data.attending === "yes") {
      $("#thanksTitle").textContent = "Thank you" + (first ? ", " + first : "") + "!";
      $("#thanksMsg").textContent = "We're overjoyed you'll be with us. See you in Ujjain! 🌼";
    } else {
      $("#thanksTitle").textContent = "We'll miss you" + (first ? ", " + first : "");
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
      if (saved.guests) { guestsInput.value = saved.guests; guestOut.textContent = saved.guests; }
      showThanks(saved);
    }
  } catch (e) {}

  function sendRsvp(data) {
    var body = new URLSearchParams(data);
    if (CONFIG.rsvpEndpoint) {
      // Apps Script doesn't send CORS headers; an opaque no-cors POST still records the row.
      return fetch(CONFIG.rsvpEndpoint, { method: "POST", mode: "no-cors", body: body });
    }
    return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r; });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errEl.textContent = "";
    var name = $("#name").value.trim();
    if (!name) { errEl.textContent = "Please tell us your name 🙏"; $("#name").focus(); return; }
    if (!attendInput.value) { errEl.textContent = "Please choose whether you'll be attending."; return; }
    if (form.company.value) return; // bot

    var yes = attendInput.value === "yes";
    var id;
    try {
      id = localStorage.getItem(STORE + "-id");
      if (!id) { id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(STORE + "-id", id); }
    } catch (e3) { id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
    var data = {
      "form-name": "rsvp",
      id: id,
      name: name,
      attending: attendInput.value,
      guests: yes ? guestsInput.value : "0",
      day1: yes && form.day1.checked ? "yes" : "no",
      day2: yes && form.day2.checked ? "yes" : "no",
      phone: $("#phone").value.trim(),
      message: $("#message").value.trim(),
      invitedAs: guest,
      submittedAt: new Date().toISOString()
    };
    if (yes && data.day1 === "no" && data.day2 === "no") { errEl.textContent = "Please pick at least one day."; return; }

    var submit = $("#rsvpSubmit");
    submit.disabled = true; submit.style.opacity = ".7";
    submit.lastChild.textContent = " Sending…";
    sendRsvp(data).then(function () {
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

  /* ---------------- Reveal on scroll, dock, lazy map ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !en.target.closest(".hero")) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    new IntersectionObserver(function (en) { if (en[0].isIntersecting) loadMap(); }, { rootMargin: "400px" }).observe(mapEl);
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); }); loadMap();
  }
  var dock = $("#dock");
  function onScroll() { dock.classList.toggle("show", window.scrollY > window.innerHeight * 0.55); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
