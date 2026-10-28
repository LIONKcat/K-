// config.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar = {
    CACHE_KEY: 'sc_hangar_auto_cache_v3',
    LAYOUT_KEY: 'sc_hangar_layout_config',
    COL_WIDTH_KEY: 'sc_hangar_col_widths',
    
    globalItems: [],
    isCollapsed: false,
    isLightTheme: false,
    isInitDone: false,
    viewMode: 'grid', 
    
    // 🚀 新增 img 列宽度
    columnWidths: {
        img: 50, name: 300, tags: 100, category: 100, date: 110, price: 80, link: 60 
    },
    
    lang: localStorage.getItem('sc_lang') || 'zh',
    i18n: {
        zh: {
            search: "搜索物品...",
            category: "📦 所有分类",
            category_standalone: "🚀 独立舰船",
            category_package: "🎁 组合包",
            category_upgrade: "⬆️ 升级包 (CCU)",
            category_paint: "🎨 涂装",
            category_fps: "🔫 FPS装备",
            year: "📅 所有年份",
            event: "🎉 所有活动",
            event_iae: "🚀 IAE 展",
            event_invictus: "⚔️ 不可征服周",
            event_bis: "🏆 舰船对决",
            event_luminalia: "🌲 圣诞活动",
            event_redfestival: "🧧 火红节",
            event_foundation: "💊 基金会节",
            event_vara: "🎃 瓦拉节",
            event_pirate: "🏴‍☠️ 海盗周",
            event_alien: "👽 外星周",
            event_citizencon: "🎪 公民大会",
            event_resource: "🏭 资源驱动",
            event_alliance: "🤝 联盟援助",
            event_fortuna: "🌟 幸运星节",
            event_overdrive: "⚡ 超载活动",
            event_hunt: "🎯 猎杀北极星",
            event_referral: "🎁 邀请奖励",
            event_other: "📦 其它 / 日常",
            sort_default: "默认排序",
            sort_price_asc: "价格升序",
            sort_price_desc: "价格降序",
            min_price: "最低价",
            max_price: "最高价",
            lti: "LTI",
            giftable: "可赠送",
            meltable: "可融换",
            load_btn: "一键核账",
            collapse: "收起面板",
            expand: "展开面板",
            settings: "设置",
            total_items: "总条目",
            upgrades: "升级包",
            ships: "舰船",
            packages: "组合包",
            value_usd: "机库价值 (USD)",
            credits_usd: "可用信用点 (USD)",
            export_csv: "导出 CSV",
            export_json: "导出 JSON",
            snapshot: "📸 机库长截图",
            language: "语言 / Language",
            card_size: "物品卡片大小",
            theme: "主题",
            theme_dark: "🌙 暗色",
            theme_light: "☀️ 亮色",
            hover_preview: "鼠标悬浮预览",
            on: "开启",
            off: "关闭",
            reset_layout: "恢复默认排版",
            clear_cache: "🗑️ 清除本地缓存",
            cache_cleared: "缓存已清除，页面即将刷新...",
            close: "关闭",
            loading: "数据加载中...",
            about_title: "关于",
            about_content: "大家好，我是LIONK，一位2013年入坑的星际难民。<br><br>欢迎大家使用我和AI一起制作的这个软件，希望能让你的机库管理更加轻松！",
            about_btn: "感谢使用",
            page_warning: "⚠️ 需返回第1页",
            loaded_cache: "已加载",
            loading_data: "获取数据...",
            reading_page: "读取中...",
            auto_updating: "检测到更新，加载中...",
            done: "完成",
            view_grid: "网格模式",
            view_list: "列表模式",
            col_name: "物品名称",
            col_tags: "属性",
            col_category: "分类",
            col_date: "购买日期",
            col_price: "价格 (USD)",
            col_link: "前往",
            
            settings_hint: "页面宽度调整",
            settings_hint_desc: "可以左右拉动面板边缘调整宽度",
            i_know: "我知道了",
            
            modal_location: "📍 所在位置",
            modal_pledge_id: "🆔 认捐ID",
            modal_date: "📅 购买日期",
            modal_price: "💰 价格",
            modal_tags: "⚙️ 属性",
            modal_contents: "📦 包含内容",
            modal_unknown: "未知",
            modal_no_subs: "(无子物品)",
            modal_free: "免费",
            go_to_page: "前往所在分页 ↗",
            page_idx: "第 {page} 页，第 {index} 项"
        },
        en: {
            search: "Search items...",
            category: "📦 All Categories",
            category_standalone: "🚀 Standalone Ships",
            category_package: "🎁 Packages",
            category_upgrade: "⬆️ Upgrades (CCU)",
            category_paint: "🎨 Paints",
            category_fps: "🔫 FPS Gear",
            year: "📅 All Years",
            event: "🎉 All Events",
            event_iae: "🚀 IAE",
            event_invictus: "⚔️ Invictus",
            event_bis: "🏆 Best in Show",
            event_luminalia: "🌲 Luminalia",
            event_redfestival: "🧧 Red Festival",
            event_foundation: "💊 Foundation Fest",
            event_vara: "🎃 Day of the Vara",
            event_pirate: "🏴‍☠️ Pirate Week",
            event_alien: "👽 Alien Week",
            event_citizencon: "🎪 CitizenCon",
            event_resource: "🏭 Resource Drive",
            event_alliance: "🤝 Alliance Aid",
            event_fortuna: "🌟 Stella Fortuna",
            event_overdrive: "⚡ Overdrive",
            event_hunt: "🎯 Hunt the Polaris",
            event_referral: "🎁 Referral",
            event_other: "📦 Other / Daily",
            sort_default: "Default",
            sort_price_asc: "Price: Low to High",
            sort_price_desc: "Price: High to Low",
            min_price: "Min $",
            max_price: "Max $",
            lti: "LTI",
            giftable: "Giftable",
            meltable: "Meltable",
            load_btn: "Load All",
            collapse: "Collapse",
            expand: "Expand",
            settings: "Settings",
            total_items: "Total",
            upgrades: "Upgrades",
            ships: "Ships",
            packages: "Packages",
            value_usd: "Value (USD)",
            credits_usd: "Credits (USD)",
            export_csv: "Export CSV",
            export_json: "Export JSON",
            snapshot: "📸 Snapshot",
            language: "Language",
            card_size: "Card Size",
            theme: "Theme",
            theme_dark: "🌙 Dark",
            theme_light: "☀️ Light",
            hover_preview: "Hover Preview",
            on: "ON",
            off: "OFF",
            reset_layout: "Reset Layout",
            clear_cache: "🗑️ Clear Cache",
            cache_cleared: "Cache cleared, refreshing page...",
            close: "Close",
            loading: "Loading...",
            about_title: "About",
            about_content: "Hi, I'm LIONK, a Star Citizen since 2013.<br><br>Welcome to use this tool made by me and AI. Hope it makes your hangar management easier!",
            about_btn: "Close",
            page_warning: "⚠️ Go to Page 1",
            loaded_cache: "Loaded",
            loading_data: "Loading data...",
            reading_page: "Reading...",
            auto_updating: "Update detected, loading...",
            done: "Done",
            view_grid: "Grid Mode",
            view_list: "List Mode",
            col_name: "Item Name",
            col_tags: "Tags",
            col_category: "Category",
            col_date: "Date",
            col_price: "Price (USD)",
            col_link: "Link",
            
            settings_hint: "Resize Panel",
            settings_hint_desc: "Drag the edges to adjust the width",
            i_know: "I Know",
            
            modal_location: "📍 Location",
            modal_pledge_id: "🆔 Pledge ID",
            modal_date: "📅 Date",
            modal_price: "💰 Price",
            modal_tags: "⚙️ Tags",
            modal_contents: "📦 Contents",
            modal_unknown: "Unknown",
            modal_no_subs: "(No sub-items)",
            modal_free: "Free",
            go_to_page: "Go to Page ↗",
            page_idx: "Page {page}, Index {index}"
        }
    },
    
    filters: {
        keyword: '', year: 'all', event: 'all', type: 'all', lti: false, giftable: false, meltable: false, upgraded: false
    },
    
    stats: {
        totalUsd: 0, totalCredits: 0, storeCredits: 0, totalMsrpDiff: 0, ccuCount: 0, shipCount: 0, packageCount: 0
    },
    
    shipMatrix: {},
    shipMsrp: {},
    itemFingerprints: new Set(),

    formatTime: (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
    
    formatDate: (dateStr) => {
        if (!dateStr || dateStr === '未知' || dateStr === 'Unknown') return KLionHangar.t('modal_unknown');
        
        let d = new Date(dateStr);
        if (isNaN(d.getTime())) {
            const zhMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            if (zhMatch) {
                d = new Date(parseInt(zhMatch[1]), parseInt(zhMatch[2]) - 1, parseInt(zhMatch[3]));
            }
        }
        
        if (isNaN(d.getTime())) return dateStr; 

        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        
        if (KLionHangar.lang === 'zh') {
            return `${year}年${month + 1}月${day}日`;
        } else {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return `${monthNames[month]} ${day}, ${year}`;
        }
    }
};

KLionHangar.t = (key) => (KLionHangar.i18n[KLionHangar.lang] && KLionHangar.i18n[KLionHangar.lang][key]) || key;