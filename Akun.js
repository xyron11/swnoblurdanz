

const AKUN_OWNER = [
    "caisen004@gmail.com",
    "6285807428724", 
    "admin"          
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

cekAkunOwner();
