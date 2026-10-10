
const MN_DOWNLOADER = [
  { href: "/tiktok.html", label: "TikTok Downloader" },
  { href: "/instagram.html", label: "Instagram Downloader" },
  { href: "/yt.html", label: "YouTube Downloader" },
  { href: "/pinterest.html", label: "Pinterest Downloader" },
];

const MN_MORE = [
  { href: "https://whatsapp.com/channel/0029VbCPkeX2UPBEbTumgG2Y", icon: "./media/channel.png", label: "Channel WhatsApp", target: "_blank" },
  { href: "/creator.html", icon: "./media/creator.png", label: "Creator" },
  { href: "/rating.html", icon: "./media/rating.png", label: "Rating" },
  { href: "/settingakun.html", icon: "./media/setting.png", label: "Setting" },
  { href: "/maintenance.html", label: "Perbaikan", id: "maintenanceBtn", ownerOnly: true },
  { href: "/Blokirakun.html", label: "Blokir Akun", id: "blockAkunBtn", ownerOnly: true },
  { href: "#", label: "Logout Akun", id: "userLogoutBtn", danger: true },
];

const MN_NAV = [
  { key: "home", label: "Dashboard", icon: "home", img: "./media/dashboard.png", href: "/" },
  { key: "dl", label: "Downloader", icon: "download", img: "./media/downloader.png", popup: "dl", list: MN_DOWNLOADER },
  { key: "preset", label: "Preset", icon: "layers", img: "./media/preset.png", href: "/preset-tamplate.html" },
  { key: "stats", label: "Statistik", icon: "chart", img: "./media/statistik.png", href: "/stats.html" },
  { key: "more", label: "Lainnya", icon: "grid", img: "./media/lainnya.png", popup: "more", list: MN_MORE },
];

const MN_ICONS = {
  home: '<path d="M4 11.2 12 4l8 7.2V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
  download: '<path d="M12 4v10"/><path d="M8 10.5l4 4 4-4"/><path d="M5 19h14"/>',
  layers: '<path d="M12 4 3.5 8.5 12 13l8.5-4.5z"/><path d="M3.5 12.5 12 17l8.5-4.5"/><path d="M3.5 16.5 12 21l8.5-4.5"/>',
  chart: '<path d="M5 20v-8"/><path d="M12 20V4"/><path d="M19 20v-5"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
};

document.addEventListener("click", (e) => {
  if (e.target && e.target.closest && e.target.closest("#userLogoutBtn")) {
    e.preventDefault();
    localStorage.removeItem("danzclean_logged_user");
    localStorage.removeItem("isOwner");

    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().signOut().then(() => {
        window.location.replace("/danzclean.html");
      }).catch(() => {
        window.location.replace("/danzclean.html");
      });
    } else {
      window.location.replace("/danzclean.html");
    }
  }
});

function showCsHintTooltip(csBtn) {
  
  if (location.pathname.endsWith("/customerservice.html")) return;

  const tooltip = document.createElement("div");
  tooltip.className = "cs-hint-tooltip";
  tooltip.id = "csHintTooltip";
  tooltip.innerHTML = "Tanya apa saja<br>masalahmu di CS";
  document.body.appendChild(tooltip);

  function positionTooltip() {
    const btnRect = csBtn.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    
    if (!btnRect.width || !tooltipRect.width) {
      requestAnimationFrame(positionTooltip);
      return;
    }

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const margin = 8; 
    let left = btnCenterX + 19 - tooltipRect.width;


    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));

    tooltip.style.left = left + "px";
    tooltip.style.top = (btnRect.bottom + 10) + "px";
  }

  
  requestAnimationFrame(() => requestAnimationFrame(positionTooltip));
  window.addEventListener("resize", positionTooltip);

  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => tooltip.classList.add("show"));
  });

  const hide = () => {
    tooltip.classList.remove("show");
    setTimeout(() => tooltip.remove(), 400);
  };

  
  const autoHideTimer = setTimeout(hide, 7000);

  
  csBtn.addEventListener("click", () => {
    clearTimeout(autoHideTimer);
    hide();
  }, { once: true });

  
  const sidebarObserver = new MutationObserver(() => {
    if (document.body.classList.contains("sidebar-open")) {
      clearTimeout(autoHideTimer);
      hide();
      sidebarObserver.disconnect();
    }
  });
  sidebarObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
}

function renderTopbarProfile() {
  const topbar = document.getElementById("dzTopbar") || document.querySelector(".topbar");
  if (!topbar || document.getElementById("topbarProfileBtn")) return;
  const staleDd = document.getElementById("profileDropdown");
  if (staleDd) staleDd.remove();

  let loggedUser = {};
  try {
    loggedUser = JSON.parse(localStorage.getItem("danzclean_logged_user")) || {};
  } catch (e) {
    loggedUser = {};
  }

  const displayName = loggedUser.username || "User";
  const fallbackAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName) + "&background=4c7dff&color=fff";
  const avatarSrc = loggedUser.photo || fallbackAvatar;

  let csBtnRef = null;

  if (!document.getElementById("topbarNotifBtn")) {
    const notifBtn = document.createElement("button");
    notifBtn.type = "button";
    notifBtn.className = "topbar-notif-btn";
    notifBtn.id = "topbarNotifBtn";
    notifBtn.title = "Notifikasi";
    notifBtn.innerHTML = `
      <span class="topbar-notif-inner">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      </span>
      <span class="topbar-notif-dot" id="topbarNotifDot" style="display:none;"></span>
    `;

    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof window.toggleNotifPanel === "function") window.toggleNotifPanel();
    });
    topbar.appendChild(notifBtn);
  }

  if (!document.getElementById("topbarCsBtn")) {
    const csBtn = document.createElement("button");
    csBtn.type = "button";
    csBtn.className = "topbar-cs-btn";
    csBtn.id = "topbarCsBtn";
    csBtn.title = "Customer Service";
    csBtn.innerHTML = `
      <span class="topbar-cs-inner">
        <img src="./media/cs.png" alt="CS" onerror="this.style.display='none';">
      </span>
      <span class="topbar-cs-status"></span>
    `;
    csBtn.addEventListener("click", () => {
      window.location.href = "/customerservice.html";
    });
    topbar.appendChild(csBtn);

    csBtnRef = csBtn;
  }

  const profileBtn = document.createElement("button");
  profileBtn.type = "button";
  profileBtn.className = "topbar-profile-btn";
  profileBtn.id = "topbarProfileBtn";
  profileBtn.innerHTML = `<img src="${avatarSrc}" alt="Profil" onerror="this.src='${fallbackAvatar}'"><span class="topbar-profile-status"></span>`;
  topbar.appendChild(profileBtn);


  if (csBtnRef && !window.__csHintShown) {
    window.__csHintShown = true;
    showCsHintTooltip(csBtnRef);
  }

  const dropdown = document.createElement("div");
  dropdown.className = "profile-dropdown";
  dropdown.id = "profileDropdown";
  dropdown.innerHTML = `
    <div class="profile-dropdown-header">
      <img src="${avatarSrc}" alt="Profil" onerror="this.src='${fallbackAvatar}'">
      <div class="profile-dropdown-info">
        <div class="profile-dropdown-name">${displayName}</div>
        <div class="profile-dropdown-sub">${loggedUser.phone || "Akun DanzClean"}</div>
      </div>
    </div>
    <a href="/settingakun.html" class="profile-dropdown-item">
      <span class="pd-icon"><img src="./media/setting.png" alt="" width="16" height="16" style="width:16px;height:16px;object-fit:contain;"></span> Setting Akun
    </a>
  `;
  document.body.appendChild(dropdown);

  function positionDropdown() {
    const btnRect = profileBtn.getBoundingClientRect();
    const topbarRect = topbar.getBoundingClientRect();
    dropdown.style.top = (topbarRect.bottom + 12) + "px";
    dropdown.style.right = (window.innerWidth - btnRect.right) + "px";
  }

  function openDropdown() {
    positionDropdown();
    dropdown.classList.add("show");
    profileBtn.classList.add("open");
  }

  function closeDropdown() {
    dropdown.classList.remove("show");
    profileBtn.classList.remove("open");
  }

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.classList.contains("show")) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== profileBtn) {
      closeDropdown();
    }
  });

  window.addEventListener("resize", () => {
    if (dropdown.classList.contains("show")) positionDropdown();
  });
}


/* ===================== NAVIGASI BAWAH ===================== */

function mnNormPath(p) {
  p = (p || "").toLowerCase().split("?")[0].split("#")[0];
  p = p.replace(/\.html$/, "");
  if (p.endsWith("/index")) p = p.slice(0, -5);
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

function mnActiveIndex() {
  const cur = mnNormPath(location.pathname);
  for (let i = 0; i < MN_NAV.length; i++) {
    const it = MN_NAV[i];
    if (it.href && mnNormPath(it.href) === cur) return i;
    if (it.list && it.list.some(x => x.href && x.href.charAt(0) === "/" && mnNormPath(x.href) === cur)) return i;
  }
  return -1;
}

function mnSvg(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + MN_ICONS[name] + "</svg>";
}

function mnPopHtml(list, isGrid, isOwner, cur) {
  let out = "";
  list.forEach(x => {
    if (x.ownerOnly && !isOwner) return;
    const t = x.target ? ' target="' + x.target + '" rel="noopener"' : "";
    const id = x.id ? ' id="' + x.id + '"' : "";
    const isCur = x.href && x.href.charAt(0) === "/" && mnNormPath(x.href) === cur;
    const cls = "mn-pop-item" + (x.danger ? " mn-danger" : "") + (isCur ? " current" : "");
    const ico = x.icon ? '<img src="' + x.icon + '" alt="" onerror="this.style.display=\'none\'">' : "";
    out += '<a href="' + x.href + '"' + t + id + ' class="' + cls + '">' + ico + "<span>" + x.label + "</span></a>";
  });
  return '<div class="' + (isGrid ? "mn-pop-grid" : "mn-pop-list") + '">' + out + "</div>";
}

function renderBottomNav() {
  if (document.getElementById("mnNav")) return;

  const isOwner = localStorage.getItem("isOwner") === "true";
  const cur = mnNormPath(location.pathname);
  const realIdx = mnActiveIndex();

  
  const nav = document.createElement("nav");
  nav.id = "mnNav";
  nav.className = "mn-nav mn-no-anim";
  nav.style.setProperty("--n", MN_NAV.length);
  nav.style.setProperty("--i", Math.max(realIdx, 0));

  let itemsHtml = "";
  MN_NAV.forEach((it, i) => {
    const icoHtml = it.img
      ? '<img src="' + it.img + '" alt="" draggable="false" data-fallback="' + it.icon + '">'
      : mnSvg(it.icon);
    const inner = '<span class="mn-ico">' + icoHtml + '</span><span class="mn-label">' + it.label + "</span>";
    if (it.popup) {
      itemsHtml += '<button type="button" class="mn-item" data-idx="' + i + '" data-popup="' + it.popup + '" aria-expanded="false">' + inner + "</button>";
    } else {
      itemsHtml += '<a class="mn-item" data-idx="' + i + '" href="' + it.href + '">' + inner + "</a>";
    }
  });

  nav.innerHTML =
    '<div class="mn-shadow"></div>' +
    '<div class="mn-goo">' +
      '<div class="mn-bar"></div>' +
      '<div class="mn-slot mn-slot-trail"><span class="mn-blob"></span></div>' +
      '<div class="mn-slot mn-slot-lead"><span class="mn-blob"></span></div>' +
    "</div>" +
    '<div class="mn-slot mn-slot-lead mn-bead-wrap"><span class="mn-bead"></span></div>' +
    '<div class="mn-items">' + itemsHtml + "</div>" +
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
      '<defs><filter id="mn-goo" x="-10%" y="-90%" width="120%" height="280%" color-interpolation-filters="sRGB">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/>' +
        '<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"/>' +
      "</filter></defs>" +
    "</svg>";

  const scrim = document.createElement("div");
  scrim.className = "mn-scrim";
  scrim.id = "mnScrim";

  const popDl = document.createElement("div");
  popDl.className = "mn-pop";
  popDl.id = "mnPop-dl";
  popDl.innerHTML = '<div class="mn-pop-title">Downloader</div>' + mnPopHtml(MN_DOWNLOADER, false, isOwner, cur);

  const popMore = document.createElement("div");
  popMore.className = "mn-pop";
  popMore.id = "mnPop-more";
  popMore.innerHTML = '<div class="mn-pop-title">Menu Lainnya</div>' + mnPopHtml(MN_MORE, true, isOwner, cur);

  document.body.appendChild(scrim);
  document.body.appendChild(popDl);
  document.body.appendChild(popMore);
  document.body.appendChild(nav);

  
  nav.querySelectorAll(".mn-ico img").forEach(img => {
    const useFallback = () => {
      const span = img.parentNode;
      if (span) span.innerHTML = mnSvg(img.getAttribute("data-fallback"));
    };
    img.addEventListener("error", useFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  const items = Array.from(nav.querySelectorAll(".mn-item"));
  const pops = { dl: popDl, more: popMore };
  let visIdx = -2;
  let openKey = null;
  let navigating = false;

  function melt() {
    nav.classList.remove("mn-melt");
    void nav.offsetWidth;
    nav.classList.add("mn-melt");
    setTimeout(() => nav.classList.remove("mn-melt"), 700);
  }

  
  function setVisual(idx, animate) {
    if (animate === false) nav.classList.add("mn-no-anim");
    nav.style.setProperty("--i", Math.max(idx, 0));
    nav.classList.toggle("mn-none", idx < 0);
    items.forEach((el, i) => el.classList.toggle("active", i === idx));
    if (animate !== false && idx !== visIdx && idx >= 0) melt();
    visIdx = idx;
    if (animate === false) {
      requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove("mn-no-anim")));
    }
  }

  function saveIdx(idx) {
    try { sessionStorage.setItem("mn_idx", String(idx)); } catch (e) {}
  }

  function openPop(key, idx) {
    Object.keys(pops).forEach(k => pops[k].classList.toggle("show", k === key));
    scrim.classList.add("show");
    items.forEach(el => el.setAttribute("aria-expanded", el.dataset.popup === key ? "true" : "false"));
    openKey = key;
    setVisual(idx);
  }

  function closePop(revert) {
    Object.keys(pops).forEach(k => pops[k].classList.remove("show"));
    scrim.classList.remove("show");
    items.forEach(el => el.setAttribute("aria-expanded", "false"));
    openKey = null;
    if (revert !== false) setVisual(realIdx);
  }

  
  let prev = null;
  try { prev = sessionStorage.getItem("mn_idx"); } catch (e) {}
  prev = prev === null ? null : parseInt(prev, 10);

  if (prev !== null && !isNaN(prev) && prev >= 0 && prev < MN_NAV.length && prev !== realIdx && realIdx >= 0) {
    setVisual(prev, false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nav.classList.remove("mn-no-anim");
      setVisual(realIdx);
    }));
  } else {
    setVisual(realIdx, false);
  }
  if (realIdx >= 0) saveIdx(realIdx);

  
  nav.addEventListener("click", (e) => {
    const el = e.target.closest(".mn-item");
    if (!el) return;
    const idx = parseInt(el.dataset.idx, 10);
    const it = MN_NAV[idx];

    if (it.popup) {
      e.preventDefault();
      if (openKey === it.popup) closePop(true);
      else openPop(it.popup, idx);
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();

    if (idx === realIdx) {
      closePop(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (navigating) return;
    navigating = true;

    closePop(false);
    setVisual(idx);   
    saveIdx(idx);
    setTimeout(() => { location.href = it.href; }, 380);
  });

  
  [popDl, popMore].forEach(p => {
    p.addEventListener("click", (e) => {
      const a = e.target.closest(".mn-pop-item");
      if (!a) return;
      const key = p === popDl ? "dl" : "more";
      const idx = MN_NAV.findIndex(x => x.popup === key);
      const internal = a.getAttribute("href") && a.getAttribute("href").charAt(0) === "/";
      if (internal) saveIdx(idx);
      
      setTimeout(() => closePop(!internal), 0);
    });
  });

  scrim.addEventListener("click", () => closePop(true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openKey) closePop(true); });

  
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    navigating = false;
    closePop(false);
    setVisual(realIdx, false);
  });
}

/* ===================== TOPBAR ===================== */

function ensureTopbar() {
  
  let topbar = document.getElementById("dzTopbar");

  if (!topbar) {
    topbar = document.createElement("div");
    topbar.id = "dzTopbar";
    topbar.className = "topbar";

    document.querySelectorAll(".topbar").forEach(old => {
      Array.from(old.children).forEach(ch => {
        if (!ch.classList.contains("menu-btn") &&
            !ch.classList.contains("topbar-brand") &&
            !ch.id.startsWith("topbar")) {
          topbar.appendChild(ch);
        }
      });
      old.remove();
    });

    document.body.appendChild(topbar);
  }

  
  document.querySelectorAll(".menu-btn").forEach(el => el.remove());
  const oldSidebar = document.getElementById("sidebar");
  if (oldSidebar) oldSidebar.remove();
  const oldOverlay = document.getElementById("overlay");
  if (oldOverlay) oldOverlay.remove();

  
  if (!topbar.querySelector(".topbar-brand")) {
    const brand = document.createElement("a");
    brand.className = "topbar-brand";
    brand.href = "/";
    brand.innerHTML = '<img src="./media/logo.png" alt="" onerror="this.style.display=\'none\'"><span>DanzClean</span>';
    topbar.insertBefore(brand, topbar.firstChild);
  }
}

function dzTopbarOk() {
  const t = document.getElementById("dzTopbar");
  return !!(t && t.querySelector(".topbar-brand") && t.querySelector("#topbarNotifBtn") &&
            t.querySelector("#topbarCsBtn") && t.querySelector("#topbarProfileBtn"));
}

function dzRemoveStrayTopbars() {
  
  document.querySelectorAll(".topbar:not(#dzTopbar)").forEach(el => el.remove());
}

function dzRepairTopbar() {
  
  
  if (document.querySelector(".maintenance-page")) return;
  if (dzTopbarOk()) return;
  ensureTopbar();
  renderTopbarProfile();
}


function dzInjectCriticalCss() {
  if (document.getElementById("dzCriticalCss")) return;
  const st = document.createElement("style");
  st.id = "dzCriticalCss";
  st.textContent =
    "#dzTopbar.topbar{display:flex!important;align-items:center!important;padding:0 12px 0 12px!important;z-index:5100!important;overflow:hidden!important}" +
    "#dzTopbar>.topbar-notif-btn{margin:0 8px 0 auto!important}" +
    "#dzTopbar>.topbar-cs-btn{margin:0 8px 0 0!important}" +
    "#dzTopbar>.topbar-profile-btn{margin:0!important}" +
    ".topbar-brand{gap:7px;margin-right:6px}.topbar-brand img{width:34px!important;height:34px!important}" +
    ".topbar-brand span{display:block;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".mn-nav{z-index:7700!important}.mn-scrim{z-index:7600!important}.mn-pop{z-index:7750!important}";
  (document.head || document.documentElement).appendChild(st);
}

function initDanzNav() {
  dzInjectCriticalCss();
  ensureTopbar();
  renderTopbarProfile();
  renderBottomNav();

  
  let repairs = 0;
  let timer = null;
  dzRemoveStrayTopbars();
  document.addEventListener("DOMContentLoaded", dzRemoveStrayTopbars);
  window.addEventListener("load", dzRemoveStrayTopbars);
  const mo = new MutationObserver(() => {
    dzRemoveStrayTopbars();
    if (repairs >= 10 || dzTopbarOk()) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!dzTopbarOk()) { repairs++; dzRepairTopbar(); }
    }, 60);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

if (document.body) {
  initDanzNav();
} else {
  document.addEventListener("DOMContentLoaded", initDanzNav);
}
