// ui.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar.updateStats = (items) => {
    let totalUsd = 0;
    let counts = { standalone: 0, package: 0, upgrade: 0, paint: 0, fps: 0, decoration: 0, other: 0 };
    
    items.forEach(item => {
        totalUsd += item.price.amount;
        let mainCat = Array.isArray(item.itemCategory) ? item.itemCategory[0] : item.itemCategory;
        if (counts[mainCat] !== undefined) counts[mainCat]++;
        else counts.other++;
    });

    const p = document.getElementById('sc-stats-panel');
    if (p) {
        const t = KLionHangar.t;
        p.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; width:100%;">
            <div style="display:flex; align-items:baseline; gap:12px; flex-wrap:wrap;">
                <div class="sc-stat-item"><span class="sc-stat-val">${items.length}</span><span class="sc-stat-label">${t('total_items')}</span></div>
                <div class="sc-stat-item"><span class="sc-stat-val">${counts.upgrade}</span><span class="sc-stat-label">${t('upgrades')}</span></div>
                <div class="sc-stat-item"><span class="sc-stat-val">${counts.standalone}</span><span class="sc-stat-label">${t('ships')}</span></div>
                <div class="sc-stat-item"><span class="sc-stat-val">${counts.package}</span><span class="sc-stat-label">${t('packages')}</span></div>
                <div class="sc-stat-item" style="border-left: 1px solid var(--sc-panel-border); padding-left: 12px;">
                    <span class="sc-stat-val">${totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2})}</span><span class="sc-stat-label">${t('value_usd')}</span>
                </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                <div class="sc-stat-item">
                    <span class="sc-stat-val" style="color: #f0883e;">${KLionHangar.stats.storeCredits.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    <span class="sc-stat-label">${t('credits_usd')}</span>
                </div>
                
                <div style="display:flex; gap:6px; align-items:center; border-left: 1px solid var(--sc-panel-border); padding-left: 12px;">
                    <div id="sc-chart-container" style="position: relative; display:flex; align-items:center; background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 6px; border: 1px solid var(--sc-border); cursor: pointer;" title="Details">
                        ${(() => {
                            const total = items.length || 1;
                            let currentOffset = 0;
                            const colors = { standalone: '#58a6ff', package: '#3fb950', upgrade: '#f0883e', paint: '#db61a2', fps: '#39c5cf', decoration: '#a371f7', other: '#8b949e' };
                            
                            const labels = {
                                standalone: KLionHangar.lang === 'en' ? 'Ships' : '舰船',
                                package: KLionHangar.lang === 'en' ? 'Packages' : '组合包',
                                upgrade: KLionHangar.lang === 'en' ? 'Upgrades' : '升级包',
                                paint: KLionHangar.lang === 'en' ? 'Paints' : '涂装',
                                fps: KLionHangar.lang === 'en' ? 'FPS Gear' : 'FPS装备',
                                decoration: KLionHangar.lang === 'en' ? 'Decor' : '装饰',
                                other: KLionHangar.lang === 'en' ? 'Other' : '其它'
                            };
                            const distTitle = KLionHangar.lang === 'en' ? 'Asset Distribution' : '资产分布';
                            
                            let svgCircles = `<circle cx="18" cy="18" r="15.9" fill="transparent" stroke="var(--sc-border)" stroke-width="4"></circle>`;
                            let legendHtml = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; font-size:12px; color:var(--sc-text); line-height:1.2;">`;
                            
                            for (let key in counts) {
                                if (counts[key] > 0) {
                                    const percent = (counts[key] / total) * 100;
                                    svgCircles += `<circle cx="18" cy="18" r="15.9" fill="transparent" stroke="${colors[key]}" stroke-width="4" stroke-dasharray="${Math.max(0.1, percent - 0.5)} ${100 - percent + 0.5}" stroke-dashoffset="-${currentOffset}"></circle>`;
                                    currentOffset += percent;
                                    legendHtml += `<div style="display:flex; align-items:center; gap:4px;"><span style="color:${colors[key]}; font-size:14px; line-height:1;">●</span> ${labels[key]} <span style="font-weight:bold; color:var(--sc-title);">${counts[key]}</span></div>`;
                                }
                            }
                            legendHtml += `</div>`;
                            
                            return `
                                <svg viewBox="0 0 36 36" style="width:22px; height:22px; transform: rotate(-90deg); flex-shrink:0;">${svgCircles}</svg>
                                <div id="sc-chart-popover" style="display:none; position:absolute; top: calc(100% + 8px); right: 0; background: var(--sc-modal-bg); border: 1px solid var(--sc-border); border-radius: 6px; padding: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 1000; min-width: 180px; cursor: default;">
                                    <div style="margin-bottom: 8px; font-weight: bold; font-size: 13px; color: var(--sc-title); border-bottom: 1px solid var(--sc-border); padding-bottom: 6px;">${distTitle}</div>
                                    ${legendHtml}
                                </div>
                            `;
                        })()}
                    </div>
                </div>
            </div>
          </div>
        `;

        const chartBtn = document.getElementById('sc-chart-container');
        const popover = document.getElementById('sc-chart-popover');
        if (chartBtn && popover) {
            chartBtn.onclick = (e) => {
                e.stopPropagation();
                popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
            };
            document.addEventListener('click', () => {
                if (popover.style.display === 'block') {
                    popover.style.display = 'none';
                }
            });
        }
    }
};

const initListResizers = () => {
    const resizers = document.querySelectorAll('.sc-list-resizer');
    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const th = resizer.parentElement;
            const startX = e.clientX;
            const startWidth = th.offsetWidth;
            const colKey = resizer.dataset.col;
            
            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const newWidth = Math.max(30, startWidth + dx); // 图片列可能比较窄，允许最小 30px
                
                document.querySelectorAll(`.sc-th-${colKey}, .sc-td-${colKey}`).forEach(el => {
                    el.style.width = newWidth + 'px';
                    el.style.flex = 'none';
                });
                
                KLionHangar.columnWidths[colKey] = newWidth;
            };
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.cursor = 'default';
                localStorage.setItem(KLionHangar.COL_WIDTH_KEY, JSON.stringify(KLionHangar.columnWidths));
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'col-resize';
        });
    });
};

KLionHangar.renderGrid = (itemsToRender) => {
    const grid = document.getElementById('sc-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    const fragment = document.createDocumentFragment();

    if (KLionHangar.viewMode === 'list') {
        const t = KLionHangar.t;
        const listContainer = document.createElement('div');
        listContainer.className = 'sc-list-view';
        
        const widths = KLionHangar.columnWidths || { img: 50, name: 300, tags: 100, category: 100, date: 110, price: 80, link: 60 };
        if (!widths.img) widths.img = 50; // 兼容旧缓存
        const createResizer = (col) => `<div class="sc-list-resizer" data-col="${col}"></div>`;

        // 🚀 第一列（图片列）也加上拖拽手柄
        const header = document.createElement('div');
        header.className = 'sc-list-header';
        header.innerHTML = `
            <div class="sc-th sc-th-img" style="flex:none;width:${widths.img}px;">${createResizer('img')}</div>
            <div class="sc-th sc-th-name" style="flex:none;width:${widths.name}px;">${t('col_name')}${createResizer('name')}</div>
            <div class="sc-th sc-th-tags" style="flex:none;width:${widths.tags}px;">${t('col_tags')}${createResizer('tags')}</div>
            <div class="sc-th sc-th-category" style="flex:none;width:${widths.category}px;">${t('col_category')}${createResizer('category')}</div>
            <div class="sc-th sc-th-date" style="flex:none;width:${widths.date}px;">${t('col_date')}${createResizer('date')}</div>
            <div class="sc-th sc-th-price" style="flex:none;width:${widths.price}px;">${t('col_price')}${createResizer('price')}</div>
            <div class="sc-th sc-th-link" style="flex:none;width:${widths.link}px;">${t('col_link')}</div>
        `;
        listContainer.appendChild(header);

        itemsToRender.forEach(item => {
            const row = document.createElement('div');
            row.className = 'sc-list-row';
            row.title = item.name;
            row.__item = item;
            
            let imgHtml = '';
            if (item.imgUrl && !item.imgUrl.includes('default')) {
                imgHtml = `<img loading="lazy" src="${item.imgUrl}" style="width:36px; height:36px; border-radius:4px; object-fit:cover; border:1px solid var(--sc-border);">`;
            } else {
                imgHtml = `<div style="width:36px; height:36px; border-radius:4px; background:rgba(128,128,128,0.2); display:flex; align-items:center; justify-content:center; font-size:10px; color:#8b949e;">N/A</div>`;
            }

            let tagsHtml = '';
            if (item.flags.hasLti) tagsHtml += `<span class="sc-badge" style="color:#f0883e;border-color:#f0883e;margin-right:4px;">LTI</span>`;
            if (item.flags.isGiftable) tagsHtml += `<span class="sc-badge" style="color:#3fb950;border-color:#3fb950;margin-right:4px;">🎁</span>`;
            if (item.flags.isMeltable) tagsHtml += `<span class="sc-badge" style="color:#da3633;border-color:#da3633;margin-right:4px;">♻️</span>`;

            const catMap = { standalone: t('category_standalone'), package: t('category_package'), upgrade: t('category_upgrade'), paint: t('category_paint'), fps: t('category_fps'), decoration: (KLionHangar.lang==='en'?'Decor':'装饰'), other: (KLionHangar.lang==='en'?'Other':'其它') };
            
            const cats = Array.isArray(item.itemCategory) ? item.itemCategory : [item.itemCategory];
            const catName = cats.map(c => catMap[c] || c).join(' / ');

            const jumpUrl = `${window.location.pathname}?page=${item.pageNum}`;
            const linkHtml = `<a href="${jumpUrl}" target="_blank" class="sc-list-link-btn" onclick="event.stopPropagation()">↗</a>`;
            const dateStr = KLionHangar.formatDate(item.createdDate);

            row.innerHTML = `
                <div class="sc-td sc-td-img" style="flex:none;width:${widths.img}px;">${imgHtml}</div>
                <div class="sc-td sc-td-name" style="flex:none;width:${widths.name}px;">${item.name}</div>
                <div class="sc-td sc-td-tags" style="flex:none;width:${widths.tags}px;">${tagsHtml || '<span style="opacity:0.3">-</span>'}</div>
                <div class="sc-td sc-td-category" style="flex:none;width:${widths.category}px;">${catName}</div>
                <div class="sc-td sc-td-date" style="flex:none;width:${widths.date}px;">${dateStr}</div>
                <div class="sc-td sc-td-price" style="flex:none;width:${widths.price}px;">${item.price.amount > 0 ? '$'+item.price.amount.toFixed(2) : t('modal_free')}</div>
                <div class="sc-td sc-td-link" style="flex:none;width:${widths.link}px;">${linkHtml}</div>
            `;

            listContainer.appendChild(row);
        });

        fragment.appendChild(listContainer);
        grid.appendChild(fragment);
        initListResizers();

    } else {
        grid.className = ''; 
        itemsToRender.forEach(item => {
            const cell = document.createElement('div');
            cell.className = 'sc-grid-cell';
            cell.title = item.name;
            cell.__item = item;

            let badgesHtml = '';
            if (item.flags.hasLti) badgesHtml += `<span class="sc-badge lti" title="LTI" style="color:#f0883e;border-color:#f0883e">LTI</span>`;
            if (item.flags.isGiftable) badgesHtml += `<span class="sc-badge gift" title="Giftable">🎁</span>`;
            
            if (item.flags.isMeltable) {
                badgesHtml += `<span class="sc-badge melt" title="Meltable" style="color:#da3633;border-color:#da3633; padding: 2px 4px; display:flex; align-items:center; justify-content:center;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#da3633" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </span>`;
            }
            
            if (badgesHtml) {
                const badgesDiv = document.createElement('div');
                badgesDiv.className = 'sc-card-badges';
                badgesDiv.innerHTML = badgesHtml;
                cell.appendChild(badgesDiv);
            }

            const thumb = document.createElement('div');
            thumb.className = 'sc-grid-thumb';
            if (item.imgUrl && !item.imgUrl.includes('default')) {
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = item.imgUrl;
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
                thumb.appendChild(img);
            } else {
                thumb.innerHTML = `<div style="font-size:10px; color:#8b949e;">No Image</div>`;
            }

            if (item.price.amount > 0) {
                const priceTag = document.createElement('div');
                priceTag.className = 'sc-price-tag';
                priceTag.textContent = `$${item.price.amount.toFixed(2)}`;
                cell.appendChild(priceTag);
            }

            const label = document.createElement('div');
            label.className = 'sc-grid-label';
            label.textContent = item.name;

            cell.appendChild(thumb);
            cell.appendChild(label);
            
            fragment.appendChild(cell);
        });

        grid.appendChild(fragment);
    }

    if (!grid.hasAttribute('data-hover-bound')) {
        grid.setAttribute('data-hover-bound', 'true');
        let hoverTimer = null;
        let lastCell = null;

        grid.addEventListener('click', (e) => {
            if (e.target.closest('.sc-list-link-btn') || e.target.tagName.toLowerCase() === 'a') return;
            
            const cell = e.target.closest('.sc-grid-cell') || e.target.closest('.sc-list-row');
            if (cell && cell.__item) {
                KLionHangar.showModal(cell.__item);
            }
        });

        grid.addEventListener('mouseover', (e) => {
            if (!KLionHangar.enableHoverPreview) return;
            const cell = e.target.closest('.sc-grid-cell') || e.target.closest('.sc-list-row');
            
            if (cell && cell !== lastCell) {
                lastCell = cell;
                clearTimeout(hoverTimer);
                const item = cell.__item;
                
                if (item && item.subItems && item.subItems.length > 0) {
                    hoverTimer = setTimeout(() => {
                        if (KLionHangar.enableHoverPreview) {
                            KLionHangar.showHoverTooltip(item, e);
                        }
                    }, 1000);
                }
            }
        });

        grid.addEventListener('mouseout', (e) => {
            const cell = e.target.closest('.sc-grid-cell') || e.target.closest('.sc-list-row');
            if (cell) {
                const related = e.relatedTarget;
                if (!related || !cell.contains(related)) {
                    lastCell = null;
                    clearTimeout(hoverTimer);
                    KLionHangar.hideHoverTooltip();
                }
            }
        });
    }
    
    KLionHangar.updateStats(itemsToRender);
};

KLionHangar.showModal = (item) => {
    let modal = document.getElementById('sc-modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sc-modal-overlay';
        modal.innerHTML = `
            <div id="sc-modal-content">
                <span id="sc-modal-close">&times;</span>
                <div class="sc-modal-title"></div>
                <div class="sc-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#sc-modal-close').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
    
    const t = KLionHangar.t;
    modal.querySelector('.sc-modal-title').textContent = item.name;
    
    let subHtml = '';
    if (item.subItems && item.subItems.length > 0) {
        subHtml = '<ul class="sc-subitems">';
        item.subItems.forEach(sub => {
            const imgStyle = sub.img ? `background-image: url('${sub.img}');` : 'background: rgba(0,0,0,0.2);';
            subHtml += `<li><div class="sub-img" style="${imgStyle}"></div><div class="sub-name">${sub.name}</div></li>`;
        });
        subHtml += '</ul>';
    } else {
        subHtml = `<p style="opacity:0.7; font-size:13px; margin-top:10px;">${t('modal_no_subs')}</p>`;
    }

    let tagsArr = [];
    if (item.flags.hasLti) tagsArr.push(t('lti'));
    if (item.flags.isGiftable) tagsArr.push(t('giftable'));
    if (item.flags.isMeltable) tagsArr.push(t('meltable'));
    const tagsStr = tagsArr.length > 0 ? tagsArr.join(', ') : '-';

    const jumpUrl = `${window.location.pathname}?page=${item.pageNum}`;
    const btnText = t('go_to_page');
    
    const priceStr = item.price.amount > 0 ? `$ ${item.price.amount.toFixed(2)} USD` : t('modal_free');
    const locStr = t('page_idx').replace('{page}', item.pageNum).replace('{index}', item.idxInPage);
    const dateStr = KLionHangar.formatDate(item.createdDate);
    const pledgeIdStr = item.pledgeId ? '#' + item.pledgeId : t('modal_unknown');

    modal.querySelector('.sc-modal-body').innerHTML = `
        <p><strong>${t('modal_location')}:</strong> ${locStr}</p>
        <p><strong>${t('modal_pledge_id')}:</strong> ${pledgeIdStr}</p>
        <p><strong>${t('modal_date')}:</strong> ${dateStr}</p>
        <p><strong>${t('modal_price')}:</strong> ${priceStr}</p>
        <p><strong>${t('modal_tags')}:</strong> ${tagsStr}</p>
        <p style="margin-top:15px;"><strong>${t('modal_contents')}:</strong></p>
        ${subHtml}
        <div class="sc-modal-actions" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="${jumpUrl}" target="_blank" style="background:#1f6feb; color:#fff; padding:8px 16px; border-radius:4px; text-decoration:none; font-size:14px;">${btnText}</a>
        </div>
    `;
    modal.style.display = 'flex';
};