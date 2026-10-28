// api.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar.fetchPageViaFetch = async (pageNum) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNum);
    url.searchParams.set('t', Date.now()); 
    
    try {
        const response = await fetch(url.toString(), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!response.ok) throw new Error('Fetch failed');
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = KLionHangar.extractFromDOM(doc, pageNum);
        if (items.length === 0) throw new Error('No items');
        return { items, timeout: false };
    } catch (e) {
        return KLionHangar.fetchPageViaIframe(pageNum);
    }
};

KLionHangar.fetchPageViaIframe = (pageNum) => {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageNum);
        iframe.src = url.toString();
        
        let isResolved = false;
        const timeoutTimer = setTimeout(() => {
            if (!isResolved) { isResolved = true; iframe.remove(); resolve({ items: [], timeout: true }); }
        }, 3500);

        iframe.onload = () => {
            let attempts = 0;
            const checkTimer = setInterval(() => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (doc.querySelectorAll('.item-image-wrapper').length > 0) {
                        clearInterval(checkTimer);
                        setTimeout(() => {
                            if (isResolved) return;
                            isResolved = true;
                            clearTimeout(timeoutTimer);
                            const items = KLionHangar.extractFromDOM(doc, pageNum);
                            iframe.remove();
                            resolve({ items, timeout: false });
                        }, 10);
                    } else {
                        attempts++;
                        if (attempts > 30) { clearInterval(checkTimer); if (!isResolved) { isResolved = true; clearTimeout(timeoutTimer); iframe.remove(); resolve({ items: [], timeout: true }); } }
                    }
                } catch(e) { clearInterval(checkTimer); if (!isResolved) { isResolved = true; clearTimeout(timeoutTimer); iframe.remove(); resolve({ items: [], timeout: true }); } }
            }, 50); 
        };
        document.body.appendChild(iframe);
    });
};

KLionHangar.loadStoreCredits = async () => {
    try {
        const res = await fetch('/en/account/dashboard', { credentials: 'same-origin' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.querySelector('script[data-platform-client-props]');
        if (script) {
            const raw = script.getAttribute('data-platform-client-props');
            const decoded = new DOMParser().parseFromString(raw, 'text/html').documentElement.textContent;
            const data = JSON.parse(decoded);
            
            // 🚀 抓取昵称
            const account = (((data || {}).routerParams || {}).account) || {};
            if (account.nickname) {
                KLionHangar.stats.nickname = account.nickname;
            } else if (account.handle) {
                KLionHangar.stats.nickname = account.handle;
            }
            
            // 抓取信用点
            const credits = account.creditsData || [];
            for (let c of credits) {
                if (c.variant === 'store') {
                    KLionHangar.stats.storeCredits = c.value / 100;
                    break;
                }
            }
        }
    } catch(e) {}
};

KLionHangar.loadShipData = async () => {
    try {
        const matrixRes = await fetch('/ship-matrix/index', { credentials: 'same-origin' });
        const matrixData = await matrixRes.json();
        if (matrixData && matrixData.data) {
            matrixData.data.forEach(ship => {
                KLionHangar.shipMatrix[ship.name] = ship;
            });
        }
    } catch(e) {}
};