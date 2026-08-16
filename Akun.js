const AKUN_OWNER = [
    "caisen004@gmail.com",
    "6285807428724", 
    "admin",
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

        const email = ((data && data.email) || "").toLowerCase().trim();
        const username = ((data && data.username) || "").toLowerCase().trim();
        const phone = ((data && data.phone) || "").toLowerCase().trim();
        const nomor = ((data && data.nomor) || "").toLowerCase().trim();

        if (AKUN_OWNER.some(o => [email, username, phone, nomor].includes(o.toLowerCase().trim()))) {
            isOwner = true;
        }

        if (typeof firebase !== "undefined" && firebase.database && uid) {
            const dbPath = loginType === "google" ? `users/${uid}` : `manual_users/${uid}`;
            const snap = await firebase.database().ref(dbPath).once("value");
            
            if (snap.exists()) {
                const dbUser = snap.val();
                const dbEmail = (dbUser.email || "").toLowerCase().trim();
                const dbUsername = (dbUser.username || "").toLowerCase().trim();
                const dbPhone = (dbUser.phone || dbUser.nomor || "").toLowerCase().trim();
                const dbRole = (dbUser.role || "").toLowerCase().trim();

                if (
                    dbRole === "owner" ||
                    AKUN_OWNER.some(o => [dbEmail, dbUsername, dbPhone].includes(o.toLowerCase().trim()))
                ) {
                    isOwner = true;
                }
            }
        }

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

document.addEventListener("DOMContentLoaded", () => {
    cekAkunOwnerFirebase();
});
