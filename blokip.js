function tampilkanLayarBlokir() {
    document.body.innerHTML = `
        <div style="
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: #0a0e1a;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            text-align: center; padding: 30px; box-sizing: border-box;
            z-index: 999999; font-family: sans-serif;
        ">
            <div style="font-size: 60px; color: #ff4d4d; margin-bottom: 20px;">✕</div>
            <h1 style="color: #fff; font-size: 28px; margin: 0 0 15px;">Anda Terblokir</h1>
            <p style="color: #a0aec0; font-size: 16px; max-width: 320px; line-height: 1.5;">
                kamu telah diblokir oleh admin karena aktivitas mencurigakan.
            </p>
        </div>
    `;
    document.documentElement.style.overflow = "hidden";
}

function cekIPTerblokir(res) {
    if (res && res.error === "IP kamu telah diblokir oleh admin.") {
        tampilkanLayarBlokir();
        return true;
    }
    return false;
}

async function cekIPSaatBuka() {
    try {
        const res = await fetch(`${API}/check-ip`);
        const data = await res.json();
        if (data.blocked) {
            tampilkanLayarBlokir();
        }
    } catch (err) {
        
    }
}

window.addEventListener("DOMContentLoaded", cekIPSaatBuka);
