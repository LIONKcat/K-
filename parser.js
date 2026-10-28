// parser.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar.getEvent = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('luminalia') || lower.includes('christmas') || lower.includes('advent')) return 'luminalia';
    if (lower.includes('iae') || lower.includes('aerospace expo')) return 'iae';
    if (lower.includes('citizencon')) return 'citizencon';
    if (lower.includes('best in show') || lower.includes('bis') || lower.includes('ship showdown')) return 'bis';
    if (lower.includes('foundation festival') || lower.includes('foundation fest') || lower.includes('foundation guide')) return 'foundation';
    if (lower.includes('invictus')) return 'invictus';
    if (lower.includes('pirate week') || lower.includes('pirate')) return 'pirate';
    if (lower.includes('day of the vara') || lower.includes('vara')) return 'vara';
    if (lower.includes('red festival') || lower.includes('year of the')) return 'redfestival';
    if (lower.includes('referral')) return 'referral';
    if (lower.includes('alien week')) return 'alien';
    if (lower.includes('resource drive')) return 'resource';
    if (lower.includes('alliance aid')) return 'alliance';
    if (lower.includes('stella fortuna')) return 'fortuna';
    if (lower.includes('overdrive')) return 'overdrive';
    if (lower.includes('hunt the polaris')) return 'hunt';
    return 'other';
};

KLionHangar.getCategory = (itemBlock, name) => {
    let categories = new Set(); // 🚀 使用 Set 收集所有分类
    
    if (itemBlock.querySelector('.js-upgrade-data')) categories.add('upgrade');
    
    let shipCount = 0;
    itemBlock.querySelectorAll('.kind').forEach(kindEl => {
        if (kindEl.textContent.trim().toLowerCase().includes('ship')) shipCount++;
    });

    const rawText = itemBlock.textContent || '';
    const rawTextLower = rawText.toLowerCase();
    const nameLower = name.toLowerCase();

    if (rawTextLower.includes('star citizen digital download') || rawTextLower.includes('squadron 42 digital download')) categories.add('package');
    if (shipCount > 1) categories.add('package');
    if (shipCount === 1) categories.add('standalone');
    
    if (nameLower.includes('upgrade') || nameLower.includes('ccu')) categories.add('upgrade');
    if (nameLower.includes('paint') || nameLower.includes('livery') || rawTextLower.includes('paint') || rawTextLower.includes('livery') || rawTextLower.includes('skin')) categories.add('paint');
    if (nameLower.includes('referral')) categories.add('referral');
    if (nameLower.includes('subscriber') || rawTextLower.includes('coupon')) categories.add('subscriber');

    const fpsKeywords = ['fps equipment', 'gear', 'armor', 'helmet', 'suit', 'jacket', 'backpack', 'smg', 'rifle', 'pistol', 'shotgun', 'sniper', 'lmg', 'knife', 'weapon', 'gun', 'grenade', 'undersuit', 'gloves', 'boots', 'pants', 'shirt'];
    if (fpsKeywords.some(kw => rawTextLower.includes(kw))) categories.add('fps');

    const compKeywords = ['component', 'shield', 'cooler', 'power plant', 'quantum drive', 'tractor beam', 'mining', 'salvage', 'repeater', 'cannon', 'gimbal', 'missile', 'torpedo', 'radar', 'scanner'];
    if (compKeywords.some(kw => rawTextLower.includes(kw))) categories.add('component');

    const decoKeywords = ['hangar decoration', 'decoration', 'poster', 'plushie', 'bobblehead', 'trophy', 'model', 'statue', 'fishtank', 'flair', 'plant', 'sign', 'mug', 'bed', 'lamp', 'coin', 'display'];
    if (decoKeywords.some(kw => rawTextLower.includes(kw))) categories.add('decoration');
    
    // 如果没有任何分类命中，则归类为 other
    if (categories.size === 0) {
        categories.add('other');
    }
    
    return Array.from(categories); // 返回数组
};

KLionHangar.extractFromDOM = (root, pageNum = 1) => {
    const items = [];
    let idxInPage = 1;

    root.querySelectorAll('.item-image-wrapper').forEach(wrapper => {
        if (wrapper.closest('.sc-subitems')) return; 
        const itemBlock = wrapper.closest('li') || wrapper.closest('.row') || wrapper.parentElement.parentElement;
        if (!itemBlock) return;

        let imgUrl = '';
        const bgMatch = itemBlock.innerHTML.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
        if (bgMatch) imgUrl = bgMatch[1];
        if (!imgUrl) {
            const match = itemBlock.innerHTML.match(/https?:\/\/media\.robertsspaceindustries\.com\/[^"'\s\)]+/i);
            if (match) imgUrl = match[0];
        }
        if (imgUrl && imgUrl.startsWith('/')) imgUrl = 'https://robertsspaceindustries.com' + imgUrl;

        const linkNode = itemBlock.querySelector('a[href*="/pledges/"], a[href*="/buy-back/"]') || itemBlock.querySelector('a');
        let href = '#';
        if (linkNode) {
            const h = linkNode.getAttribute('href') || '';
            href = h.startsWith('http') ? h : 'https://robertsspaceindustries.com' + h;
        }
        let pledgeId = '';
        const hrefMatch = href.match(/\/(?:pledges|buy-back)\/(\d+)/i);
        if (hrefMatch) {
            pledgeId = hrefMatch[1];
        } else {
            const dataId = itemBlock.querySelector('[data-pledge-id], [data-id]');
            if (dataId) {
                const val = dataId.getAttribute('data-pledge-id') || dataId.getAttribute('data-id');
                if (val && /^\d{7,9}$/.test(val)) pledgeId = val;
            }
            if (!pledgeId) {
                const allNumbers = itemBlock.innerHTML.match(/\b\d{7,9}\b/g);
                if (allNumbers) pledgeId = allNumbers[0];
            }
        }

        const nameNode = itemBlock.querySelector('.title, .item-title, [class*="title"], [class*="name"]') || linkNode;
        let name = nameNode ? nameNode.textContent.trim() : '未知物品';
        name = name.replace(/null/ig, '').replace(/归属/g, '').replace(/\[\]/g, '').replace(/\s+/g, ' ').trim();

        const rawText = itemBlock.textContent || '';
        let createdDate = '未知';
        let itemYear = 'unknown'; 
        const engDateMatch = rawText.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s*\d{4}/i);
        const zhDateMatch = rawText.match(/\d{4}年\d{1,2}月\d{1,2}日/);
        if (engDateMatch) createdDate = engDateMatch[0];
        else if (zhDateMatch) createdDate = zhDateMatch[0];
        
        if (createdDate !== '未知') {
            const yMatch = createdDate.match(/\b(20\d{2})\b/);
            if (yMatch) itemYear = yMatch[1];
        }

        let priceAmount = 0;
        const pledgeValueInput = itemBlock.querySelector('input.js-pledge-value');
        if (pledgeValueInput && pledgeValueInput.value) {
            const match = pledgeValueInput.value.match(/[\d.]+/);
            if (match) priceAmount = parseFloat(match[0]);
        }

        const hasLti = rawText.toLowerCase().includes('lifetime') || rawText.includes('LTI');
        const isMeltable = itemBlock.querySelector('.js-reclaim') !== null;
        const hasGiftBtn = Array.from(itemBlock.querySelectorAll('.label')).some(el => el.textContent.toLowerCase().includes('gift'));
        const isUpgraded = itemBlock.querySelector('.upgraded') !== null;

        let subItems = [];
        let allSubText = '';
        const subContainer = itemBlock.querySelector('.items, .expand-content, ul[class*="items"]');
        if (subContainer) {
            subContainer.querySelectorAll('li, .item, .row').forEach(subEl => {
                let subImg = '';
                const sWrapper = subEl.querySelector('[style*="background-image"]') || subEl.querySelector('.item-image-wrapper');
                if (sWrapper && sWrapper.style.backgroundImage) {
                    const m = sWrapper.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                    if (m) subImg = m[1].replace(/['"]/g, '');
                }
                if (!subImg) {
                    const imgNode = subEl.querySelector('img');
                    if (imgNode) {
                        subImg = imgNode.getAttribute('data-src') || imgNode.src || '';
                    }
                }
                
                const subNameEl = subEl.querySelector('.title, .name, h3, h4');
                if (subNameEl) {
                    let sName = subNameEl.textContent.trim().replace(/null/ig, '').replace(/\s+/g, ' ');
                    if (sName && sName !== '未知物品') {
                        let matrixData = null;
                        Object.keys(KLionHangar.shipMatrix).forEach(shipName => {
                            if (sName.includes(shipName)) matrixData = KLionHangar.shipMatrix[shipName];
                        });
                        
                        let matrixImg = '';
                        if (matrixData && matrixData.media && matrixData.media.length > 0 && matrixData.media[0].images && matrixData.media[0].images.heap_infobox) {
                            matrixImg = matrixData.media[0].images.heap_infobox;
                        }

                        subItems.push({ 
                            name: sName, 
                            img: subImg || matrixImg,
                            matrix: matrixData
                        });
                        allSubText += ' ' + sName;
                    }
                }
            });
        }

        if ((!imgUrl || imgUrl.includes('default') || imgUrl.includes('Default')) && subItems.length > 0) {
            const firstValidSubImg = subItems.find(s => s.img && !s.img.includes('default') && !s.img.includes('Default'));
            if (firstValidSubImg) {
                imgUrl = firstValidSubImg.img;
            }
        }

        let searchText = (name + ' ' + allSubText).toLowerCase();
        let enhancedSearchText = searchText;
        if (KLionHangar.aliases) {
            for (const [enKey, zhAliases] of Object.entries(KLionHangar.aliases)) {
                if (searchText.includes(enKey)) {
                    enhancedSearchText += ' ' + zhAliases.join(' ').toLowerCase();
                }
            }
        }
        searchText = enhancedSearchText;

        const categoryTag = KLionHangar.getCategory(itemBlock, name);

        items.push({ 
            name, href, pledgeId, imgUrl, createdDate, subItems, searchText, 
            price: { amount: priceAmount, currency: 'USD' },
            flags: { hasLti, isMeltable, isGiftable: hasGiftBtn, isUpgraded },
            itemYear, itemEvent: KLionHangar.getEvent(searchText), itemCategory: categoryTag,
            pageNum, idxInPage 
        });
        idxInPage++;
    });
    return items;
};