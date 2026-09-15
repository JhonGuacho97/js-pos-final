export const loginStyles = `
.auth-shell {
  --auth-navy: #0c1d3f;
  --auth-navy-soft: #142b58;
  --auth-blue: #2868f0;
  --auth-blue-dark: #174fc5;
  --auth-blue-soft: #eef4ff;
  --auth-green: #19aa72;
  --auth-text: #111c35;
  --auth-muted: #6d7b96;
  --auth-line: #dfe5ef;
  --auth-surface: #f4f7fb;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(470px, 46%) minmax(500px, 54%);
  overflow: hidden;
  background: var(--auth-surface);
  color: var(--auth-text);
  font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.auth-shell *, .auth-shell *::before, .auth-shell *::after { box-sizing: border-box; }
.auth-shell a { text-decoration: none; }

.auth-story {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  min-height: 100dvh;
  padding: clamp(32px, 4vw, 64px);
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 88% 18%, rgba(61, 124, 255, .45), transparent 31%),
    radial-gradient(circle at 4% 94%, rgba(25, 170, 114, .16), transparent 28%),
    linear-gradient(145deg, #08152f 0%, #102653 68%, #0d2148 100%);
}

.auth-story::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: .18;
  background-image:
    linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom right, rgba(0,0,0,.8), transparent 70%);
}

.auth-story::after {
  content: '';
  position: absolute;
  z-index: -1;
  width: 340px;
  height: 340px;
  right: -190px;
  bottom: -150px;
  border-radius: 50%;
  border: 72px solid rgba(255,255,255,.04);
}

.auth-brand { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 13px; width: max-content; }
.auth-brand__mark {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,.16);
}
.auth-brand__mark img { display: block; width: 38px; height: 38px; border-radius: 11px; object-fit: cover; }
.auth-brand__mark strong { color: var(--auth-blue); font-size: 15px; letter-spacing: -.04em; }
.auth-brand__copy { display: flex; flex-direction: column; line-height: 1.25; }
.auth-brand__copy strong { color: #fff; font-size: 17px; font-weight: 700; letter-spacing: -.015em; }
.auth-brand__copy small { color: rgba(255,255,255,.6); font-size: 11px; font-weight: 500; }

.auth-story__content { position: relative; z-index: 1; width: 100%; max-width: 550px; margin: 42px 0 34px; }
.auth-kicker { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 18px; color: #a8c0f5; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.auth-kicker i { width: 7px; height: 7px; border-radius: 50%; background: #31d598; box-shadow: 0 0 0 5px rgba(49,213,152,.13); }
.auth-story h1 { max-width: 530px; margin: 0; color: #fff; font-size: clamp(36px, 4vw, 54px); font-weight: 700; line-height: 1.08; letter-spacing: -.045em; }
.auth-story h1 span { color: #8bb2ff; }
.auth-story__content > p { max-width: 490px; margin: 20px 0 30px; color: rgba(229,237,255,.74); font-size: 15px; line-height: 1.75; }

.auth-preview { width: min(100%, 500px); padding: 21px; border: 1px solid rgba(255,255,255,.14); border-radius: 20px; background: rgba(7,20,45,.48); box-shadow: 0 28px 60px -30px rgba(0,0,0,.66); backdrop-filter: blur(14px); }
.auth-preview__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.auth-preview__top > div { display: flex; flex-direction: column; gap: 3px; }
.auth-preview__top small, .auth-preview__metrics small { color: rgba(213,225,251,.58); font-size: 10px; font-weight: 500; }
.auth-preview__top strong { color: #fff; font-size: 14px; font-weight: 600; }
.auth-preview__top > span { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(49,213,152,.2); border-radius: 999px; color: #88ebc5; background: rgba(25,170,114,.1); font-size: 10px; font-weight: 600; }
.auth-preview__top > span i { width: 6px; height: 6px; border-radius: 50%; background: #31d598; }
.auth-preview__chart { height: 74px; display: flex; align-items: flex-end; gap: 8px; padding: 15px 2px 11px; border-bottom: 1px solid rgba(255,255,255,.1); }
.auth-preview__chart i { flex: 1; min-height: 10px; border-radius: 5px 5px 2px 2px; background: linear-gradient(180deg, #5d94ff, #2868f0); opacity: .92; }
.auth-preview__metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 14px; }
.auth-preview__metrics div { display: flex; flex-direction: column; gap: 3px; }
.auth-preview__metrics strong { color: #f5f8ff; font-size: 11px; font-weight: 600; }

.auth-benefits { display: flex; flex-wrap: wrap; gap: 10px 22px; margin: 24px 0 0; padding: 0; list-style: none; }
.auth-benefits li { display: inline-flex; align-items: center; gap: 7px; color: rgba(231,239,255,.72); font-size: 11px; }
.auth-benefits svg { width: 17px; height: 17px; flex: none; padding: 2px; border-radius: 50%; color: #78e3bb; background: rgba(49,213,152,.12); fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.auth-story__footer { position: relative; z-index: 1; color: rgba(217,228,250,.47); font-size: 10px; letter-spacing: .025em; }

.auth-main { min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 36px clamp(24px, 6vw, 88px) 24px; }
.auth-main__mobile-brand { display: none; width: 100%; max-width: 480px; margin-bottom: 24px; }
.auth-card { width: 100%; max-width: 480px; padding: clamp(30px, 4vw, 46px); border: 1px solid rgba(218,225,237,.92); border-radius: 24px; background: #fff; box-shadow: 0 30px 80px -48px rgba(31,57,102,.45), 0 8px 28px rgba(31,57,102,.05); }
.auth-card__intro { margin-bottom: 30px; }
.auth-card__eyebrow { display: block; margin-bottom: 10px; color: var(--auth-blue); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.auth-card h2, .auth-success h2 { margin: 0; color: var(--auth-text); font-size: clamp(25px, 2.4vw, 31px); font-weight: 700; line-height: 1.2; letter-spacing: -.035em; }
.auth-card__intro p, .auth-success > p { margin: 10px 0 0; color: var(--auth-muted); font-size: 13px; line-height: 1.7; }
.auth-success > p strong { color: var(--auth-text); font-weight: 600; overflow-wrap: anywhere; }

.auth-icon-box { width: 48px; height: 48px; display: grid; place-items: center; margin-bottom: 20px; border: 1px solid #d8e5ff; border-radius: 14px; color: var(--auth-blue); background: var(--auth-blue-soft); }
.auth-icon-box svg { width: 21px; height: 21px; }
.auth-field { margin-bottom: 20px; }
.auth-field__header { min-height: 21px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
.auth-field__header label { margin: 0; color: #27334d; font-size: 12px; font-weight: 600; }
.auth-inline-link { color: var(--auth-blue); font-size: 11px; font-weight: 600; }
.auth-inline-link:hover { color: var(--auth-blue-dark); text-decoration: underline; text-underline-offset: 3px; }
.auth-input-wrap { position: relative; }
.auth-input-wrap input { width: 100%; height: 52px; padding: 0 46px 0 44px; border: 1px solid var(--auth-line); border-radius: 12px; outline: none; background: #fbfcfe; color: var(--auth-text); font-family: inherit; font-size: 13px; font-weight: 500; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.auth-input-wrap input::placeholder { color: #9aa6bb; font-weight: 400; }
.auth-input-wrap input:hover { border-color: #c9d2e1; background: #fff; }
.auth-input-wrap input:focus { border-color: var(--auth-blue); background: #fff; box-shadow: 0 0 0 4px rgba(40,104,240,.11); }
.auth-input-wrap input.is-invalid { border-color: #d94b58; background: #fffafb; }
.auth-input-wrap input.is-invalid:focus { box-shadow: 0 0 0 4px rgba(217,75,88,.1); }
.auth-input-icon { position: absolute; z-index: 1; left: 15px; top: 50%; width: 17px; height: 17px; transform: translateY(-50%); color: #7d8ba5; pointer-events: none; }
.auth-password-toggle { position: absolute; z-index: 1; right: 7px; top: 50%; width: 36px; height: 36px; display: grid; place-items: center; padding: 0; transform: translateY(-50%); border: 0; border-radius: 9px; color: #71809b; background: transparent; cursor: pointer; }
.auth-password-toggle:hover { color: var(--auth-text); background: #eff3f9; }
.auth-error { display: block; margin-top: 7px; color: #c93646; font-size: 11px; line-height: 1.45; }

.auth-primary-button { width: 100%; min-height: 52px; display: flex; align-items: center; justify-content: center; margin-top: 8px; padding: 0 18px; border: 0; border-radius: 12px; color: #fff; background: var(--auth-blue); box-shadow: 0 14px 26px -16px rgba(40,104,240,.8); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .16s ease, transform .1s ease, box-shadow .16s ease; }
.auth-primary-button:hover:not(:disabled) { color: #fff; background: var(--auth-blue-dark); box-shadow: 0 18px 30px -17px rgba(23,79,197,.86); }
.auth-primary-button:active:not(:disabled) { transform: translateY(1px); }
.auth-primary-button:disabled { opacity: .6; cursor: not-allowed; box-shadow: none; }
.auth-primary-button--link { margin-top: 25px; gap: 10px; }
.auth-button__content { width: 100%; display: grid; grid-template-columns: 20px 1fr 20px; align-items: center; gap: 8px; }
.auth-button__label { grid-column: 2; }
.auth-button__arrow { grid-column: 3; font-size: 18px; font-weight: 400; transition: transform .16s ease; }
.auth-primary-button:hover .auth-button__arrow { transform: translateX(3px); }
.auth-spinner { grid-column: 1; width: 17px; height: 17px; border: 2px solid rgba(255,255,255,.42); border-top-color: #fff; border-radius: 50%; animation: auth-spin .7s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }

.auth-card__trust { display: flex; align-items: flex-start; gap: 8px; margin-top: 26px; padding-top: 21px; border-top: 1px solid #edf0f5; color: #7c8aa3; font-size: 10px; line-height: 1.5; }
.auth-card__trust svg { width: 15px; height: 15px; flex: none; margin-top: 1px; color: var(--auth-green); }
.auth-main__footer { display: flex; align-items: center; gap: 7px; margin: 19px 0 0; color: #8996aa; font-size: 10px; }
.auth-secure-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--auth-green); box-shadow: 0 0 0 4px rgba(25,170,114,.1); }
.auth-help-copy { margin: 22px 0 0; color: #8390a7; font-size: 10px; line-height: 1.6; text-align: center; }
.auth-back-link { display: block; width: max-content; margin: 23px auto 0; color: var(--auth-blue); font-size: 11px; font-weight: 600; }
.auth-back-link:hover { color: var(--auth-blue-dark); }

.auth-success { text-align: center; }
.auth-success__icon { width: 58px; height: 58px; display: grid; place-items: center; margin: 0 auto 19px; border: 1px solid #bdebd9; border-radius: 18px; color: var(--auth-green); background: #edfbf6; }
.auth-success__icon svg { width: 28px; height: 28px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.auth-success .auth-card__eyebrow { margin-bottom: 9px; }
.auth-notice { margin-top: 22px; padding: 13px 15px; border: 1px solid #dce6f7; border-radius: 12px; color: #5f6e88; background: #f7f9fd; font-size: 10px; line-height: 1.65; text-align: left; }
.auth-secondary-button { width: 100%; min-height: 46px; margin-top: 9px; border: 1px solid var(--auth-line); border-radius: 12px; color: #4f5e78; background: #fff; font-family: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
.auth-secondary-button:hover { border-color: #c8d2e1; background: #f8fafc; }

.auth-password-hint { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: -5px 0 22px; }
.auth-password-hint span { display: inline-flex; align-items: center; gap: 6px; color: #8b97aa; font-size: 10px; }
.auth-password-hint span::before { content: ''; width: 7px; height: 7px; border: 1px solid #aeb8c8; border-radius: 50%; }
.auth-password-hint span.is-complete { color: #16845c; }
.auth-password-hint span.is-complete::before { border-color: var(--auth-green); background: var(--auth-green); box-shadow: 0 0 0 3px rgba(25,170,114,.1); }

.auth-shell a:focus-visible, .auth-shell button:focus-visible, .auth-shell input:focus-visible { outline: 2px solid var(--auth-blue); outline-offset: 3px; }

@media (max-height: 780px) and (min-width: 981px) {
  .auth-story { padding-top: 30px; padding-bottom: 30px; }
  .auth-story__content { margin: 24px 0 20px; }
  .auth-story h1 { font-size: clamp(32px, 3.5vw, 44px); }
  .auth-story__content > p { margin: 13px 0 18px; }
  .auth-preview { padding: 15px 18px; }
  .auth-preview__chart { height: 58px; }
  .auth-benefits { margin-top: 16px; }
  .auth-card { padding-top: 32px; padding-bottom: 32px; }
}

@media (max-width: 980px) {
  .auth-shell { display: block; min-height: 100vh; min-height: 100dvh; overflow: auto; }
  .auth-story { display: none; }
  .auth-main { min-height: 100vh; min-height: 100dvh; justify-content: flex-start; padding: 28px 22px; }
  .auth-main__mobile-brand { display: block; }
  .auth-brand--compact .auth-brand__mark { width: 42px; height: 42px; flex-basis: 42px; border: 1px solid #e1e7f0; box-shadow: 0 8px 22px rgba(31,57,102,.1); }
  .auth-brand--compact .auth-brand__copy strong { color: var(--auth-text); }
  .auth-brand--compact .auth-brand__copy small { color: var(--auth-muted); }
  .auth-card { margin: auto 0; }
}

@media (max-width: 560px) {
  .auth-main { padding: 21px 16px 18px; background: #fff; }
  .auth-main__mobile-brand { margin-bottom: 28px; }
  .auth-card { margin: 0; padding: 12px 3px 22px; border: 0; border-radius: 0; box-shadow: none; }
  .auth-card__intro { margin-bottom: 26px; }
  .auth-card h2, .auth-success h2 { font-size: 26px; }
  .auth-main__footer { margin-top: auto; padding-top: 24px; }
  .auth-field__header { align-items: flex-end; }
}

[dir='rtl'] .auth-input-wrap input { padding-left: 46px; padding-right: 44px; }
[dir='rtl'] .auth-input-icon { left: auto; right: 15px; }
[dir='rtl'] .auth-password-toggle { left: 7px; right: auto; }
[dir='rtl'] .auth-notice { text-align: right; }

@media (prefers-reduced-motion: reduce) {
  .auth-spinner { animation: none; }
  .auth-primary-button, .auth-button__arrow { transition: none; }
}
`;

// Alias conservado para imports históricos; ambos flujos comparten el mismo sistema visual.
export const ForgotPasswordStyles = loginStyles;
