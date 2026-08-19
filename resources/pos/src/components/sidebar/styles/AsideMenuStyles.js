export const asideStyles = `
  .aside-menu-container {
    --sidebar-primary: #155eef;
    --sidebar-primary-soft: #eef4ff;
    --sidebar-primary-hover: #e4edff;
    --sidebar-text: #344054;
    --sidebar-muted: #7b8496;
    --sidebar-border: #e7ebf1;
    --sidebar-surface: #ffffff;
    --sidebar-hover: #f6f8fb;
    --sidebar-width: 265px;
    --sidebar-collapsed-width: 80px;
    width: var(--sidebar-width) !important;
    min-width: var(--sidebar-width) !important;
    color: var(--sidebar-text);
    font-family: inherit;
  }

  .aside-menu-container.collapsed {
    width: var(--sidebar-collapsed-width) !important;
    min-width: var(--sidebar-collapsed-width) !important;
  }

  .aside-menu-container > .pro-sidebar-inner {
    overflow: hidden;
    border-right: 1px solid var(--sidebar-border);
    background: var(--sidebar-surface) !important;
    box-shadow: 8px 0 32px rgba(23, 32, 51, .045);
  }

  .aside-menu-container > .pro-sidebar-inner > .pro-sidebar-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    background: var(--sidebar-surface);
  }

  .aside-menu-container .aside-menu-container__aside-logo {
    display: flex;
    flex: 0 0 76px;
    align-items: center;
    justify-content: space-between;
    min-height: 76px;
    height: 76px;
    padding: 14px 16px 14px 18px !important;
    border-bottom: 1px solid var(--sidebar-border) !important;
    background: var(--sidebar-surface);
  }

  .aside-menu-container .sidebar-logo {
    display: flex !important;
    align-items: center;
    min-width: 0;
    gap: 10px;
    overflow: hidden;
    color: #172033 !important;
    font-size: 16px;
    font-weight: 750;
    letter-spacing: -.02em;
    white-space: nowrap;
  }

  .aside-menu-container .sidebar-brand-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    overflow: hidden;
    border-radius: 11px;
    background: #f3f6fb;
  }

  .aside-menu-container .sidebar-brand-mark img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .aside-menu-container .sidebar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    border: 1px solid var(--sidebar-border) !important;
    border-radius: 9px !important;
    background: #fff !important;
    color: #697386 !important;
    font-size: 12px;
    transition: border-color .18s ease, background-color .18s ease, color .18s ease;
  }

  .aside-menu-container .sidebar-btn:hover,
  .aside-menu-container .sidebar-btn:focus-visible {
    border-color: #c9d9fa !important;
    background: var(--sidebar-primary-soft) !important;
    color: var(--sidebar-primary) !important;
  }

  .aside-menu-container .sidebar-scrolling {
    display: block;
    flex: 0 0 auto !important;
    min-height: 0 !important;
    height: calc(100vh - 76px) !important;
    height: calc(100dvh - 76px) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    background: var(--sidebar-surface);
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }

  .aside-menu-container .aside-menu-container__aside-search {
    position: sticky !important;
    top: 0;
    z-index: 5;
    margin: 0 !important;
    padding: 14px 14px 10px !important;
    background: var(--sidebar-surface);
  }

  .aside-menu-container .aside-menu-container__aside-search .form-control {
    height: 40px;
    padding: 8px 38px 8px 36px !important;
    border: 1px solid transparent !important;
    border-radius: 10px !important;
    background: #f4f6f9 !important;
    color: var(--sidebar-text) !important;
    font-family: inherit;
    font-size: 12px;
    box-shadow: none !important;
    transition: border-color .18s ease, background-color .18s ease, box-shadow .18s ease;
  }

  .aside-menu-container .aside-menu-container__aside-search .form-control:focus {
    border-color: #9cb9f6 !important;
    background: #fff !important;
    box-shadow: 0 0 0 3px rgba(21, 94, 239, .09) !important;
  }

  .aside-menu-container .aside-menu-container__aside-search .form-control::placeholder {
    color: #98a2b3;
  }

  .aside-menu-container .aside-menu-container__aside-search span {
    color: #8b95a7 !important;
    font-size: 12px;
    pointer-events: none;
  }

  .aside-menu-container .sidebar-search-clear {
    position: absolute;
    top: 50%;
    right: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    padding: 0;
    transform: translateY(-50%);
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #8b95a7;
    font-size: 11px;
  }

  .aside-menu-container .sidebar-search-clear:hover,
  .aside-menu-container .sidebar-search-clear:focus-visible {
    background: #e9edf3;
    color: #4d596d;
  }

  .aside-menu-container .sidebar-scrolling > .pro-menu {
    display: block;
    min-height: auto !important;
    height: auto;
    max-height: none;
    padding: 2px 10px 18px !important;
    overflow: visible !important;
  }

  .aside-menu-container .sidebar-scrolling::-webkit-scrollbar {
    width: 5px;
  }

  .aside-menu-container .sidebar-scrolling::-webkit-scrollbar-track {
    background: transparent;
  }

  .aside-menu-container .sidebar-scrolling::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #d4dae4;
  }

  .aside-menu-container .sidebar-scrolling::-webkit-scrollbar-thumb:hover {
    background: #aeb7c5;
  }

  .aside-menu-container .aside-group-header {
    padding: 18px 10px 7px !important;
    color: #98a2b3 !important;
    font-size: 9px !important;
    font-weight: 800 !important;
    letter-spacing: .12em !important;
    line-height: 1;
    text-transform: uppercase;
  }

  .aside-menu-container .aside-group-header:first-child {
    padding-top: 10px !important;
  }

  .aside-menu-container .pro-menu-item {
    margin: 2px 0;
    border-radius: 10px;
  }

  .aside-menu-container .pro-menu-item > .pro-inner-item {
    min-height: 42px;
    padding: 7px 10px !important;
    overflow: hidden;
    border: 0 !important;
    border-radius: 10px !important;
    background: transparent !important;
    color: var(--sidebar-muted) !important;
    font-size: 12.5px !important;
    font-weight: 550;
    transition: background-color .16s ease, color .16s ease, box-shadow .16s ease;
  }

  .aside-menu-container .pro-menu-item > .pro-inner-item:hover {
    background: var(--sidebar-hover) !important;
    color: var(--sidebar-text) !important;
  }

  .aside-menu-container .pro-menu-item > .pro-inner-item:focus-visible {
    outline: 2px solid rgba(21, 94, 239, .32);
    outline-offset: -2px;
  }

  .aside-menu-container .pro-menu-item .pro-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px !important;
    min-width: 30px !important;
    height: 30px !important;
    margin-right: 8px !important;
    margin-left: 0 !important;
    border-radius: 8px !important;
    background: transparent !important;
  }

  .aside-menu-container .pro-menu-item .pro-icon,
  .aside-menu-container .pro-menu-item .pro-icon svg {
    color: #8792a5 !important;
    font-size: 13px !important;
    animation: none !important;
  }

  .aside-menu-container .pro-menu-item .pro-item-content,
  .aside-menu-container .pro-menu-item .pro-item-content a {
    overflow: hidden;
    color: inherit !important;
    font: inherit;
    text-decoration: none !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .aside-menu-container .pro-menu-item.active > .pro-inner-item,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item {
    background: var(--sidebar-primary-soft) !important;
    color: var(--sidebar-primary) !important;
    box-shadow: inset 3px 0 0 var(--sidebar-primary);
  }

  .aside-menu-container .pro-menu-item.active > .pro-inner-item .pro-icon,
  .aside-menu-container .pro-menu-item.active > .pro-inner-item .pro-icon svg,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item .pro-icon,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item .pro-icon svg {
    color: var(--sidebar-primary) !important;
  }

  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item > .pro-item-content,
  .aside-menu-container .pro-sub-menu.pro-active-sub.open > .pro-inner-item > .pro-item-content,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item:hover > .pro-item-content,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item:focus > .pro-item-content {
    color: var(--sidebar-primary) !important;
    -webkit-text-fill-color: var(--sidebar-primary) !important;
    opacity: 1 !important;
  }

  .aside-menu-container .pro-menu-item.active > .pro-inner-item:hover,
  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item:hover {
    background: var(--sidebar-primary-hover) !important;
  }

  .aside-menu-container .pro-sub-menu > .pro-inner-item .pro-arrow-wrapper {
    right: 12px !important;
  }

  .aside-menu-container .pro-sub-menu > .pro-inner-item .pro-arrow {
    width: 6px;
    height: 6px;
    border-color: #98a2b3 !important;
    border-width: 0 1.5px 1.5px 0 !important;
    transition: transform .18s ease;
  }

  .aside-menu-container .pro-sub-menu.pro-active-sub > .pro-inner-item .pro-arrow {
    border-color: var(--sidebar-primary) !important;
  }

  .aside-menu-container .pro-sub-menu > .pro-inner-list-item,
  .aside-menu-container .pro-sub-menu > .pro-inner-list-item > div,
  .aside-menu-container .pro-sub-menu > .pro-inner-list-item > div > ul,
  .aside-menu-container .react-slidedown {
    background: transparent !important;
  }

  .aside-menu-container .pro-sub-menu > .pro-inner-list-item > div > ul {
    position: relative;
    margin: 3px 0 7px;
    padding: 2px 0 2px 37px !important;
  }

  .aside-menu-container .pro-sub-menu > .pro-inner-list-item > div > ul::before {
    content: '';
    position: absolute;
    top: 4px;
    bottom: 5px;
    left: 24px;
    width: 1px;
    border-radius: 999px;
    background: #e1e6ee;
  }

  .aside-menu-container .pro-sub-menu .pro-menu-item {
    margin: 1px 0;
  }

  .aside-menu-container .pro-sub-menu .pro-menu-item > .pro-inner-item {
    min-height: 34px;
    padding: 6px 10px !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    font-size: 11.5px !important;
  }

  .aside-menu-container .pro-sub-menu .pro-menu-item .pro-icon-wrapper {
    display: none;
  }

  .aside-menu-container .pro-sub-menu .pro-menu-item.active > .pro-inner-item {
    background: #f1f5fb !important;
    color: var(--sidebar-primary) !important;
    box-shadow: none !important;
    font-weight: 650;
  }

  .aside-menu-container .pro-sub-menu .pro-menu-item > .pro-inner-item:hover {
    background: var(--sidebar-hover) !important;
    color: var(--sidebar-text) !important;
  }

  .aside-menu-container .text-center {
    margin: 12px 4px;
    padding: 18px 12px !important;
    border-radius: 10px;
    background: #f7f9fc;
    color: #8d97a8 !important;
    font-size: 12px !important;
  }

  .aside-menu-container.collapsed .aside-menu-container__aside-logo {
    justify-content: center;
    padding: 14px 10px !important;
  }

  .aside-menu-container.collapsed .sidebar-logo,
  .aside-menu-container.collapsed .search-control,
  .aside-menu-container.collapsed .aside-group-header {
    display: none !important;
  }

  .aside-menu-container.collapsed .sidebar-scrolling > .pro-menu {
    padding: 10px 10px 18px !important;
  }

  .aside-menu-container.collapsed .pro-menu-item {
    margin: 4px 0;
  }

  .aside-menu-container.collapsed .pro-menu-item > .pro-inner-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    min-height: 44px;
    margin: 0 auto;
    padding: 7px !important;
    overflow: visible;
  }

  .aside-menu-container.collapsed .pro-menu-item .pro-icon-wrapper {
    margin: 0 !important;
  }

  .aside-menu-container.collapsed .pro-menu-item.active > .pro-inner-item,
  .aside-menu-container.collapsed .pro-sub-menu.pro-active-sub > .pro-inner-item {
    box-shadow: inset 0 -3px 0 var(--sidebar-primary);
  }

  .aside-menu-container.rtl > .pro-sidebar-inner {
    border-right: 0;
    border-left: 1px solid var(--sidebar-border);
  }

  .aside-menu-container.rtl .pro-menu-item .pro-icon-wrapper {
    margin-right: 0 !important;
    margin-left: 8px !important;
  }

  .aside-menu-container.rtl .pro-menu-item.active > .pro-inner-item,
  .aside-menu-container.rtl .pro-sub-menu.pro-active-sub > .pro-inner-item {
    box-shadow: inset -3px 0 0 var(--sidebar-primary);
  }

  .aside-menu-container.rtl .pro-sub-menu > .pro-inner-list-item > div > ul {
    padding-right: 37px !important;
    padding-left: 0 !important;
  }

  .aside-menu-container.rtl .pro-sub-menu > .pro-inner-list-item > div > ul::before {
    right: 24px;
    left: auto;
  }

  @media (max-width: 1199px) {
    .aside-menu-container {
      position: fixed !important;
      top: 0 !important;
      bottom: 0 !important;
      left: -100% !important;
      width: min(88vw, 280px) !important;
      min-width: min(88vw, 280px) !important;
      max-width: min(88vw, 280px) !important;
      height: 100vh !important;
      height: 100dvh !important;
      z-index: 1045 !important;
      box-shadow: 20px 0 60px rgba(15, 23, 42, .18);
      transition: left .24s ease, right .24s ease !important;
    }

    .aside-menu-container.open-menu {
      left: 0 !important;
    }

    .aside-menu-container.hide-menu {
      left: -100% !important;
    }

    .aside-menu-container.rtl {
      right: -100% !important;
      left: auto !important;
    }

    .aside-menu-container.rtl.open-menu {
      right: 0 !important;
      left: auto !important;
    }

    .aside-menu-container.rtl.hide-menu {
      right: -100% !important;
      left: auto !important;
    }

    .aside-menu-container > .pro-sidebar-inner {
      height: 100% !important;
    }

    .aside-menu-container .aside-menu-container__aside-logo {
      flex-basis: 70px;
      min-height: 70px;
      height: 70px;
    }

    .aside-menu-container .sidebar-scrolling {
      height: calc(100vh - 70px) !important;
      height: calc(100dvh - 70px) !important;
    }

    .aside-menu-container .sidebar-scrolling > .pro-menu {
      padding-bottom: 28px !important;
    }

    .aside-menu-container .pro-menu-item > .pro-inner-item {
      min-height: 46px;
    }

    .aside-menu-container .sidebar-mobile-close {
      display: inline-flex !important;
      font-size: 16px;
    }

    .bg-overlay.d-block {
      position: fixed !important;
      inset: 0 !important;
      z-index: 1040 !important;
      background: rgba(15, 23, 42, .42) !important;
      backdrop-filter: blur(2px);
      animation: sidebar-overlay-in .2s ease-out both;
    }
  }

  @media (max-width: 420px) {
    .aside-menu-container {
      width: min(92vw, 300px) !important;
      min-width: min(92vw, 300px) !important;
      max-width: min(92vw, 300px) !important;
    }
  }

  @keyframes sidebar-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .aside-menu-container *,
    .aside-menu-container *::before,
    .aside-menu-container *::after {
      scroll-behavior: auto !important;
      transition-duration: .01ms !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;
