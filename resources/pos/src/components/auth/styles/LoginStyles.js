export const loginStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

.lp-root {
  --lp-ink: #0B1220;
  --lp-ink-2: #141F38;
  --lp-paper: #FFFFFF;
  --lp-paper-2: #F6F8FB;
  --lp-line: #E4E8F0;
  --lp-line-dark: rgba(255,255,255,0.12);
  --lp-text: #10182B;
  --lp-muted: #64748B;
  --lp-muted-2: rgba(255,255,255,0.62);
  --lp-accent: #2F6FED;
  --lp-accent-ink: #1B3E9E;
  --lp-green: #12A876;
  --lp-green-soft: rgba(18,168,118,0.14);
  --lp-radius: 14px;
  --lp-font-display: 'Space Grotesk', 'Inter', sans-serif;
  --lp-font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --lp-font-mono: 'IBM Plex Mono', 'SFMono-Regular', monospace;

  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  background: var(--lp-paper-2);
  font-family: var(--lp-font-body);
  color: var(--lp-text);
}

.lp-root *, .lp-root *::before, .lp-root *::after { box-sizing: border-box; }

.lp-root a { text-decoration: none; }

/* ── Left / brand panel ───────────────────────────────── */
.lp-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 56px 60px;
  background:#2F6FED;
  overflow: hidden;
}

.lp-aside-top { display: flex; align-items: center; gap: 10px; }

.lp-aside-logo { height: 32px; width: auto; object-fit: contain; }

.lp-brand-name {
  font-family: var(--lp-font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.01em;
  color: #fff;
}

.lp-hero { margin-top: 40px; max-width: 460px; }

.lp-hero-eyebrow {
  font-family: var(--lp-font-mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--lp-muted-2);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.lp-hero-eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0fff85;
  box-shadow: 0 0 0 3px var(--lp-green-soft);
}

.lp-hero-title {
  font-family: var(--lp-font-display);
  font-weight: 600;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.14;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
  color: #fff;
}

.lp-hero-title span { color: #8FB0FF; }

.lp-hero-sub {
  font-size: 15px;
  line-height: 1.6;
  color: var(--lp-muted-2);
  margin: 0;
  max-width: 380px;
}

/* ── Electronic-invoice "seal" signature element ─────────── */
.lp-seal {
  margin-top: 36px;
  width: 300px;
  background: rgb(0 0 0 / 18%);
  border: 1px solid var(--lp-line-dark);
  border-radius: var(--lp-radius);
  padding: 18px 18px 16px;
  backdrop-filter: blur(6px);
  transform: rotate(-1.4deg);
  box-shadow: 0 20px 40px -20px rgba(0,0,0,0.55);
}

.lp-seal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px dashed var(--lp-line-dark);
}

.lp-seal-title {
  font-family: var(--lp-font-mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lp-muted-2);
}

.lp-seal-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--lp-font-mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #20835d;
  background: rgb(155 255 210 / 67%);
  border-radius: 100px;
  padding: 3px 9px 3px 7px;
}

.lp-seal-body { display: flex; gap: 14px; align-items: center; }

.lp-seal-rows { flex: 1; min-width: 0; }

.lp-seal-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
  padding: 3px 0;
}

.lp-seal-row-label { color: var(--lp-muted-2); }

.lp-seal-row-value {
  font-family: var(--lp-font-mono);
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lp-seal-qr {
  flex: none;
  width: 46px;
  height: 46px;
  border-radius: 6px;
  background:
    linear-gradient(90deg, #fff 0 22%, transparent 0 44%, #fff 0 66%, transparent 0 100%) 0 0/100% 22% repeat-y,
    linear-gradient(0deg, #fff 0 22%, transparent 0 44%, #fff 0 66%, transparent 0 100%) 0 0/22% 100% repeat-x;
  background-color: rgba(255,255,255,0.9);
  opacity: 0.92;
}

/* ── Stats row ────────────────────────────────────────── */
.lp-stats {
  display: flex;
  gap: 34px;
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--lp-line-dark);
}

.lp-stat-num {
  font-family: var(--lp-font-display);
  font-weight: 600;
  font-size: 20px;
  color: #fff;
}

.lp-stat-label {
  font-size: 11.5px;
  color: var(--lp-muted-2);
  margin-top: 2px;
}

/* ── Right / form panel ──────────────────────────────────── */
.lp-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.lp-card {
  width: 100%;
  max-width: 380px;
}

.lp-card-badge-mobile { display: none; }

.lp-card-logo { height: 30px; width: auto; object-fit: contain; margin-bottom: 28px; }

.lp-heading {
  font-family: var(--lp-font-display);
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
  color: var(--lp-text);
}

.lp-sub {
  font-size: 14px;
  color: var(--lp-muted);
  margin: 0 0 30px;
}

.lp-field { margin-bottom: 18px; }

.lp-field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.lp-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--lp-text);
}

.lp-forgot {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--lp-accent);
}

.lp-forgot:hover { color: var(--lp-accent-ink); }

.lp-input-wrap { position: relative; }

.lp-input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--lp-line);
  background: var(--lp-paper);
  font-family: var(--lp-font-body);
  font-size: 14.5px;
  color: var(--lp-text);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.lp-input::placeholder { color: #9AA4B2; }

.lp-input:focus {
  border-color: var(--lp-accent);
  box-shadow: 0 0 0 3px rgba(36,81,196,0.14);
}

.lp-input--error { border-color: #DC4C4C; }
.lp-input--error:focus { box-shadow: 0 0 0 3px rgba(220,76,76,0.14); }

.lp-error-msg {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #DC4C4C;
}

.lp-pw-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--lp-muted);
  cursor: pointer;
}

.lp-pw-toggle:hover { background: var(--lp-paper-2); color: var(--lp-text); }

.lp-btn {
  width: 100%;
  height: 46px;
  margin-top: 6px;
  border: none;
  border-radius: 10px;
  background: var(--lp-accent);
  color: #fff;
  font-family: var(--lp-font-body);
  font-weight: 600;
  font-size: 14.5px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
}

.lp-btn:hover:not(:disabled) { background: var(--lp-accent-ink); }
.lp-btn:active:not(:disabled) { transform: scale(0.99); }
.lp-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.lp-btn-inner { display: inline-flex; align-items: center; justify-content: center; gap: 9px; }

.lp-spinner {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  animation: lp-spin 0.7s linear infinite;
}

@keyframes lp-spin { to { transform: rotate(360deg); } }

.lp-card-foot {
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  margin-top: 26px;
  font-size: 11.5px;
  color: var(--lp-muted);
}

.lp-card-foot svg { flex: none; }

/* Focus visibility for keyboard users */
.lp-root a:focus-visible,
.lp-root button:focus-visible,
.lp-root input:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 2px;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1024px) {
  .lp-root { grid-template-columns: 1fr; }
  .lp-aside { display: none; }
  .lp-card-badge-mobile {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--lp-font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--lp-green);
    background: var(--lp-green-soft);
    border-radius: 100px;
    padding: 5px 11px 5px 9px;
    margin-bottom: 22px;
  }
}

@media (max-width: 460px) {
  .lp-main { padding: 28px 18px; }
  .lp-heading { font-size: 21px; }
}

@media (prefers-reduced-motion: reduce) {
  .lp-spinner { animation: none; }
}
`;

export const ForgotPasswordStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    .forgot-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: #F1F5F9;
        font-family: 'Poppins', sans-serif;
    }

    .forgot-logo-wrap {
        margin-bottom: 2rem;
        text-align: center;
    }

    .forgot-logo-wrap img {
        max-height: 48px;
        object-fit: contain;
    }

    .forgot-card {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #E2E8F0;
        padding: 2.5rem 2rem;
        width: 100%;
        max-width: 420px;
        box-shadow: 0 8px 32px rgba(47, 111, 237, 0.08);
    }

    .forgot-icon-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #F1F5F9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.25rem;
    }

    .forgot-icon-circle svg {
        width: 26px;
        height: 26px;
        stroke: #2F6FED;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .forgot-title {
        font-size: 20px;
        font-weight: 600;
        color: #111827;
        text-align: center;
        margin-bottom: 0.4rem;
    }

    .forgot-subtitle {
        font-size: 13.5px;
        color: #6b7280;
        text-align: center;
        margin-bottom: 1.75rem;
        line-height: 1.6;
    }

    .forgot-success-box {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 13px;
        color: #15803d;
        margin-bottom: 1.25rem;
        text-align: center;
    }

    .forgot-field-label {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .forgot-field-label .forgot-back-link {
        font-size: 12.5px;
        color: #2F6FED;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.15s;
    }

    .forgot-field-label .forgot-back-link:hover {
        text-decoration: underline;
        opacity: 0.85;
    }

    .forgot-input-wrap {
        position: relative;
        margin-bottom: 0.5rem;
    }

    .forgot-input-icon {
        position: absolute;
        left: 13px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        color: #64748B;
        pointer-events: none;
    }

    .forgot-input-wrap input {
        width: 100%;
        padding: 10px 14px 10px 38px;
        border-radius: 10px;
        border: 1.5px solid #e5e7eb;
        background: #F7F8FA;
        font-size: 13.5px;
        color: #111827;
        font-family: 'Poppins', sans-serif;
        transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        outline: none;
    }

    .forgot-input-wrap input:focus {
        border-color: #2F6FED;
        box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
        background: #ffffff;
    }

    .forgot-input-wrap input::placeholder {
        color: #94A3B8;
    }

    .forgot-error {
        font-size: 12px;
        color: #e24b4a;
        margin-top: 5px;
        margin-bottom: 1rem;
        min-height: 18px;
    }

    .forgot-btn {
        width: 100%;
        padding: 11px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #1D4ED8, #2F6FED);
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        cursor: pointer;
        transition: opacity 0.18s, transform 0.12s;
        letter-spacing: 0.01em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 0.5rem;
    }

    .forgot-btn:hover:not(:disabled) {
        opacity: 0.92;
    }

    .forgot-btn:active:not(:disabled) {
        transform: scale(0.98);
    }

    .forgot-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
    }

    .forgot-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: forgotSpin 0.7s linear infinite;
    }

    @keyframes forgotSpin {
        to { transform: rotate(360deg); }
    }
`;