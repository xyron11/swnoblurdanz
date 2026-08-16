const AKUN_OWNER = [
    "caisen004@gmail.com",
    "6285807428724", 
    "admin",
    "danzz"
];

function cekAkunOwner() {
    try {
        const raw = localStorage.getItem("danzclean_logged_user");

        if (!raw) {
            localStorage.removeItem("isOwner");
            return false;
        }

        const data = JSON.parse(raw);

        const email = ((data && data.email) || "").toLowerCase().trim();
        const username = ((data && data.username) || "").toLowerCase().trim();
        const phone = ((data && data.phone) || "").toLowerCase().trim();
        const nomor = ((data && data.nomor) || "").toLowerCase().trim();

        const isOwner = AKUN_OWNER.some(owner => {
            const target = owner.toLowerCase().trim();
            return target === email || target === username || target === phone || target === nomor;
        });

        if (isOwner) {
            localStorage.setItem("isOwner", "true");
        } else {
            localStorage.removeItem("isOwner");
        }

        return isOwner;
    } catch (err) {
        localStorage.removeItem("isOwner");
        return false;
    }
}

// 1. Pengecekan lokal instan (Cegah crash)
cekAkunOwner();

// 2. Pengecekan ekstra dari Database Firebase saat halaman sudah selesai dimuat
window.addEventListener("load", function() {
    if (typeof firebase === "undefined" || !firebase.database) return;

    try {
        const raw = localStorage.getItem("danzclean_logged_user");
        if (!raw) return;

        const data = JSON.parse(raw);
        if (!data || !data.uid) return;

        const dbPath = data.loginType === "google" ? `users/${data.uid}` : `manual_users/${data.uid}`;
        
        firebase.database().ref(dbPath).once("value").then(snap => {
            if (snap.exists()) {
                const dbUser = snap.val();
                const dbRole = (dbUser.role || "").toLowerCase().trim();
                
                if (dbRole === "owner") {
                    localStorage.setItem("isOwner", "true");
                    if (typeof renderSidebar === "function") renderSidebar();
                }
            }
        }).catch(function(e) {});
    } catch (e) {}
});
