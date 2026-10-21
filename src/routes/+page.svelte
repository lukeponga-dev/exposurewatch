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
      <a class="docs-link" href="/docs">Documentation</a>
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
      <div class="hero-right">
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
      </div>
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
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    background-image: radial-gradient(circle at 75% 12%, rgba(12, 88, 129, .22), transparent 35%);
  }

  .site-header, main, footer {
    width: min(1320px, calc(100% - 4rem));
    margin-inline: auto;
  }

  .site-header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    border-bottom: 1px solid rgba(111, 144, 178, .16);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: .78rem;
    color: var(--text);
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 760;
    letter-spacing: -.02em;
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: .65rem;
    background: var(--violet);
    color: white;
    font-size: .95rem;
    font-weight: 850;
    box-shadow: 0 0 28px rgba(108, 92, 255, .32);
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: .8rem;
    color: #b7c5d7;
    font-size: .82rem;
  }

  .docs-link {
    color: #b7c5d7;
    text-decoration: none;
    margin-right: 1.25rem;
    transition: color .15s;
  }
  .docs-link:hover { color: var(--accent-strong); }
  .docs-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

  .status-dot {
    width: .48rem;
    height: .48rem;
    border-radius: 50%;
    background: #63e6be;
    box-shadow: 0 0 0 5px rgba(99, 230, 190, .08), 0 0 14px rgba(99, 230, 190, .62);
  }

  main {
    flex: 1;
    padding: 2.5rem 0 5rem;
    display: grid;
    gap: 2rem;
  }

  .hero {
    min-height: 440px;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, .85fr);
    align-items: center;
    gap: 3rem;
    padding: 1.5rem 0;
  }

  .hero-copy {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 1rem;
  }

  .eyebrow, .section-label {
    margin: 0;
    color: #81dff3;
    text-transform: uppercase;
    font: 700 .7rem/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: .2em;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: .7rem;
  }
  .eyebrow span { width: 2rem; height: 1px; background: var(--accent); }

  h1 {
    max-width: 780px;
    margin: 0;
    font-size: clamp(2.8rem, 4vw, 4.1rem);
    line-height: .96;
    letter-spacing: -.055em;
  }
  h1 em { color: #8fd9ff; font-style: normal; }

  .lede {
    max-width: 620px;
    margin: 0;
    color: #aab9cb;
    font-size: 1.05rem;
    line-height: 1.65;
  }

  .trust-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-top: .8rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(84, 116, 148, .28);
  }

  .trust-row div {
    display: grid;
    gap: .3rem;
  }

  .trust-row strong { color: #e9f6ff; font-size: .85rem; }
  .trust-row span { color: var(--muted); font-size: .74rem; }

  .hero-right {
    position: relative;
  }

  .check-panel {
    position: relative;
    z-index: 2;
    padding: 2rem;
    border: 1px solid var(--border-bright);
    border-radius: 1rem;
    background: rgba(9, 22, 39, .92);
    box-shadow: 0 22px 70px rgba(0, 0, 0, .32);
    backdrop-filter: blur(12px);
  }

  .panel-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .panel-heading h2, .result-header h2 {
    margin: .35rem 0 0;
    font-size: 1.15rem;
    letter-spacing: -.02em;
  }

  .privacy-note, .record-count {
    color: var(--muted);
    font-size: .76rem;
  }

  .message {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.4rem;
    border: 1px solid var(--border);
    border-radius: .8rem;
    background: var(--surface);
  }

  .message div { display: grid; gap: .22rem; }
  .message strong { font-size: .9rem; }
  .message div span { color: var(--muted); font-size: .78rem; }

  .spinner {
    width: 1.2rem;
    height: 1.2rem;
    border: 2px solid #29405b;
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  .error { border-color: rgba(255, 95, 112, .34); }
  .error strong, .message-code { color: var(--danger); }
  .message-code { font: 750 .65rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; }

  .results {
    padding: 2rem;
    border: 1px solid var(--border);
    border-radius: 1rem;
    background: rgba(8, 19, 34, .92);
    box-shadow: 0 20px 60px rgba(0, 0, 0, .25);
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  .result-grid {
    display: grid;
    grid-template-columns: minmax(300px, .75fr) minmax(0, 1.25fr);
    gap: 2rem;
    align-items: start;
  }

  footer {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.25rem;
    padding: 2rem 0 2.5rem;
    border-top: 1px solid rgba(111, 144, 178, .16);
    color: #7388a1;
    font-size: .72rem;
  }

  footer span:nth-child(2) { text-align: center; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    :global(html) { scroll-behavior: auto; }
    .spinner { animation-duration: 1.5s; }
  }

  @media (max-width: 1024px) {
    .site-header, main, footer { width: min(100% - 3rem, 760px); }
    .hero { min-height: auto; grid-template-columns: 1fr; gap: 2rem; }
    .result-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  }

  @media (max-width: 640px) {
    .site-header, main, footer { width: calc(100% - 1.5rem); }
    .site-header { height: 72px; }
    .header-meta span:last-child { display: none; }
    main { padding: 1.5rem 0 3rem; gap: 1.5rem; }
    h1 { font-size: clamp(2.5rem, 12vw, 3.6rem); }
    .trust-row { grid-template-columns: 1fr; gap: 1rem; }
    .panel-heading, .result-header { align-items: flex-start; flex-direction: column; }
    .check-panel, .results { padding: 1.25rem; }
    footer { grid-template-columns: 1fr; gap: .75rem; }
    footer span:nth-child(2) { text-align: left; }
  }
</style>
