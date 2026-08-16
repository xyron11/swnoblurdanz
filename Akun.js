const AKUN_OWNER = [
    "caisen004@gmail.com",
    "6285807428724",
    "danzz"
];

async function cekAkunOwnerFirebase() {
    try {
        const raw = localStorage.getItem("danzclean_logged_user");
        if (!raw) {
            localStorage.removeItem("isOwner");
            if (typeof renderSidebar === "function") renderSidebar();
            return false;
        }

        const data = JSON.parse(raw);
        const uid = data.uid;
        const loginType = data.loginType;

        let isOwner = false;

        // 1. Pengecekan awal via LocalStorage/Daftar AKUN_OWNER
        const email = ((data && data.email) || "").toLowerCase().trim();
        const username = ((data && data.username) || "").toLowerCase().trim();
        const phone = ((data && data.phone) || "").toLowerCase().trim();

        if (AKUN_OWNER.some(o => [email, username, phone].includes(o.toLowerCase().trim()))) {
            isOwner = true;
        }

        // 2. Validasi Akurat Langsung dari Database Firebase (Realtime DB)
        if (typeof firebase !== "undefined" && firebase.database && uid) {
            const dbPath = loginType === "google" ? `users/${uid}` : `manual_users/${uid}`;
            const snap = await firebase.database().ref(dbPath).once("value");
            
            if (snap.exists()) {
                const dbUser = snap.val();
                const dbEmail = (dbUser.email || "").toLowerCase().trim();
                const dbUsername = (dbUser.username || "").toLowerCase().trim();
                const dbPhone = (dbUser.phone || "").toLowerCase().trim();
                const dbRole = (dbUser.role || "").toLowerCase().trim();

                if (
                    dbRole === "owner" ||
                    AKUN_OWNER.some(o => [dbEmail, dbUsername, dbPhone].includes(o.toLowerCase().trim()))
                ) {
                    isOwner = true;
                }
            }
        }

        // 3. Simpan Status & Render Ulang Sidebar Otomatis
        if (isOwner) {
            localStorage.setItem("isOwner", "true");
        } else {
            localStorage.removeItem("isOwner");
        }

        if (typeof renderSidebar === "function") {
            renderSidebar();
        }

        return isOwner;
    } catch (err) {
        console.error("Error checking owner:", err);
        if (typeof renderSidebar === "function") renderSidebar();
        return false;
    }
}

// Jalankan saat script dimuat
document.addEventListener("DOMContentLoaded", () => {
    cekAkunOwnerFirebase();
});
