<script lang="ts">
  import EmailCheckForm from "$lib/components/EmailCheckForm.svelte";
  import ScoreCard from "$lib/components/ScoreCard.svelte";
  import BreachList from "$lib/components/BreachList.svelte";
  import { checkExposure } from "$lib/api/exposure";
  import type { ExposureResult } from "$lib/types/exposure";

  let result = $state<ExposureResult | null>(null);
  let loading = $state(false);
  let error = $state("");

  async function handleCheck(email: string) {
    loading = true;
    error = "";
    result = null;
    try {
      result = await checkExposure(email);
    } catch (err) {
      error = err instanceof Error ? err.message : "Unable to check this email.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>ExposureWatch — Email Exposure Checker</title>
  <meta name="description" content="Check whether an email address has appeared in known data breaches." />
</svelte:head>

<div class="page-shell">
  <header class="site-header">
    <a class="brand" href="/" aria-label="ExposureWatch home">
      <span class="brand-mark" aria-hidden="true">E</span>
      <span>ExposureWatch</span>
    </a>
    <div class="header-meta">
      <span class="status-dot" aria-hidden="true"></span>
      <span>Privacy-first exposure checks</span>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow"><span></span>Email security</p>
        <h1 id="page-title">Know where your email has been <em>exposed.</em></h1>
        <p class="lede">
          Check an email address against known breach records and get a clear risk score with
          the incidents that contributed to it.
        </p>
        <div class="trust-row" aria-label="Product benefits">
          <div><strong>Focused</strong><span>One secure check</span></div>
          <div><strong>Explainable</strong><span>Clear risk context</span></div>
          <div><strong>Actionable</strong><span>See exposed data</span></div>
        </div>
      </div>

      <div class="signal-visual" aria-label="Global breach signal illustration">
        <img
          src="/assets/exposurewatch-signal-globe.png"
          alt="A luminous digital globe showing connected breach signals"
        />
        <div class="signal-panel">
          <span class="signal-panel-label">Exposure intelligence</span>
          <strong>Known breach records</strong>
          <span>Mapped into one clear result</span>
        </div>
      </div>
    </section>

    <section class="check-panel" aria-labelledby="check-heading">
      <div class="panel-heading">
        <div>
          <span class="section-label">Run a check</span>
          <h2 id="check-heading">Check an email address</h2>
        </div>
        <span class="privacy-note">No account required</span>
      </div>
      <EmailCheckForm onCheck={handleCheck} disabled={loading} />
    </section>

    {#if loading}
      <section class="message" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <div><strong>Scanning known records</strong><span>Building your exposure report…</span></div>
      </section>
    {:else if error}
      <section class="message error" role="alert">
        <span class="message-code">ERR</span>
        <div><strong>Check failed</strong><span>{error}</span></div>
      </section>
    {:else if result}
      <section class="results" aria-live="polite" aria-label="Exposure report">
        <div class="result-header">
          <div>
            <span class="section-label">Exposure report</span>
            <h2>{result.email}</h2>
          </div>
          <span class="record-count">{result.breaches.length} known {result.breaches.length === 1 ? "record" : "records"}</span>
        </div>
        <div class="result-grid">
          <ScoreCard score={result.score} level={result.level} />
          <BreachList breaches={result.breaches} />
        </div>
      </section>
    {/if}
  </main>

  <footer>
    <span>ExposureWatch</span>
    <span>Built for responsible security awareness</span>
    <span>Private by design</span>
  </footer>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(:root) {
    color-scheme: dark;
    --bg: #06101f;
    --surface: #0b1728;
    --surface-raised: #0e1c30;
    --text: #f4f8ff;
    --muted: #8fa2ba;
    --border: #20324a;
    --border-bright: #2f5475;
    --accent: #19d3f3;
    --accent-strong: #52e5ff;
    --violet: #6c5cff;
    --danger: #ff5f70;
  }
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    margin: 0;
    min-width: 320px;
    background: var(--bg);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :global(button), :global(input) { font: inherit; }
  :global(::selection) { background: rgba(25, 211, 243, .25); color: #fff; }
  .page-shell {
    min-height: 100vh;
    overflow: hidden;
    background-image: radial-gradient(circle at 72% 14%, rgba(12, 88, 129, .24), transparent 31%);
  }
  .site-header, main, footer { width: min(1360px, calc(100% - 6rem)); margin-inline: auto; }
  .site-header {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    border-bottom: 1px solid rgba(111, 144, 178, .16);
  }
  .brand { display: flex; align-items: center; gap: .78rem; color: var(--text); text-decoration: none; font-size: 1.05rem; font-weight: 760; letter-spacing: -.02em; }
  .brand-mark { display: grid; place-items: center; width: 2.15rem; height: 2.15rem; border-radius: .62rem; background: var(--violet); color: white; font-size: .9rem; font-weight: 850; box-shadow: 0 0 28px rgba(108, 92, 255, .32); }
  .header-meta { display: flex; align-items: center; gap: .65rem; color: #b7c5d7; font-size: .8rem; }
  .status-dot { width: .45rem; height: .45rem; border-radius: 50%; background: #63e6be; box-shadow: 0 0 0 5px rgba(99, 230, 190, .08), 0 0 14px rgba(99, 230, 190, .62); }
  main { padding: 1.5rem 0 5rem; }
  .hero { min-height: 440px; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(430px, .85fr); align-items: center; gap: 2rem; }
  .hero-copy { position: relative; z-index: 1; padding: 1rem 0 2rem; }
  .eyebrow, .section-label { margin: 0; color: #81dff3; text-transform: uppercase; font: 700 .7rem/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: .2em; }
  .eyebrow { display: flex; align-items: center; gap: .7rem; margin-bottom: 1.2rem; }
  .eyebrow span { width: 2rem; height: 1px; background: var(--accent); }
  h1 { max-width: 780px; margin: 0; font-size: clamp(3.25rem, 4.2vw, 4.2rem); line-height: .94; letter-spacing: -.058em; }
  h1 em { color: #8fd9ff; font-style: normal; }
  .lede { max-width: 660px; margin: 1.25rem 0 0; color: #aab9cb; font-size: 1.05rem; line-height: 1.65; }
  .trust-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 1.8rem; border-block: 1px solid rgba(84, 116, 148, .28); }
  .trust-row div { display: grid; gap: .3rem; padding: 1rem 1rem 1rem 0; }
  .trust-row div + div { padding-left: 1rem; border-left: 1px solid rgba(84, 116, 148, .28); }
  .trust-row strong { color: #e9f6ff; font-size: .84rem; }
  .trust-row span { color: var(--muted); font-size: .72rem; }
  .signal-visual { position: relative; min-height: 440px; display: grid; place-items: center; }
  .signal-visual img { width: min(500px, 100%); height: auto; mix-blend-mode: screen; filter: drop-shadow(0 0 38px rgba(16, 184, 226, .14)); transform: translateX(3%); }
  .signal-panel { position: absolute; right: 0; bottom: 2.25rem; width: 225px; display: grid; gap: .45rem; padding: 1.1rem 1.2rem; border: 1px solid rgba(63, 132, 170, .45); border-radius: .7rem; background: rgba(6, 16, 31, .86); box-shadow: 0 16px 50px rgba(0, 0, 0, .34); backdrop-filter: blur(14px); }
  .signal-panel-label { color: var(--accent-strong); text-transform: uppercase; font: 700 .62rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; }
  .signal-panel strong { font-size: .9rem; }
  .signal-panel > span:last-child { color: var(--muted); font-size: .72rem; line-height: 1.4; }
  .check-panel { position: relative; z-index: 2; padding: 1.55rem; border: 1px solid var(--border-bright); border-radius: .85rem; background: rgba(9, 22, 39, .88); box-shadow: 0 22px 70px rgba(0, 0, 0, .25); }
  .panel-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.15rem; }
  .panel-heading h2, .result-header h2 { margin: .35rem 0 0; font-size: 1.12rem; letter-spacing: -.02em; }
  .privacy-note, .record-count { color: var(--muted); font-size: .75rem; }
  .message { margin-top: 1rem; display: flex; align-items: center; gap: .9rem; padding: 1.15rem 1.3rem; border: 1px solid var(--border); border-radius: .7rem; background: var(--surface); }
  .message div { display: grid; gap: .22rem; }
  .message strong { font-size: .88rem; }
  .message div span { color: var(--muted); font-size: .78rem; }
  .spinner { width: 1.15rem; height: 1.15rem; border: 2px solid #29405b; border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  .error { border-color: rgba(255, 95, 112, .34); }
  .error strong, .message-code { color: var(--danger); }
  .message-code { font: 750 .65rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; }
  .results { margin-top: 1.2rem; padding: 1.55rem; border: 1px solid var(--border); border-radius: .85rem; background: rgba(8, 19, 34, .9); }
  .result-header { display: flex; justify-content: space-between; align-items: end; gap: 1rem; padding-bottom: 1.2rem; border-bottom: 1px solid var(--border); }
  .result-grid { display: grid; grid-template-columns: minmax(280px, .75fr) minmax(0, 1.25fr); }
  footer { display: grid; grid-template-columns: auto 1fr auto; gap: 1.25rem; padding: 1.5rem 0 2.5rem; border-top: 1px solid rgba(111, 144, 178, .16); color: #7388a1; font-size: .7rem; }
  footer span:nth-child(2) { text-align: center; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } .spinner { animation-duration: 1.5s; } }
  @media (max-width: 980px) {
    .site-header, main, footer { width: min(100% - 2.5rem, 760px); }
    .hero { min-height: auto; grid-template-columns: 1fr; }
    .hero-copy { padding-top: 0; }
    .signal-visual { min-height: 390px; }
    .signal-visual img { width: min(500px, 90%); }
    .result-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .site-header, main, footer { width: calc(100% - 1.5rem); }
    .site-header { height: 72px; }
    .header-meta span:last-child { display: none; }
    main { padding: 2.5rem 0 3rem; }
    h1 { font-size: clamp(2.75rem, 14vw, 4.2rem); }
    .lede { font-size: .96rem; }
    .trust-row { grid-template-columns: 1fr; }
    .trust-row div + div { padding-left: 0; border-left: 0; border-top: 1px solid rgba(84, 116, 148, .28); }
    .signal-visual { min-height: 320px; }
    .signal-panel { right: .25rem; bottom: .25rem; }
    .panel-heading, .result-header { align-items: flex-start; flex-direction: column; }
    .check-panel, .results { padding: 1rem; }
    footer { grid-template-columns: 1fr; }
    footer span:nth-child(2) { text-align: left; }
  }
</style>
