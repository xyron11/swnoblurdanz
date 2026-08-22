const SIDEBAR_MENU = [
  { href: "/", icon: "./media/dashboard.png", label: "Dashboard" },
  {
    type: "submenu",
    icon: "./media/downloader.png",
    label: "Downloader",
    children: [
      { href: "/tiktok.html", label: "TikTok Downloader" },
      { href: "/instagram.html", label: "Instagram Downloader" },
      { href: "/yt.html", label: "YouTube Downloader" },
            { href: "/pinterest.html", label: "Pinterest Downloader" },
    ],
  },
  { href: "https://whatsapp.com/channel/0029VbCPkeX2UPBEbTumgG2Y", icon: "./media/channel.png", label: "Channel WhatsApp", target: "_blank" },
  { href: "/creator.html", icon: "./media/creator.png", label: "Creator" },
  { href: "/stats.html", icon: "./media/statistik.png", label: "Statistik" },
  { href: "/rating.html", icon: "./media/rating.png", label: "Rating" },
  { href: "/settingakun.html", icon: "./media/setting.png", label: "Setting" },

  { href: "/maintenance.html", label: "Perbaikan", id: "maintenanceBtn", hidden: true, ownerOnly: true },
  { href: "/Blokirakun.html", label: " Blokir Akun", id: "blockAkunBtn", hidden: true, ownerOnly: true },
  { href: "#", label: "Logout Akun", id: "userLogoutBtn" },
];

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "userLogoutBtn") {
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

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const isOwner = localStorage.getItem("isOwner") === "true";

  let html = `
    <div class="sidebar-header">
      <div class="logo-box">
        <img src="./media/logo.png">
      </div>
    </div>
  `;

  SIDEBAR_MENU.forEach((item, index) => {
    if (item.type === "submenu") {
      const iconHtml = item.icon ? `<img src="${item.icon}">` : "";
      const submenuId = `submenu-${index}`;

      html += `<a href="#" class="submenu-trigger" data-submenu-target="${submenuId}">
        ${iconHtml}${item.label}
        <span class="submenu-arrow">▾</span>
      </a>\n`;

      html += `<div class="submenu-container" id="${submenuId}">\n`;
      item.children.forEach(child => {
        const targetAttr = child.target ? ` target="${child.target}"` : "";
        html += `<a href="${child.href}"${targetAttr} class="submenu-item">${child.label}</a>\n`;
      });
      html += `</div>\n`;
      return;
    }

    // Item ownerOnly hanya ditampilkan kalau akun yang login ada di daftar akun.js
    if (item.ownerOnly && !isOwner) return;

    const targetAttr = item.target ? ` target="${item.target}"` : "";
    const idAttr = item.id ? ` id="${item.id}"` : "";
    const styleAttr = item.hidden && !item.ownerOnly ? ` style="display:none;"` : "";
    const iconHtml = item.icon ? `<img src="${item.icon}">` : "";

    html += `<a href="${item.href}"${targetAttr}${idAttr}${styleAttr}>${iconHtml}${item.label}</a>\n`;
  });

  sidebar.innerHTML = html;
  attachSubmenuEvents();
  highlightActiveLink();
}

function attachSubmenuEvents() {
  document.querySelectorAll(".submenu-trigger").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute("data-submenu-target");
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.classList.contains("show");

      if (isOpen) {
        submenu.style.maxHeight = null;
        submenu.classList.remove("show");
      } else {
        submenu.classList.add("show");
        submenu.style.maxHeight = submenu.scrollHeight + "px";
      }

      trigger.classList.toggle("submenu-open");
    });
  });
}

function highlightActiveLink() {
  let path = location.pathname;
  if (path.endsWith("/index.html")) path = "/";

  document.querySelectorAll("#sidebar a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) {
      a.classList.add("active-link");
    }
  });
}

function renderTopbarProfile() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || document.getElementById("topbarProfileBtn")) return;

  let loggedUser = {};
  try {
    loggedUser = JSON.parse(localStorage.getItem("danzclean_logged_user")) || {};
  } catch (e) {
    loggedUser = {};
  }

  const displayName = loggedUser.username || "User";
  const fallbackAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName) + "&background=4c7dff&color=fff";
  const avatarSrc = loggedUser.photo || fallbackAvatar;

  const profileBtn = document.createElement("button");
  profileBtn.type = "button";
  profileBtn.className = "topbar-profile-btn";
  profileBtn.id = "topbarProfileBtn";
  profileBtn.innerHTML = `<img src="${avatarSrc}" alt="Profil" onerror="this.src='${fallbackAvatar}'"><span class="topbar-profile-status"></span>`;
  topbar.appendChild(profileBtn);

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

renderSidebar();
renderTopbarProfile();
