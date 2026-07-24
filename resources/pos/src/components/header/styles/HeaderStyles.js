/* ── Estilos ── */
export const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap');

  /* ── Navbar ── */
  .hdr-navbar {
    background: #ffffff !important;
    border-bottom: 1px solid #f0f0f8 !important;
    box-shadow: 0 2px 16px rgba(47, 111, 237,0.07) !important;
    padding: 0 24px !important;
    min-height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Botón POS ── */
  .hdr-pos-btn {
    font-family: 'Nunito', sans-serif;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #2F6FED !important;
    background: #f0f0ff !important;
    border: none;
    border-radius: 10px;
    padding: 8px 18px !important;
    text-decoration: none !important;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.18s, transform 0.15s, box-shadow 0.15s;
    box-shadow: none;
    cursor: pointer;
  }
  .hdr-pos-btn:hover {
    background: linear-gradient(135deg, #2F6FED, #2F6FED) !important;
    color: white !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(47, 111, 237,0.3);
  }

  /* ── Botón ícono (fullscreen) ── */
  .hdr-icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #f8f7ff;
    border: 1.5px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.18s, border-color 0.18s, transform 0.15s;
    color: #9ca3af;
    margin: 0 6px;
  }
  .hdr-icon-btn:hover {
    background: #E2E8F0;
    border-color: #94A3B8;
    color: #2F6FED;
    transform: scale(1.05);
  }

  /* ── Trigger del usuario ── */
  .hdr-user-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px 6px 6px;
    border-radius: 50px;
    background: #eaf1ff;
    border: 1.5px solid #E2E8F0;
    cursor: pointer;
    transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
    margin-left: 8px;
  }
  .hdr-user-trigger:hover {
    background: #2F6FED;
    border-color: #94A3B8;
        color: white !important;
    box-shadow: 0 4px 14px rgba(47, 111, 237,0.12);
  }

  .hdr-avatar-img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #E2E8F0;
  }

  .hdr-avatar-initials {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2F6FED, #2F6FED);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
  }

  .hdr-user-name {
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 500;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hdr-chevron {
    color: #94A3B8 !important;
    font-size: 11px;
    transition: transform 0.2s;
  }

  /* ── Dropdown menu ── */
  .hdr-dropdown-menu {
    border: none !important;
    border-radius: 18px !important;
    box-shadow: 0 20px 60px rgba(47, 111, 237,0.15), 0 4px 16px rgba(0,0,0,0.06) !important;
    padding: 8px !important;
    min-width: 240px !important;
    margin-top: 10px !important;
    background: white !important;
    overflow: hidden;
    border: 1px solid #f0f0f8 !important;
  }

  /* Header del dropdown */
  .hdr-dropdown-header {
    padding: 16px 16px 20px;
    text-align: center;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 8px;
  }

  .hdr-dropdown-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 10px;
    display: block;
    border: 3px solid #f0f2ff;
  }

  .hdr-dropdown-initials {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2F6FED, #2F6FED);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito', sans-serif;
    font-size: 18px;
    font-weight: 800;
    margin: 0 auto 10px;
  }

  .hdr-dropdown-name {
    font-family: 'Nunito', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 2px;
  }

  .hdr-dropdown-email {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #9ca3af;
    font-weight: 400;
  }

  /* Items del dropdown */
  .hdr-dropdown-item {
    display: flex !important;
    align-items: center;
    gap: 12px;
    padding: 10px 14px !important;
    border-radius: 12px !important;
    font-family: 'Poppins', sans-serif !important;
    font-size: 13.5px !important;
    color: #6b7280 !important;
    font-weight: 500 !important;
    transition: background 0.15s, color 0.15s !important;
    margin-bottom: 2px;
    background: transparent !important;
  }
  .hdr-dropdown-item:hover {
    background: #F1F5F9 !important;
    color: #2F6FED !important;
  }
  .hdr-dropdown-item:hover .hdr-item-icon {
    background: #E2E8F0 !important;
    color: #2F6FED !important;
  }

  .hdr-item-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #9ca3af;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }

  /* Logout */
  .hdr-dropdown-item--logout { color: #ef4444 !important; }
  .hdr-dropdown-item--logout .hdr-item-icon { color: #ef4444; background: #fff5f5; }
  .hdr-dropdown-item--logout:hover {
    background: #fff5f5 !important;
    color: #ef4444 !important;
  }
  .hdr-dropdown-item--logout:hover .hdr-item-icon {
    background: #fee2e2 !important;
    color: #ef4444 !important;
  }

  .hdr-divider {
    height: 1px;
    background: #f3f4f6;
    margin: 6px 8px;
  }
`;
