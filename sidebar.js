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

renderSidebar();
