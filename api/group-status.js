

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Cache-Control', 's-maxage=3');

  const code = String((req.query && req.query.code) || '');
  if (!/^[A-Za-z0-9]{10,40}$/.test(code)) {
    return res.status(200).json({ ok: true, active: false });
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);

    const r = await fetch('https://chat.whatsapp.com/' + code, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
        'Accept-Language': 'id,en;q=0.8'
      },
      signal: ctrl.signal
    });
    clearTimeout(timer);

    if (r.status === 404 || r.status === 410) {
      return res.status(200).json({ ok: true, active: false });
    }
    if (!r.ok) return res.status(200).json({ ok: false });

    const html = await r.text();
    const m = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
    const title = m ? m[1].trim() : '';


    if (!title) return res.status(200).json({ ok: true, active: false });
    if (/^whatsapp (group )?invite$/i.test(title)) {
      return res.status(200).json({ ok: true, active: false });
    }
    return res.status(200).json({ ok: true, active: true });
  } catch (e) {
    return res.status(200).json({ ok: false }); 
  }
};
