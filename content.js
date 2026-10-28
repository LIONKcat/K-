// content.js
(async function () {
  'use strict';

  if (!window.location.pathname.includes('/account/pledges')) {
      return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  KLionHangar.currentPage = parseInt(urlParams.get('page')) || 1;

  KLionHangar.injectStyles();

  // 🚀 模拟真实的猫咪“喵”叫
  KLionHangar.playMeowSound = () => {
      try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          
          // 主振荡器：使用锯齿波，更接近动物声带
          osc.type = 'sawtooth';
          
          // 频率包络：从低到高再到低，模拟“喵”的声调
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.45);
          
          // 带通滤波器：模拟猫咪口腔的共振峰
          filter.type = 'bandpass';
          filter.Q.value = 2.5;
          filter.frequency.setValueAtTime(800, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.2);
          filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.45);
          
          // 音量包络
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
      } catch(e) {
          console.error("Audio play failed", e);
      }
  };

  KLionHangar.updateEventOptions = () => {
      const eventSelect = document.getElementById('sc-filter-event');
      if (!eventSelect) return;
      
      const currentValue = KLionHangar.filters.event || 'all'; 
      const events = new Set();
      
      KLionHangar.globalItems.forEach(item => {
          if (item.itemEvent && item.itemEvent !== 'unknown') {
              events.add(item.itemEvent);
          }
      });
      
      const eventOrder = [
          'iae', 'invictus', 'bis', 'luminalia', 'redfestival', 
          'foundation', 'vara', 'pirate', 'alien', 'citizencon', 
          'resource', 'alliance', 'fortuna', 'overdrive', 'hunt', 
          'referral', 'other'
      ];
      
      const sortedEvents = eventOrder.filter(e => events.has(e));
      
      let html = `<option value="all">${KLionHangar.t('event')}</option>`;
      sortedEvents.forEach(e => {
          html += `<option value="${e}">${KLionHangar.t('event_' + e)}</option>`;
      });
      
      eventSelect.innerHTML = html;
      
      if (currentValue === 'all' || sortedEvents.includes(currentValue)) {
          eventSelect.value = currentValue;
          KLionHangar.filters.event = currentValue;
      } else {
          eventSelect.value = 'all';
          KLionHangar.filters.event = 'all';
      }
  };

  KLionHangar.updateYearOptions = () => {
      const yearSelect = document.getElementById('sc-filter-year');
      if (!yearSelect) return;
      
      const currentValue = KLionHangar.filters.year || 'all'; 
      const years = new Set();
      
      KLionHangar.globalItems.forEach(item => {
          if (item.itemYear && item.itemYear !== 'unknown') {
              years.add(item.itemYear);
          }
      });
      
      const sortedYears = Array.from(years).sort((a, b) => b - a);
      
      let html = `<option value="all">${KLionHangar.t('year')}</option>`;
      sortedYears.forEach(y => {
          html += `<option value="${y}">${y}</option>`;
      });
      
      yearSelect.innerHTML = html;
      
      if (currentValue === 'all' || sortedYears.includes(currentValue)) {
          yearSelect.value = currentValue;
          KLionHangar.filters.year = currentValue;
      } else {
          yearSelect.value = 'all';
          KLionHangar.filters.year = 'all';
      }
  };

  KLionHangar.showHoverTooltip = (item, event) => {
      let tooltip = document.getElementById('sc-hover-tooltip');
      if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.id = 'sc-hover-tooltip';
          document.body.appendChild(tooltip);
      }
      
      if (KLionHangar.isLightTheme) tooltip.classList.add('sc-light-theme');
      else tooltip.classList.remove('sc-light-theme');

      const t = KLionHangar.t;
      const dateStr = KLionHangar.formatDate(item.createdDate);
      const priceStr = item.price.amount > 0 ? `$${item.price.amount.toFixed(2)}` : t('modal_free');
      
      let flagsHtml = '';
      if (item.flags.hasLti) flagsHtml += '<span style="color:#f0883e; font-weight:bold; margin-right:8px;">LTI</span>';
      if (item.flags.isGiftable) flagsHtml += '<span style="color:#3fb950; margin-right:8px;" title="Giftable">🎁</span>';
      if (item.flags.isMeltable) flagsHtml += '<span style="color:#da3633; font-weight:bold; margin-right:8px;" title="Meltable">♻️</span>';

      let headerHtml = `
          <div class="sc-hover-header">
              <div class="sc-hover-row">
                  <span>📅 ${dateStr}</span>
                  <span style="color:#3fb950; font-weight:bold;">💰 ${priceStr}</span>
              </div>
              ${flagsHtml ? `<div class="sc-hover-row" style="justify-content: flex-start;">${flagsHtml}</div>` : ''}
          </div>
      `;

      let subHtml = '<ul class="sc-subitems">';
      const displayItems = item.subItems.slice(0, 5);
      displayItems.forEach(sub => {
          const imgStyle = sub.img ? `background-image: url('${sub.img}');` : 'background: rgba(0,0,0,0.2);';
          subHtml += `<li><div class="sub-img" style="${imgStyle}"></div><div class="sub-name">${sub.name}</div></li>`;
      });
      if (item.subItems.length > 5) {
          subHtml += `<li style="color:#8b949e; justify-content:center;">... +${item.subItems.length - 5}</li>`;
      }
      subHtml += '</ul>';
      
      tooltip.innerHTML = headerHtml + (item.subItems.length > 0 ? subHtml : '');
      
      tooltip.style.display = 'block';
      
      const rect = event.target.getBoundingClientRect();
      let top = rect.bottom + 10;
      let left = rect.left;
      
      if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
      if (top + tooltip.offsetHeight > window.innerHeight) top = rect.top - tooltip.offsetHeight - 10;
      
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
  };

  KLionHangar.hideHoverTooltip = () => {
      const tooltip = document.getElementById('sc-hover-tooltip');
      if (tooltip) tooltip.style.display = 'none';
  };

  KLionHangar.applyTheme = (themeState) => {
      KLionHangar.isLightTheme = themeState;
      const gridWrap = document.getElementById('sc-grid-view-container');
      const settingsWrap = document.getElementById('sc-settings-content');
      
      if (KLionHangar.isLightTheme) {
          if (gridWrap) gridWrap.classList.add('sc-light-theme');
          if (settingsWrap) settingsWrap.classList.add('sc-light-theme');
          document.getElementById('sc-theme-dark-btn')?.classList.remove('active');
          document.getElementById('sc-theme-light-btn')?.classList.add('active');
      } else {
          if (gridWrap) gridWrap.classList.remove('sc-light-theme');
          if (settingsWrap) settingsWrap.classList.remove('sc-light-theme');
          document.getElementById('sc-theme-dark-btn')?.classList.add('active');
          document.getElementById('sc-theme-light-btn')?.classList.remove('active');
      }
      KLionHangar.saveLayout();
  };

  KLionHangar.saveLayout = () => {
      try {
          const wrap = document.getElementById('sc-grid-view-container');
          const layout = {
              size: document.getElementById('sc-setting-size-select')?.value || '100',
              width: wrap?.style.width || '',
              marginLeft: wrap?.style.marginLeft || '',
              theme: KLionHangar.isLightTheme ? 'light' : 'dark',
              viewMode: KLionHangar.viewMode,
              hover: KLionHangar.enableHoverPreview,
              year: KLionHangar.filters.year,
              event: KLionHangar.filters.event,
              lti: document.getElementById('sc-filter-lti-btn')?.classList.contains('active'),
              giftable: document.getElementById('sc-filter-giftable-btn')?.classList.contains('active'),
              meltable: document.getElementById('sc-filter-meltable-btn')?.classList.contains('active'),
              sortBy: document.getElementById('sc-sort-select')?.value || 'default',
              minPrice: document.getElementById('sc-price-min')?.value || '',
              maxPrice: document.getElementById('sc-price-max')?.value || '',
              collapsed: wrap.classList.contains('sc-ui-collapsed'),
              collapsedPage: KLionHangar.currentPage
          };
          localStorage.setItem(KLionHangar.LAYOUT_KEY, JSON.stringify(layout));
      } catch(e) {}
  };

  KLionHangar.loadLayout = () => {
      const wrap = document.getElementById('sc-grid-view-container');
      const collapseBtn = document.getElementById('sc-collapse-ui-btn');
      try {
          const savedLayout = localStorage.getItem(KLionHangar.LAYOUT_KEY);
          let cfg = {};
          if (savedLayout) cfg = JSON.parse(savedLayout);
          
          if (cfg.size) {
              const sel = document.getElementById('sc-setting-size-select');
              if(sel) sel.value = cfg.size;
              document.getElementById('sc-grid').style.gridTemplateColumns = `repeat(auto-fill, minmax(${cfg.size}px, 1fr))`;
          } else {
              document.getElementById('sc-grid').style.gridTemplateColumns = `repeat(auto-fill, minmax(100px, 1fr))`;
          }
          if (cfg.width && wrap) { wrap.style.width = cfg.width; wrap.style.maxWidth = 'none'; }
          if (cfg.marginLeft && wrap) { wrap.style.marginLeft = cfg.marginLeft; }
          if (cfg.theme === 'light') KLionHangar.applyTheme(true);
          
          const savedWidths = localStorage.getItem(KLionHangar.COL_WIDTH_KEY);
          if (savedWidths) {
              try { KLionHangar.columnWidths = JSON.parse(savedWidths); } catch(e){}
          }

          if (cfg.viewMode) {
              KLionHangar.viewMode = cfg.viewMode;
          } else {
              KLionHangar.viewMode = 'grid';
          }
          updateViewModeBtn();

          if (cfg.hover !== undefined) {
              KLionHangar.enableHoverPreview = cfg.hover;
          } else {
              KLionHangar.enableHoverPreview = false;
          }
          document.getElementById('sc-hover-on-btn')?.classList.toggle('active', KLionHangar.enableHoverPreview);
          document.getElementById('sc-hover-off-btn')?.classList.toggle('active', !KLionHangar.enableHoverPreview);

          if (cfg.year) KLionHangar.filters.year = cfg.year;
          if (cfg.event) KLionHangar.filters.event = cfg.event;

          if (cfg.lti !== undefined) {
              const btn = document.getElementById('sc-filter-lti-btn');
              if (btn) btn.classList.toggle('active', cfg.lti);
              KLionHangar.filters.lti = cfg.lti;
          }
          if (cfg.giftable !== undefined) {
              const btn = document.getElementById('sc-filter-giftable-btn');
              if (btn) btn.classList.toggle('active', cfg.giftable);
              KLionHangar.filters.giftable = cfg.giftable;
          }
          if (cfg.meltable !== undefined) {
              const btn = document.getElementById('sc-filter-meltable-btn');
              if (btn) btn.classList.toggle('active', cfg.meltable);
              KLionHangar.filters.meltable = cfg.meltable;
          }
          if (cfg.sortBy) {
              const sel = document.getElementById('sc-sort-select');
              if (sel) sel.value = cfg.sortBy;
              KLionHangar.filters.sortBy = cfg.sortBy;
          }
          if (cfg.minPrice) {
              const input = document.getElementById('sc-price-min');
              if (input) input.value = cfg.minPrice;
              KLionHangar.filters.minPrice = parseFloat(cfg.minPrice);
          }
          if (cfg.maxPrice) {
              const input = document.getElementById('sc-price-max');
              if (input) input.value = cfg.maxPrice;
              KLionHangar.filters.maxPrice = parseFloat(cfg.maxPrice);
          }

          let shouldCollapse = false;
          if (cfg.collapsedPage === KLionHangar.currentPage) shouldCollapse = cfg.collapsed;
          else shouldCollapse = (KLionHangar.currentPage > 1);

          if (wrap && collapseBtn) {
              if (shouldCollapse) {
                  wrap.classList.add('sc-ui-collapsed');
                  collapseBtn.textContent = KLionHangar.t('expand');
              } else {
                  wrap.classList.remove('sc-ui-collapsed');
                  collapseBtn.textContent = KLionHangar.t('collapse');
              }
          }
      } catch(e) {}
  };

  const updateViewModeBtn = () => {
      const btn = document.getElementById('sc-view-mode-btn');
      if (!btn) return;
      const iconSpan = document.getElementById('sc-view-icon');
      const textSpan = document.getElementById('sc-view-text');
      
      if (KLionHangar.viewMode === 'list') {
          if (iconSpan) iconSpan.textContent = '☰';
          if (textSpan) textSpan.textContent = KLionHangar.t('view_list');
          btn.title = KLionHangar.t('view_list');
      } else {
          if (iconSpan) iconSpan.textContent = '▦';
          if (textSpan) textSpan.textContent = KLionHangar.t('view_grid');
          btn.title = KLionHangar.t('view_grid');
      }
  };

  KLionHangar.applyFilters = () => {
      let filtered = KLionHangar.globalItems;
      const f = KLionHangar.filters;
      
      if (f.year !== 'all') filtered = filtered.filter(i => i.itemYear === f.year);
      if (f.event !== 'all') filtered = filtered.filter(i => i.itemEvent === f.event);
      
      if (f.type !== 'all') {
          filtered = filtered.filter(i => {
              if (Array.isArray(i.itemCategory)) return i.itemCategory.includes(f.type);
              return i.itemCategory === f.type;
          });
      }
      
      if (f.keyword) filtered = filtered.filter(i => i.searchText.includes(f.keyword));
      
      if (f.lti) filtered = filtered.filter(i => i.flags.hasLti);
      if (f.giftable) filtered = filtered.filter(i => i.flags.isGiftable);
      if (f.meltable) filtered = filtered.filter(i => i.flags.isMeltable);

      if (f.minPrice !== null && !isNaN(f.minPrice)) filtered = filtered.filter(i => (i.price.amount || 0) >= f.minPrice);
      if (f.maxPrice !== null && !isNaN(f.maxPrice)) filtered = filtered.filter(i => (i.price.amount || 0) <= f.maxPrice);

      if (f.sortBy === 'default') {
          filtered.sort((a, b) => {
              if (a.pageNum !== b.pageNum) return a.pageNum - b.pageNum;
              return a.idxInPage - b.idxInPage;
          });
      } else if (f.sortBy === 'price-asc') {
          filtered.sort((a, b) => (a.price.amount || 0) - (b.price.amount || 0));
      } else if (f.sortBy === 'price-desc') {
          filtered.sort((a, b) => (b.price.amount || 0) - (a.price.amount || 0));
      }

      KLionHangar.renderGrid(filtered);
  };

  KLionHangar.exportData = (format, items) => {
      let content = '';
      let ext = format;
      if (format === 'csv') {
          content = '\uFEFFName,PledgeID,Date,Price,Category,LTI,Giftable,Meltable\n';
          items.forEach(i => {
              const dateStr = KLionHangar.formatDate(i.createdDate);
              const catStr = Array.isArray(i.itemCategory) ? i.itemCategory.join('|') : i.itemCategory;
              content += `"${i.name}",${i.pledgeId},${dateStr},${i.price.amount},${catStr},${i.flags.hasLti?'Yes':'No'},${i.flags.isGiftable?'Yes':'No'},${i.flags.isMeltable?'Yes':'No'}\n`;
          });
      } else {
          content = JSON.stringify(items.map(i => ({
              name: i.name, pledgeId: i.pledgeId, category: i.itemCategory,
              price: i.price.amount, lti: i.flags.hasLti, date: KLionHangar.formatDate(i.createdDate),
              subItems: i.subItems.map(s => ({
                  name: s.name, manufacturer: s.matrix ? s.matrix.manufacturer.name : '', status: s.matrix ? s.matrix.production_status : ''
              }))
          })), null, 2);
      }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `K-Lion-Hangar-${KLionHangar.formatTime(Date.now())}.${ext}`; a.click();
      URL.revokeObjectURL(url);
  };

  const bindUIEvents = () => {
      const t = KLionHangar.t;

      const titleBtn = document.getElementById('sc-title-btn');
      if (titleBtn) {
          titleBtn.onclick = () => {
              let aboutModal = document.getElementById('sc-about-modal');
              if (!aboutModal) {
                  aboutModal = document.createElement('div');
                  aboutModal.id = 'sc-about-modal';
                  aboutModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 100000; display: flex; align-items: center; justify-content: center;';
                  document.body.appendChild(aboutModal);
                  aboutModal.onclick = (e) => { if (e.target === aboutModal) aboutModal.style.display = 'none'; };
              }
              aboutModal.innerHTML = `
                  <div style="background: var(--sc-modal-bg); border: 1px solid var(--sc-border); border-radius: 8px; width: 400px; max-width: 90%; padding: 30px; color: var(--sc-text); position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center;">
                      <span id="sc-about-close" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px; opacity: 0.6; color: var(--sc-text);">&times;</span>
                      <div style="font-size: 40px; margin-bottom: 15px;">🦁</div>
                      <h2 style="color: var(--sc-title); margin-bottom: 15px; font-size: 18px;">K-Lion Hangar</h2>
                      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px; text-align: left;">
                          ${t('about_content')}
                      </p>
                      <button id="sc-about-btn-close" style="background: #238636; color: #fff; border: none; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">${t('about_btn')}</button>
                  </div>
              `;
              aboutModal.style.display = 'flex';
              aboutModal.querySelector('#sc-about-close').onclick = () => aboutModal.style.display = 'none';
              // 🚀 点击感谢使用播放喵叫
              aboutModal.querySelector('#sc-about-btn-close').onclick = () => {
                  KLionHangar.playMeowSound();
                  aboutModal.style.display = 'none';
              };
          };
      }

      const viewModeBtn = document.getElementById('sc-view-mode-btn');
      if (viewModeBtn) {
          viewModeBtn.onclick = () => {
              KLionHangar.viewMode = KLionHangar.viewMode === 'grid' ? 'list' : 'grid';
              updateViewModeBtn();
              KLionHangar.applyFilters();
              KLionHangar.saveLayout();
          };
      }

      const settingsBtn = document.getElementById('sc-settings-btn');
      if (settingsBtn) {
          settingsBtn.onclick = () => {
              document.getElementById('sc-settings-overlay').style.display = 'flex';
          };
      }
      const settingsClose = document.getElementById('sc-settings-close');
      if (settingsClose) {
          settingsClose.onclick = () => document.getElementById('sc-settings-overlay').style.display = 'none';
      }

      const collapseBtn = document.getElementById('sc-collapse-ui-btn');
      if (collapseBtn) {
          collapseBtn.onclick = () => {
              const wrap = document.getElementById('sc-grid-view-container');
              if (wrap.classList.contains('sc-ui-collapsed')) {
                  wrap.classList.remove('sc-ui-collapsed');
                  collapseBtn.textContent = t('collapse');
              } else {
                  wrap.classList.add('sc-ui-collapsed');
                  collapseBtn.textContent = t('expand');
              }
              KLionHangar.saveLayout();
          };
      }

      document.getElementById('sc-lang-zh-btn').onclick = () => { localStorage.setItem('sc_lang', 'zh'); location.reload(); };
      document.getElementById('sc-lang-en-btn').onclick = () => { localStorage.setItem('sc_lang', 'en'); location.reload(); };

      document.getElementById('sc-setting-size-select').onchange = (e) => {
          document.getElementById('sc-grid').style.gridTemplateColumns = `repeat(auto-fill, minmax(${e.target.value}px, 1fr))`;
          KLionHangar.saveLayout();
      };
      
      document.getElementById('sc-theme-dark-btn').onclick = () => KLionHangar.applyTheme(false);
      document.getElementById('sc-theme-light-btn').onclick = () => KLionHangar.applyTheme(true);
      
      document.getElementById('sc-hover-on-btn').onclick = () => {
          KLionHangar.enableHoverPreview = true;
          document.getElementById('sc-hover-on-btn').classList.add('active');
          document.getElementById('sc-hover-off-btn').classList.remove('active');
          KLionHangar.saveLayout();
      };
      document.getElementById('sc-hover-off-btn').onclick = () => {
          KLionHangar.enableHoverPreview = false;
          document.getElementById('sc-hover-off-btn').classList.add('active');
          document.getElementById('sc-hover-on-btn').classList.remove('active');
          KLionHangar.hideHoverTooltip();
          KLionHangar.saveLayout();
      };
      
      document.getElementById('sc-setting-clear-cache-btn').onclick = () => {
          chrome.storage.local.remove(KLionHangar.CACHE_KEY, () => {
              alert(t('cache_cleared'));
              location.reload();
          });
      };

      // 🚀 “我知道了”按钮播放喵叫
      const iKnowBtn = document.getElementById('sc-i-know-btn');
      if (iKnowBtn) {
          iKnowBtn.onclick = () => {
              KLionHangar.playMeowSound();
              iKnowBtn.textContent = "🐾"; 
              iKnowBtn.style.background = "#8b949e";
              iKnowBtn.disabled = true;
              setTimeout(() => {
                  iKnowBtn.textContent = t('i_know');
                  iKnowBtn.style.background = "#238636";
                  iKnowBtn.disabled = false;
              }, 1500);
          };
      }

      document.getElementById('sc-setting-reset-btn').onclick = () => {
          localStorage.removeItem(KLionHangar.LAYOUT_KEY);
          localStorage.removeItem(KLionHangar.COL_WIDTH_KEY);
          const wrap = document.getElementById('sc-grid-view-container');
          if (wrap) {
              wrap.style.width = '100%';
              wrap.style.marginLeft = '0';
              wrap.style.maxWidth = '100%';
              wrap.classList.remove('sc-ui-collapsed');
          }
          
          document.getElementById('sc-setting-size-select').value = '100';
          document.getElementById('sc-grid').style.gridTemplateColumns = `repeat(auto-fill, minmax(100px, 1fr))`;
          
          KLionHangar.columnWidths = { img: 50, name: 300, tags: 100, category: 100, date: 110, price: 80, link: 60 };

          KLionHangar.viewMode = 'grid';
          updateViewModeBtn();

          document.getElementById('sc-theme-dark-btn').click();
          document.getElementById('sc-hover-off-btn').click();
          
          document.getElementById('sc-filter-year').value = 'all';
          document.getElementById('sc-filter-event').value = 'all';
          document.getElementById('sc-filter-type').value = 'all';
          document.getElementById('sc-filter-lti-btn').classList.remove('active');
          document.getElementById('sc-filter-giftable-btn').classList.remove('active');
          document.getElementById('sc-filter-meltable-btn').classList.remove('active');
          document.getElementById('sc-sort-select').value = 'default';
          document.getElementById('sc-price-min').value = '';
          document.getElementById('sc-price-max').value = '';
          
          KLionHangar.filters.year = 'all'; 
          KLionHangar.filters.event = 'all'; 
          KLionHangar.filters.type = 'all';
          KLionHangar.filters.lti = false;
          KLionHangar.filters.giftable = false;
          KLionHangar.filters.meltable = false;
          KLionHangar.filters.sortBy = 'default';
          KLionHangar.filters.minPrice = null;
          KLionHangar.filters.maxPrice = null;
          
          if (collapseBtn) collapseBtn.textContent = t('collapse');
          
          KLionHangar.applyFilters();
      };

      const btnLoad = document.getElementById('sc-load-all-btn');
      if (btnLoad) {
          btnLoad.onclick = async function() {
              if (this.disabled) return;
              this.disabled = true;
              this.textContent = t('loading_data');
              
              try {
                  await Promise.all([KLionHangar.loadStoreCredits(), KLionHangar.loadShipData()]);

                  this.textContent = "Page 1...";
                  KLionHangar.globalItems = KLionHangar.extractFromDOM(document, 1);
                  KLionHangar.itemFingerprints.clear();
                  KLionHangar.globalItems.forEach(item => {
                      const fp = item.pledgeId ? `ID_${item.pledgeId}` : `NAME_${item.name}_DATE_${item.createdDate}`;
                      KLionHangar.itemFingerprints.add(fp);
                  });
                  KLionHangar.applyFilters();

                  let pageNum = 2;
                  let consecutiveFailures = 0;
                  let consecutiveNoNewData = 0;
                  let lastFirstItemId = KLionHangar.globalItems.length > 0 ? KLionHangar.globalItems[0].pledgeId : null;

                  while (pageNum <= 200) { 
                      this.textContent = `${t('reading_page')} (${KLionHangar.globalItems.length})`;
                      const results = await KLionHangar.fetchPageViaFetch(pageNum);
                      
                      let batchHasNew = false;
                      let batchFailCount = 0;

                      if (results.timeout || !results.items || results.items.length === 0) {
                          batchFailCount++;
                      } else {
                          const currentFirstItemId = results.items[0].pledgeId;
                          if (currentFirstItemId && lastFirstItemId && currentFirstItemId === lastFirstItemId) break;
                          if (currentFirstItemId) lastFirstItemId = currentFirstItemId;

                          results.items.forEach(item => {
                              const fp = item.pledgeId ? `ID_${item.pledgeId}` : `NAME_${item.name}_DATE_${item.createdDate}`;
                              if (!KLionHangar.itemFingerprints.has(fp)) {
                                  KLionHangar.itemFingerprints.add(fp);
                                  KLionHangar.globalItems.push(item);
                                  batchHasNew = true;
                              }
                          });
                      }

                      if (batchFailCount > 0) {
                          consecutiveFailures++;
                          if (consecutiveFailures >= 2) break;
                      } else {
                          consecutiveFailures = 0;
                      }

                      if (batchHasNew) {
                          consecutiveNoNewData = 0;
                          KLionHangar.applyFilters(); 
                      } else {
                          consecutiveNoNewData++;
                          if (consecutiveNoNewData >= 2) break; 
                      }
                      
                      pageNum++; 
                      await new Promise(r => setTimeout(r, 200)); 
                  }
              } catch(err) {
                  console.error("抓取异常", err);
                  document.getElementById('sc-stats-panel').innerHTML = `<div style="color:#da3633;font-size:14px;padding:10px;">❌ Error: ${err.message}</div>`;
              } finally {
                  this.innerHTML = `✅ ${t('done')} (${KLionHangar.globalItems.length})`;
                  KLionHangar.updateYearOptions();
                  KLionHangar.updateEventOptions();
                  chrome.storage.local.set({ [KLionHangar.CACHE_KEY]: { items: KLionHangar.globalItems, time: Date.now() } });
                  this.disabled = false;
              }
          };
      }

      document.getElementById('sc-grid-search').oninput = (e) => { KLionHangar.filters.keyword = e.target.value.toLowerCase().trim(); KLionHangar.applyFilters(); };
      document.getElementById('sc-filter-type').onchange = (e) => { KLionHangar.filters.type = e.target.value; KLionHangar.applyFilters(); };
      document.getElementById('sc-filter-year').onchange = (e) => { KLionHangar.filters.year = e.target.value; KLionHangar.applyFilters(); };
      document.getElementById('sc-filter-event').onchange = (e) => { KLionHangar.filters.event = e.target.value; KLionHangar.applyFilters(); };
      
      document.getElementById('sc-sort-select').onchange = (e) => {
          KLionHangar.filters.sortBy = e.target.value;
          KLionHangar.saveLayout();
          KLionHangar.applyFilters();
      };

      const handlePriceChange = () => {
          const minVal = document.getElementById('sc-price-min').value;
          const maxVal = document.getElementById('sc-price-max').value;
          KLionHangar.filters.minPrice = minVal ? parseFloat(minVal) : null;
          KLionHangar.filters.maxPrice = maxVal ? parseFloat(maxVal) : null;
          KLionHangar.saveLayout();
          KLionHangar.applyFilters();
      };
      document.getElementById('sc-price-min').oninput = handlePriceChange;
      document.getElementById('sc-price-max').oninput = handlePriceChange;
      
      document.getElementById('sc-filter-lti-btn').onclick = (e) => {
          e.target.classList.toggle('active');
          KLionHangar.filters.lti = e.target.classList.contains('active');
          KLionHangar.saveLayout();
          KLionHangar.applyFilters();
      };
      document.getElementById('sc-filter-giftable-btn').onclick = (e) => {
          e.target.classList.toggle('active');
          KLionHangar.filters.giftable = e.target.classList.contains('active');
          KLionHangar.saveLayout();
          KLionHangar.applyFilters();
      };
      document.getElementById('sc-filter-meltable-btn').onclick = (e) => {
          e.target.classList.toggle('active');
          KLionHangar.filters.meltable = e.target.classList.contains('active');
          KLionHangar.saveLayout();
          KLionHangar.applyFilters();
      };
      
      document.getElementById('sc-export-csv').onclick = () => KLionHangar.exportData('csv', KLionHangar.globalItems);
      document.getElementById('sc-export-json').onclick = () => KLionHangar.exportData('json', KLionHangar.globalItems);
      document.getElementById('sc-snapshot-btn').onclick = () => KLionHangar.generateSnapshot(KLionHangar.globalItems);
  };

  const initBackToTop = () => {
      if (document.getElementById('sc-back-to-top')) return;
      const btn = document.createElement('div');
      btn.id = 'sc-back-to-top';
      btn.innerHTML = '↑';
      btn.title = 'Top';
      document.body.appendChild(btn);

      window.addEventListener('scroll', () => {
          if (window.scrollY > 300) btn.classList.add('show');
          else btn.classList.remove('show');
      });

      btn.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  };

  const init = () => {
      if (KLionHangar.isInitDone) return;
      KLionHangar.isInitDone = true;

      initBackToTop();
      
      const t = KLionHangar.t;

      const settingsHTML = `
        <div id="sc-settings-overlay">
            <div id="sc-settings-content">
                <span id="sc-settings-close">&times;</span>
                <div class="sc-modal-title">${t('settings')}</div>
                
                <div class="sc-settings-row">
                    <span class="sc-settings-label">${t('language')}</span>
                    <div class="sc-switch-group">
                        <button id="sc-lang-zh-btn" class="sc-switch-btn ${KLionHangar.lang === 'zh' ? 'active' : ''}">中文</button>
                        <button id="sc-lang-en-btn" class="sc-switch-btn ${KLionHangar.lang === 'en' ? 'active' : ''}">English</button>
                    </div>
                </div>

                <div class="sc-settings-row">
                    <span class="sc-settings-label">${t('card_size')}</span>
                    <div class="sc-settings-controls">
                        <select id="sc-setting-size-select" class="sc-select">
                            <option value="40">40px</option>
                            <option value="60">60px</option>
                            <option value="80">80px</option>
                            <option value="100" selected>100px</option>
                            <option value="120">120px</option>
                            <option value="140">140px</option>
                            <option value="160">160px</option>
                            <option value="200">200px</option>
                        </select>
                    </div>
                </div>

                <div class="sc-settings-row">
                    <span class="sc-settings-label">${t('theme')}</span>
                    <div class="sc-switch-group">
                        <button id="sc-theme-dark-btn" class="sc-switch-btn ${!KLionHangar.isLightTheme ? 'active' : ''}">${t('theme_dark')}</button>
                        <button id="sc-theme-light-btn" class="sc-switch-btn ${KLionHangar.isLightTheme ? 'active' : ''}">${t('theme_light')}</button>
                    </div>
                </div>

                <div class="sc-settings-row">
                    <span class="sc-settings-label">${t('hover_preview')}</span>
                    <div class="sc-switch-group">
                        <button id="sc-hover-on-btn" class="sc-switch-btn">${t('on')}</button>
                        <button id="sc-hover-off-btn" class="sc-switch-btn active">${t('off')}</button>
                    </div>
                </div>

                <div class="sc-settings-row">
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span class="sc-settings-label">${t('settings_hint')}</span>
                        <span style="font-size:12px; opacity:0.7;">${t('settings_hint_desc')}</span>
                    </div>
                    <div class="sc-settings-controls">
                        <button id="sc-i-know-btn" class="sc-btn" style="background:#238636; padding: 0 16px;">${t('i_know')}</button>
                    </div>
                </div>

                <div class="sc-settings-row">
                    <span class="sc-settings-label">Actions</span>
                    <div class="sc-settings-controls">
                        <button class="sc-stat-btn" id="sc-export-csv">${t('export_csv')}</button>
                        <button class="sc-stat-btn" id="sc-export-json">${t('export_json')}</button>
                        <button class="sc-stat-btn" id="sc-snapshot-btn" style="background:#8969fc; border-color:#8969fc; color:#fff;">${t('snapshot')}</button>
                    </div>
                </div>
                
                <div class="sc-settings-row" style="margin-top: 10px;">
                    <span class="sc-settings-label"></span>
                    <div style="display: flex; gap: 10px;">
                        <button id="sc-setting-clear-cache-btn" class="sc-btn" style="background:#d73a49;">${t('clear_cache')}</button>
                        <button id="sc-setting-reset-btn" class="sc-btn" style="background:#da3633;">${t('reset_layout')}</button>
                    </div>
                </div>
            </div>
        </div>
      `;

      const wrap = document.createElement('div');
      wrap.id = 'sc-grid-view-container';
      wrap.innerHTML = `
        <div id="sc-grid-toolbar">
            <div class="sc-toolbar-left">
                <span id="sc-title-btn" style="font-weight:bold;color:var(--sc-title);font-size:14px;white-space:nowrap;cursor:pointer;user-select:none;" title="Info">🦁 K狮盘库</span>
                <input type="text" id="sc-grid-search" class="sc-select" placeholder="${t('search')}">
                
                <select id="sc-filter-type" class="sc-select">
                    <option value="all">${t('category')}</option>
                    <option value="standalone">${t('category_standalone')}</option>
                    <option value="package">${t('category_package')}</option>
                    <option value="upgrade">${t('category_upgrade')}</option>
                    <option value="paint">${t('category_paint')}</option>
                    <option value="fps">${t('category_fps')}</option>
                </select>

                <select id="sc-filter-year" class="sc-select">
                    <option value="all">${t('year')}</option>
                </select>

                <select id="sc-filter-event" class="sc-select">
                    <option value="all">${t('event')}</option>
                </select>

                <select id="sc-sort-select" class="sc-select">
                    <option value="default">${t('sort_default')}</option>
                    <option value="price-asc">${t('sort_price_asc')}</option>
                    <option value="price-desc">${t('sort_price_desc')}</option>
                </select>

                <div class="sc-price-range">
                    <input type="number" id="sc-price-min" class="sc-price-input" placeholder="${t('min_price')}" min="0">
                    <span>-</span>
                    <input type="number" id="sc-price-max" class="sc-price-input" placeholder="${t('max_price')}" min="0">
                </div>

                <div style="display:flex;gap:6px;">
                    <button id="sc-filter-lti-btn" class="sc-toggle-btn">${t('lti')}</button>
                    <button id="sc-filter-giftable-btn" class="sc-toggle-btn">${t('giftable')}</button>
                    <button id="sc-filter-meltable-btn" class="sc-toggle-btn">${t('meltable')}</button>
                </div>
            </div>
            
            <div class="sc-toolbar-right">
                <button id="sc-load-all-btn" class="sc-btn">${t('load_btn')}</button>
                <button id="sc-collapse-ui-btn" class="sc-btn" style="background:var(--sc-btn-bg); color:var(--sc-text); border:1px solid var(--sc-border);">${t('collapse')}</button>
                
                <button id="sc-view-mode-btn" class="sc-view-btn" title="${t('view_grid')}">
                    <span id="sc-view-icon">▦</span> <span id="sc-view-text">${t('view_grid')}</span>
                </button>
                
                <button id="sc-settings-btn" class="sc-icon-btn" title="${t('settings')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div id="sc-stats-panel">
            <div style="color:var(--sc-text);font-size:14px;">${t('loading')}</div>
        </div>
        <div id="sc-grid"></div>
        ${settingsHTML}
      `;
      
      const wrapper = document.createElement('div');
      wrapper.id = 'sc-grid-wrapper';
      wrapper.style.cssText = 'width: 100%; position: relative; box-sizing: border-box; margin-bottom: 20px;';
      wrapper.appendChild(wrap);

      const originalList = document.querySelector('#billing_pledges ul.lists') || document.querySelector('.list-items') || document.querySelector('.item-image-wrapper')?.closest('li')?.parentElement;
      if (originalList && originalList.parentNode) originalList.parentNode.insertBefore(wrapper, originalList);
      else {
          const mainContent = document.querySelector('#billing_pledges') || document.querySelector('.content-block3') || document.querySelector('.inner-content') || document.querySelector('.content-block1');
          if (mainContent) mainContent.prepend(wrapper);
          else document.body.prepend(wrapper);
      }

      const resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
              wrapper.style.height = entry.contentRect.height + 'px';
          }
      });
      resizeObserver.observe(wrap);

      const leftHandle = document.createElement('div');
      leftHandle.className = 'sc-resize-handle sc-resize-left';
      wrap.appendChild(leftHandle);
      const rightHandle = document.createElement('div');
      rightHandle.className = 'sc-resize-handle sc-resize-right';
      wrap.appendChild(rightHandle);

      let isLeftDragging = false, isRightDragging = false, startX, startWidth, startMarginLeft;
      leftHandle.addEventListener('mousedown', (e) => {
          isLeftDragging = true; startX = e.clientX; startWidth = wrap.offsetWidth; startMarginLeft = parseFloat(window.getComputedStyle(wrap).marginLeft) || 0;
          document.body.style.cursor = 'ew-resize'; e.preventDefault();
      });
      rightHandle.addEventListener('mousedown', (e) => {
          isRightDragging = true; startX = e.clientX; startWidth = wrap.offsetWidth;
          document.body.style.cursor = 'ew-resize'; e.preventDefault();
      });
      
      document.addEventListener('mousemove', (e) => {
          if (isLeftDragging) {
              const dx = e.clientX - startX;
              if (startWidth - dx >= 400) {
                  wrap.style.width = (startWidth - dx) + 'px';
                  wrap.style.marginLeft = (startMarginLeft + dx) + 'px';
                  wrap.style.maxWidth = 'none';
              }
          } else if (isRightDragging) {
              const dx = e.clientX - startX;
              if (startWidth + dx >= 400) {
                  wrap.style.width = (startWidth + dx) + 'px';
                  wrap.style.maxWidth = 'none';
              }
          }
      });
      
      document.addEventListener('mouseup', () => {
          if (isLeftDragging || isRightDragging) KLionHangar.saveLayout(); 
          isLeftDragging = false; isRightDragging = false; document.body.style.cursor = 'default';
      });

      bindUIEvents();
      
      KLionHangar.enableHoverPreview = false;
      KLionHangar.loadLayout(); 

      const btn = document.getElementById('sc-load-all-btn');
      if (KLionHangar.currentPage > 1) {
          if (btn) {
              btn.textContent = t('page_warning');
              btn.title = t('page_warning');
              btn.disabled = true;
          }
      }

      const renderData = () => {
          KLionHangar.updateYearOptions(); 
          KLionHangar.updateEventOptions(); 
          KLionHangar.applyFilters();
          KLionHangar.loadShipData().then(() => KLionHangar.applyFilters());
          KLionHangar.loadStoreCredits().then(() => KLionHangar.applyFilters());
      };

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get([KLionHangar.CACHE_KEY], (res) => {
              let cacheUsed = false;
              let needsAutoLoad = false;
              
              const currentPageItems = KLionHangar.extractFromDOM(document, KLionHangar.currentPage);
              
              if (res[KLionHangar.CACHE_KEY] && res[KLionHangar.CACHE_KEY].items && res[KLionHangar.CACHE_KEY].items.length > 0) {
                  const cachedData = res[KLionHangar.CACHE_KEY].items;
                  if (cachedData[0] && cachedData[0].flags !== undefined && cachedData[0].price !== undefined) {
                      
                      if (KLionHangar.currentPage === 1) {
                          const cachedPage1 = cachedData.filter(i => i.pageNum === 1);
                          const checkCount = Math.min(currentPageItems.length, cachedPage1.length, 3);
                          
                          if (checkCount > 0) {
                              const currentIds = currentPageItems.slice(0, checkCount).map(i => i.pledgeId);
                              const cachedIds = cachedPage1.slice(0, checkCount).map(i => i.pledgeId);
                              
                              if (currentIds.every(id => id) && cachedIds.every(id => id)) {
                                  const isDifferent = currentIds.some((id, index) => id !== cachedIds[index]);
                                  if (isDifferent) needsAutoLoad = true;
                              }
                          }
                      }
                      
                      KLionHangar.globalItems = cachedData;
                      cacheUsed = true;
                      
                      if (btn && KLionHangar.currentPage === 1) {
                          if (needsAutoLoad) {
                              btn.innerHTML = `⏳ ${t('auto_updating')}`;
                              setTimeout(() => { btn.click(); }, 300);
                          } else {
                              btn.innerHTML = `✅ ${t('loaded_cache')} (${KLionHangar.globalItems.length})`;
                          }
                      }
                  }
              }
              
              if (!cacheUsed) {
                  KLionHangar.globalItems = currentPageItems;
              }
              
              renderData();
          });
      } else {
          KLionHangar.globalItems = KLionHangar.extractFromDOM(document, KLionHangar.currentPage);
          renderData();
      }
  };

  const tryInit = () => {
      if (document.querySelector('.item-image-wrapper') || (document.querySelector('#sc-grid-view-container') === null && document.querySelector('.list-items'))) {
          init();
          return true;
      }
      return false;
  };

  if (!tryInit()) {
      const observer = new MutationObserver((mutations, obs) => {
          if (tryInit()) {
              obs.disconnect();
          }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 10000);
  }

})();