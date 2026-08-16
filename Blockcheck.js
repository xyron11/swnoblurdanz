

(function () {

    function getCurrentUid() {
        try {
            const stored = localStorage.getItem("danzclean_logged_user");
            if (!stored) return null;
            const data = JSON.parse(stored);
            return data && data.uid ? data.uid : null;
        } catch (e) {
            return null;
        }
    }

    function paksaLogout() {
        localStorage.removeItem("danzclean_logged_user");
        localStorage.removeItem("isOwner");
        if (typeof firebase !== "undefined" && firebase.auth) {
            firebase.auth().signOut().catch(() => {});
        }
    }

    function tampilkanLayarBlokir(reason) {
        // Cegah interaksi lain di halaman
        document.documentElement.style.overflow = "hidden";

        const overlay = document.createElement("div");
        overlay.id = "accountBlockedOverlay";
        overlay.style.cssText = `
            position:fixed; inset:0; z-index:999999;
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            padding:32px 24px; text-align:center;
            background:#070a13; color:#fff;
            font-family:'Poppins', sans-serif;
        `;
        overlay.innerHTML = `
            <div style="font-size:60px; margin-bottom:14px;">🚫</div>
            <div style="font-size:24px; font-weight:800; margin-bottom:10px;
                background:linear-gradient(135deg,#ffffff,#ff6b6b);
                -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
                Akun Kamu Diblokir
            </div>
            <div style="color:#aeb8e8; font-size:14px; max-width:360px; line-height:1.7; margin-bottom:26px;">
                Akun ini telah diblokir oleh admin dan tidak bisa lagi mengakses layanan danzclean.
                ${reason ? "<br><br><b>Alasan:</b> " + reason : ""}
                <br><br>Jika kamu merasa ini kesalahan, silakan hubungi admin.
            </div>
            <button id="blockedLogoutBtn" style="
                background:#ff4d4d; color:#fff; border:none;
                padding:14px 30px; border-radius:14px;
                font-weight:700; font-size:14px; cursor:pointer;">
                LOGOUT
            </button>
        `;
        document.body.appendChild(overlay);

        document.getElementById("blockedLogoutBtn").addEventListener("click", function () {
            paksaLogout();
            location.href = "/login.html";
        });
    }

    const uid = getCurrentUid();
    if (!uid) return; // belum login, tidak perlu dicek

    function mulaiPantau() {
        firebase.database().ref("blocked_users/" + uid).on("value", function (snap) {
            const data = snap.val();
            if (data && data.blocked) {
                if (!document.getElementById("accountBlockedOverlay")) {
                    tampilkanLayarBlokir(data.reason);
                }
            }
        });
    }

    if (typeof firebase !== "undefined" && firebase.database) {
        mulaiPantau();
    } else {

        const waitFirebase = setInterval(() => {
            if (typeof firebase !== "undefined" && firebase.database) {
                clearInterval(waitFirebase);
                mulaiPantau();
            }
        }, 200);
    }

})();