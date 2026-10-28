// styles.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar.injectStyles = () => {
    if (document.getElementById('sc-klion-styles')) return;
    const style = document.createElement('style');
    style.id = 'sc-klion-styles';
    style.textContent = `
      :root {
        --sc-bg: rgba(13, 17, 23, 0.85);
        --sc-text: #c9d1d9;
        --sc-title: #58a6ff;
        --sc-border: #30363d;
        --sc-card-bg: #161b22;
        --sc-card-hover: #1c2128;
        --sc-input-bg: #161b22;
        --sc-input-text: #c9d1d9;
        --sc-btn-bg: #21262d;
        --sc-modal-bg: #0d1117;
        --sc-subitem-bg: #161b22;
        --sc-panel-bg: #0d1117;
        --sc-panel-border: #005f88;
        --sc-panel-text: #00baff;
        --sc-panel-value: #00e0ff;
      }
      
      #sc-grid-view-container.sc-light-theme, #sc-hover-tooltip.sc-light-theme, #sc-settings-content.sc-light-theme {
        --sc-bg: #ffffff; --sc-text: #24292f; --sc-title: #0969da; --sc-border: #d0d7de;
        --sc-card-bg: #f6f8fa; --sc-card-hover: #eaeef2; --sc-input-bg: #ffffff;
        --sc-input-text: #24292f; --sc-btn-bg: #eaeef2; --sc-subitem-bg: #f6f8fa;
        --sc-panel-bg: #f6f8fa; --sc-panel-border: #0969da; --sc-panel-text: #0969da; --sc-panel-value: #0550ae;
        --sc-modal-bg: #ffffff;
      }
      
      #sc-grid-view-container { 
          padding: 12px; 
          background: var(--sc-bg); 
          border: 1px solid var(--sc-border); 
          border-radius: 8px; 
          width: 100%; 
          max-width: 100%; 
          position: absolute; 
          top: 0;
          left: 0;
          z-index: 10;
          box-sizing: border-box; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
          transition: background 0.2s; 
      }
      
      #sc-grid-view-container .sc-resize-handle { 
          position: absolute; 
          top: 0; 
          bottom: 0; 
          width: 16px; 
          cursor: ew-resize; 
          z-index: 10; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: all 0.2s; 
          color: var(--sc-title); 
          background-color: rgba(88, 166, 255, 0.05); 
          opacity: 0.4;
      }
      #sc-grid-view-container .sc-resize-handle:hover { background-color: rgba(88, 166, 255, 0.2); color: #58a6ff; opacity: 1; }
      #sc-grid-view-container .sc-resize-left { left: -8px; border-radius: 4px 0 0 4px; }
      #sc-grid-view-container .sc-resize-right { right: -8px; border-radius: 0 4px 4px 0; }
      #sc-grid-view-container .sc-resize-left::after { content: '◀'; font-size: 10px; }
      #sc-grid-view-container .sc-resize-right::after { content: '▶'; font-size: 10px; }

      #sc-grid-view-container #sc-grid-toolbar { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; color: var(--sc-text); }
      #sc-grid-view-container .sc-toolbar-left { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; flex: 1; min-width: 60%; }
      #sc-grid-view-container .sc-toolbar-right { display: flex; gap: 6px; flex-wrap: nowrap; align-items: center; justify-content: flex-end; flex-shrink: 0; }

      #sc-grid-view-container .sc-btn { background: #238636; color: #fff; border: none; padding: 0 10px; height: 26px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; justify-content: center; box-sizing: border-box;}
      #sc-grid-view-container .sc-btn:hover { background: #2ea043; }
      #sc-grid-view-container .sc-btn:disabled { background: #8b949e; cursor: not-allowed; }

      #sc-grid-view-container .sc-icon-btn { 
          background: var(--sc-btn-bg); 
          color: var(--sc-text); 
          border: 1px solid var(--sc-border); 
          width: 26px; 
          height: 26px; 
          border-radius: 4px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: 0.2s; 
      }
      #sc-grid-view-container .sc-icon-btn:hover { border-color: #58a6ff; color: #58a6ff; }
      #sc-grid-view-container .sc-icon-btn svg { width: 16px; height: 16px; }
      
      #sc-grid-view-container .sc-view-btn {
          background: var(--sc-btn-bg); 
          color: var(--sc-text); 
          border: 1px solid var(--sc-border); 
          height: 26px; 
          border-radius: 4px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: 0.2s; 
          padding: 0 8px; 
          font-size: 12px; 
          font-weight: bold;
          gap: 4px;
      }
      #sc-grid-view-container .sc-view-btn:hover { border-color: #58a6ff; color: #58a6ff; }

      #sc-grid-view-container .sc-select { background: var(--sc-input-bg); color: var(--sc-input-text); border: 1px solid var(--sc-border); padding: 0 6px; height: 26px; border-radius: 4px; outline: none; cursor: pointer; font-size: 12px; transition: border-color 0.2s; box-sizing: border-box; max-width: 140px;}
      #sc-grid-view-container .sc-select:hover { border-color: #58a6ff; }
      #sc-grid-view-container #sc-grid-search { background: var(--sc-input-bg); color: var(--sc-input-text); border: 1px solid var(--sc-border); padding: 0 8px; height: 26px; border-radius: 4px; outline: none; font-size: 12px; width: 150px; box-sizing: border-box;}
      #sc-grid-view-container #sc-grid-search:focus { border-color: #58a6ff; }

      #sc-grid-view-container .sc-toggle-btn {
          background: var(--sc-input-bg); color: var(--sc-text); border: 1px solid var(--sc-border);
          padding: 0 8px; height: 26px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;
          transition: all 0.2s; white-space: nowrap; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
      }
      #sc-grid-view-container .sc-toggle-btn:hover { border-color: #58a6ff; }
      #sc-grid-view-container .sc-toggle-btn.active { background: #1f6feb; color: #fff; border-color: #1f6feb; }

      #sc-grid-view-container .sc-price-range { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--sc-text); }
      /* 🚀 修复输入框高度和宽度，防止文字被裁切 */
      #sc-grid-view-container .sc-price-input { width: 64px; height: 26px; line-height: 24px; padding: 0 6px; border-radius: 4px; border: 1px solid var(--sc-border); background: var(--sc-input-bg); color: var(--sc-input-text); font-size: 12px; outline: none; box-sizing: border-box; }
      #sc-grid-view-container .sc-price-input:focus { border-color: #58a6ff; }
      #sc-grid-view-container .sc-price-input::placeholder { color: #8b949e; font-size: 12px; }

      #sc-grid-view-container #sc-stats-panel { background: var(--sc-panel-bg); border: 1px solid var(--sc-panel-border); border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; box-shadow: inset 0 0 10px rgba(0, 186, 255, 0.1); }
      #sc-grid-view-container .sc-stat-item { display: flex; align-items: baseline; gap: 3px; }
      #sc-grid-view-container .sc-stat-val { color: var(--sc-panel-value); font-size: 15px; font-weight: bold; line-height: 1; }
      #sc-grid-view-container .sc-stat-label { color: var(--sc-panel-text); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }

      #sc-grid-view-container #sc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
      #sc-grid-view-container .sc-grid-cell { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: var(--sc-text); background: var(--sc-card-bg); border: 1px solid var(--sc-border); border-radius: 6px; padding: 8px; transition: all .2s; overflow: hidden; cursor: pointer; position: relative; }
      #sc-grid-view-container .sc-grid-cell:hover { background: var(--sc-card-hover); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      #sc-grid-view-container .sc-grid-thumb { width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px; background: var(--sc-bg); background-size: cover; background-position: center; }
      #sc-grid-view-container .sc-grid-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      #sc-grid-view-container .sc-card-badges { position: absolute; top: 4px; right: 4px; display: flex; gap: 4px; z-index: 2; }
      #sc-grid-view-container .sc-badge { background: rgba(0,0,0,0.8); border-radius: 4px; padding: 2px 4px; font-size: 11px; border: 1px solid var(--sc-border); color: #fff; }
      #sc-grid-view-container .sc-price-tag { position: absolute; bottom: 34px; right: 4px; background: rgba(0,0,0,0.7); color: #3fb950; font-size: 11px; padding: 2px 4px; border-radius: 4px; font-weight: bold; font-family: monospace; border: 1px solid rgba(63, 185, 80, 0.3); }
      #sc-grid-view-container .sc-grid-label { margin-top: 8px; width: 100%; font-size: 12px; line-height: 1.3; text-align: center; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 500; }
      
      #sc-grid-view-container #sc-grid.sc-list-view {
          display: flex;
          flex-direction: column;
          background: var(--sc-card-bg);
          border: 1px solid var(--sc-border);
          border-radius: 6px;
          overflow-x: auto; 
      }
      .sc-list-header {
          display: flex;
          align-items: stretch;
          background: var(--sc-input-bg);
          font-weight: bold;
          font-size: 12px;
          color: var(--sc-panel-text);
          position: sticky;
          top: 0;
          z-index: 2;
          min-width: max-content; 
      }
      .sc-list-row {
          display: flex;
          align-items: stretch;
          font-size: 12px;
          color: var(--sc-text);
          cursor: pointer;
          transition: background 0.15s;
          min-width: max-content;
          border-bottom: 1px solid var(--sc-border);
      }
      .sc-list-row:last-child { border-bottom: none; }
      .sc-list-row:nth-child(even) { background: rgba(128,128,128,0.03); }
      .sc-list-row:hover { background: var(--sc-card-hover); }
      
      .sc-th, .sc-td {
          box-sizing: border-box;
          padding: 8px 10px;
          border-right: 1px solid var(--sc-border);
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
      }
      .sc-th-link, .sc-td-link { border-right: none; justify-content: center; }
      .sc-th-img, .sc-td-img { width: 50px; justify-content: center; padding: 4px; flex-shrink: 0; }
      .sc-th-name, .sc-td-name { font-weight: bold; white-space: nowrap; text-overflow: ellipsis; }
      .sc-td-tags { display: flex; align-items: center; gap: 4px; }
      .sc-th-category, .sc-td-category { opacity: 0.8; }
      .sc-th-date, .sc-td-date { opacity: 0.8; font-family: monospace; }
      .sc-th-price, .sc-td-price { justify-content: flex-end; color: #3fb950; font-weight: bold; font-family: monospace; }

      .sc-list-link-btn {
          text-decoration: none;
          background: rgba(88, 166, 255, 0.1);
          color: #58a6ff;
          border: 1px solid rgba(88, 166, 255, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      .sc-list-link-btn:hover {
          background: #58a6ff;
          color: #fff;
      }
      
      .sc-list-resizer {
          position: absolute;
          right: -4px;
          top: 0;
          bottom: 0;
          width: 8px;
          cursor: col-resize;
          z-index: 10;
      }
      .sc-list-resizer:hover, .sc-list-resizer:active {
          background: rgba(88, 166, 255, 0.3);
      }
      
      #sc-modal-overlay, #sc-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 10000; display: none; align-items: center; justify-content: center; }
      #sc-modal-content, #sc-settings-content { background: var(--sc-modal-bg); border: 1px solid var(--sc-border); border-radius: 8px; width: 600px; max-width: 90%; max-height: 85%; overflow-y: auto; padding: 25px; color: var(--sc-text); position: relative; }
      #sc-modal-close, #sc-settings-close { position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 28px; opacity: 0.6; }
      .sc-modal-title { font-size: 22px; color: var(--sc-title); margin-bottom: 20px; border-bottom: 1px solid var(--sc-border); padding-bottom: 15px; }
      .sc-subitems { list-style: none; padding: 0; margin: 15px 0 0 0; }
      .sc-subitems li { display: flex; align-items: center; padding: 10px; background: var(--sc-subitem-bg); border: 1px solid var(--sc-border); margin-bottom: 10px; border-radius: 6px; }
      .sub-img { width: 70px; height: 70px; background-size: contain; background-repeat: no-repeat; background-position: center; margin-right: 20px; border-radius: 4px; background-color: var(--sc-bg); }

      .sc-settings-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--sc-border); }
      .sc-settings-row:last-child { border-bottom: none; }
      .sc-settings-label { font-weight: bold; font-size: 14px; }
      .sc-settings-controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      
      .sc-switch-group { display: flex; border: 1px solid var(--sc-border); border-radius: 4px; overflow: hidden; background: var(--sc-input-bg); }
      .sc-switch-btn { background: transparent; color: var(--sc-text); border: none; padding: 6px 16px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.2s; outline: none; display: flex; align-items: center; justify-content: center; }
      .sc-switch-btn:not(:last-child) { border-right: 1px solid var(--sc-border); }
      .sc-switch-btn:hover { background: var(--sc-card-hover); }
      .sc-switch-btn.active { background: #1f6feb; color: #fff; }
      
      #sc-back-to-top {
          position: fixed; bottom: 30px; right: 30px; width: 45px; height: 45px;
          background: var(--sc-bg); border: 1px solid var(--sc-border); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: var(--sc-text);
          font-size: 20px; cursor: pointer; z-index: 9999; opacity: 0; visibility: hidden;
          transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(4px);
      }
      #sc-back-to-top.show { opacity: 1; visibility: visible; }
      #sc-back-to-top:hover { border-color: #58a6ff; color: #58a6ff; }

      #sc-hover-tooltip {
          position: fixed; z-index: 100000; display: none;
          background: var(--sc-modal-bg); border: 1px solid var(--sc-border);
          border-radius: 6px; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          max-width: 300px; pointer-events: none; color: var(--sc-text);
      }
      #sc-hover-tooltip .sc-subitems { margin: 0; }
      #sc-hover-tooltip .sc-subitems li { padding: 5px; margin-bottom: 5px; border: none; background: transparent; }
      #sc-hover-tooltip .sub-img { width: 40px; height: 40px; margin-right: 10px; }
      #sc-hover-tooltip .sub-name { font-size: 12px; color: var(--sc-text); }
      
      #sc-hover-tooltip .sc-hover-header {
          padding: 0 5px 8px 5px; 
          margin-bottom: 8px; 
          border-bottom: 1px solid var(--sc-border); 
          font-size: 12px; 
          color: var(--sc-text); 
          display: flex; 
          flex-direction: column; 
          gap: 6px;
      }
      #sc-hover-tooltip .sc-hover-header .sc-hover-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }

      .sc-ui-collapsed #sc-stats-panel,
      .sc-ui-collapsed #sc-grid { display: none !important; }
    `;
    document.head.appendChild(style);
};