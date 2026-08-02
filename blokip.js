function cekIPTerblokir(res) {
    if (res && res.error === "IP kamu telah diblokir oleh admin.") {
        showCustomModal(
            "error",
            "Anda Terblokir",
            "IP kamu telah diblokir oleh admin karena aktivitas mencurigakan. Hubungi admin kalau ini kesalahan."
        );
        return true;
    }
    return false;
}

async function cekIPSaatBuka() {
    try {
        const res = await fetch(`${API}/check-ip`);
        const data = await res.json();
        if (data.blocked) {
            showCustomModal(
                "error",
                "Anda Terblokir",
                "IP kamu telah diblokir oleh admin karena aktivitas mencurigakan. Hubungi admin kalau ini kesalahan."
            );
        }
    } catch (err) {
        
    }
}

window.addEventListener("DOMContentLoaded", cekIPSaatBuka);