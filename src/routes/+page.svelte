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
  <title>ExposureWatch — Email Exposure Intelligence</title>
  <meta name="description" content="Check whether an email address has appeared in known data breaches with privacy-first exposure scoring." />
</svelte:head>

<div class="page-shell">
  <header class="site-header">
    <a class="brand" href="/" aria-label="ExposureWatch home">
      <span class="brand-mark" aria-hidden="true">E</span>
      <span class="brand-name">Exposure<span class="brand-accent">Watch</span></span>
    </a>
    <div class="header-meta">
      <a class="docs-link" href="/docs">Documentation</a>
      <div class="status-indicator">
        <span class="status-dot" aria-hidden="true"></span>
        <span class="status-label">Privacy-First Engine</span>
      </div>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <div class="eyebrow-chip">
          <span>Security Intelligence</span>
        </div>
        <h1 id="page-title">
          Know where your email has been <span class="teal-accent">exposed.</span>
        </h1>
        <p class="lede">
          Check an email address against verified breach databases and receive a clear risk assessment with the incidents that contributed to it.
        </p>
        <div class="trust-grid" aria-label="Core features">
          <div class="trust-card">
            <strong>Targeted Check</strong>
            <span>One secure, focused search</span>
          </div>
          <div class="trust-card">
            <strong>Clear Context</strong>
            <span>Transparent risk calculation</span>
          </div>
          <div class="trust-card">
            <strong>Actionable Details</strong>
            <span>Exposed data classes identified</span>
          </div>
        </div>
      </div>

      <div class="hero-right">
        <section class="check-panel" aria-labelledby="check-heading">
          <div class="panel-heading">
            <div>
              <span class="section-label">Exposure Lookup</span>
              <h2 id="check-heading">Check an email address</h2>
            </div>
            <span class="shield-badge">Confidential</span>
          </div>
          <EmailCheckForm onCheck={handleCheck} disabled={loading} />
        </section>
      </div>
    </section>

    {#if loading}
      <section class="message" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <div class="message-text">
          <strong>Scanning Known Records</strong>
          <span>Cross-referencing verified breach databases…</span>
        </div>
      </section>
    {:else if error}
      <section class="message error" role="alert">
        <span class="message-code">NOTICE</span>
        <div class="message-text">
          <strong>Check Incomplete</strong>
          <span>{error}</span>
        </div>
      </section>
    {:else if result}
      <section class="results" aria-live="polite" aria-label="Exposure report">
        <div class="result-header">
          <div class="result-header-left">
            <span class="section-label">Exposure Report</span>
            <div class="result-title-row">
              <h2>{result.email}</h2>
              <span class="security-chip {result.level.toLowerCase()}">
                {result.level} Risk
              </span>
            </div>
          </div>
          <div class="result-header-right">
            <div class="record-count-badge">
              <strong>{result.breaches.length}</strong>
              <span>{result.breaches.length === 1 ? "Breach Incident" : "Breach Incidents"}</span>
            </div>
          </div>
        </div>

        {#if result.breaches.length > 0}
          <div class="advisory-banner {result.level.toLowerCase()}">
            <div class="advisory-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="advisory-text">
              <strong>Recommended Action:</strong>
              {#if result.score >= 70}
                Elevated threat level. Update passwords across impacted services and enable Multi-Factor Authentication (2FA) wherever available.
              {:else if result.score >= 40}
                Moderate exposure identified. Review shared passwords and audit linked accounts.
              {:else if result.score > 0}
                Minor exposure found. Maintain standard credential hygiene and monitor accounts.
              {:else}
                No active exposure detected in verified databases.
              {/if}
            </div>
          </div>
        {/if}

        <div class="result-grid">
          <ScoreCard score={result.score} level={result.level} />
          <BreachList breaches={result.breaches} />
        </div>
      </section>
    {/if}
  </main>

  <footer>
    <div class="footer-col">
      <span class="footer-brand">Exposure<span class="brand-accent">Watch</span></span>
      <span class="footer-desc">Security awareness and credential exposure tracking.</span>
    </div>
    <div class="footer-center">
      <span>Private by design · No credentials or queries recorded</span>
    </div>
    <div class="footer-right">
      <span>Independent Security Intelligence</span>
    </div>
  </footer>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  
  /* Light Mode Palette (Default) */
  :global(:root) {
    color-scheme: light dark;
    --bg: #F2F2F0;
    --surface: #FFFFFF;
    --surface-hover: #E0F4F5;
    
    --text-primary: #2B2B2B;
    --text-secondary: #5A5A5A;
    --text-tertiary: #9C9C9C;
    
    --border: #D7D7D5;
    
    --accent: #006B73;
    --accent-hover: #00848D;
    --accent-soft: #E0F4F5;
    --accent-contrast: #FFFFFF;
    
    --status-success: #2F7F6D;
    --status-success-bg: #EAF4F1;
    --status-warning: #D9A441;
    --status-warning-bg: #FDF7EA;
    --status-error: #C94F4F;
    --status-error-bg: #FAEDED;
  }

  /* Dark Mode Palette (Triggered by user device / browser setting) */
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --bg: #121417;
      --surface: #1A1D21;
      --surface-hover: rgba(0, 163, 166, 0.14);
      
      --text-primary: #E8EAED;
      --text-secondary: #9FA6B2;
      --text-tertiary: #6C727D;
      
      --border: #2D3239;
      
      --accent: #00A3A6;
      --accent-hover: #21C1C4;
      --accent-soft: rgba(0, 163, 166, 0.15);
      --accent-contrast: #0E1217;
      
      --status-success: #34D399;
      --status-success-bg: rgba(52, 211, 153, 0.14);
      --status-warning: #FBBF24;
      --status-warning-bg: rgba(251, 191, 36, 0.14);
      --status-error: #F87171;
      --status-error-bg: rgba(248, 113, 113, 0.16);
    }
  }

  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    margin: 0;
    min-width: 320px;
    background: var(--bg);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s, color 0.2s;
  }

  :global(button), :global(input) { font: inherit; }
  :global(::selection) { background: var(--accent-soft); color: var(--accent); }

  .page-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    transition: background-color 0.2s;
  }

  .site-header, main, footer {
    width: min(1280px, calc(100% - 4rem));
    margin-inline: auto;
  }

  .site-header {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    border-bottom: 1px solid var(--border);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text-primary);
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 6px;
    background: var(--accent);
    color: var(--accent-contrast);
    font-size: 0.95rem;
    font-weight: 800;
  }

  .brand-name {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .brand-accent {
    color: var(--accent);
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .docs-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: color 0.15s;
  }
  .docs-link:hover { color: var(--accent-hover); }
  .docs-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0.7rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
  .status-label {
    font-family: ui-monospace, monospace;
    font-size: 0.7rem;
    color: var(--text-secondary);
  }

  main {
    flex: 1;
    padding: 3rem 0 5rem;
    display: grid;
    gap: 2.5rem;
  }

  .hero {
    min-height: 420px;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
    align-items: center;
    gap: 3.5rem;
    padding: 1rem 0;
  }

  .hero-copy {
    display: grid;
    gap: 1.25rem;
  }

  .eyebrow-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    width: fit-content;
    padding: 0.28rem 0.65rem;
    border-radius: 4px;
    background: var(--accent-soft);
    color: var(--accent);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  h1 {
    max-width: 760px;
    margin: 0;
    font-size: clamp(2.8rem, 4vw, 3.8rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 800;
    color: var(--text-primary);
  }

  .teal-accent {
    color: var(--accent);
    font-style: normal;
  }

  .lede {
    max-width: 580px;
    margin: 0;
    color: var(--text-secondary);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-top: 0.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .trust-card {
    display: grid;
    gap: 0.2rem;
    padding: 0.75rem 0.85rem;
    border-radius: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
  }
  .trust-card strong {
    color: var(--text-primary);
    font-size: 0.82rem;
    font-weight: 650;
  }
  .trust-card span {
    color: var(--text-secondary);
    font-size: 0.72rem;
  }

  .hero-right {
    position: relative;
  }

  .check-panel {
    padding: 2.25rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  }

  .panel-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.35rem;
  }

  .section-label {
    margin: 0;
    color: var(--accent);
    text-transform: uppercase;
    font: 700 0.7rem/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.1em;
  }

  .panel-heading h2 {
    margin: 0.25rem 0 0;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
    font-weight: 750;
    color: var(--text-primary);
  }

  .shield-badge {
    font-family: ui-monospace, monospace;
    font-size: 0.68rem;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    font-weight: 600;
  }

  .message {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  }

  .message-text {
    display: grid;
    gap: 0.2rem;
  }
  .message-text strong {
    font-size: 0.92rem;
    color: var(--text-primary);
  }
  .message-text span {
    color: var(--text-secondary);
    font-size: 0.82rem;
  }

  .spinner {
    width: 1.3rem;
    height: 1.3rem;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .error {
    border-color: rgba(201, 79, 79, 0.35);
    background: var(--status-error-bg);
  }
  .error strong { color: var(--status-error); }
  .message-code {
    font: 700 0.68rem ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.08em;
    color: var(--status-error);
    background: var(--surface);
    border: 1px solid var(--status-error);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .results {
    padding: 2.25rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.03);
    display: grid;
    gap: 1.75rem;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .result-header-left {
    display: grid;
    gap: 0.35rem;
  }

  .result-title-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
  }

  .result-title-row h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    word-break: break-all;
  }

  .security-chip {
    font-family: ui-monospace, monospace;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
  }

  .security-chip.critical, .security-chip.high {
    color: var(--status-error);
    background: var(--status-error-bg);
  }

  .security-chip.medium {
    color: var(--status-warning);
    background: var(--status-warning-bg);
  }

  .security-chip.low {
    color: var(--status-success);
    background: var(--status-success-bg);
  }

  .record-count-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: ui-monospace, monospace;
    font-size: 0.72rem;
    color: var(--text-secondary);
  }

  .record-count-badge strong {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
  }

  .advisory-banner {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .advisory-banner.critical, .advisory-banner.high {
    border-color: rgba(201, 79, 79, 0.35);
    background: var(--status-error-bg);
    color: var(--status-error);
  }

  .advisory-banner.medium {
    border-color: rgba(217, 164, 65, 0.35);
    background: var(--status-warning-bg);
    color: var(--status-warning);
  }

  .advisory-banner.low {
    border-color: rgba(47, 127, 109, 0.35);
    background: var(--status-success-bg);
    color: var(--status-success);
  }

  .advisory-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .advisory-text {
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--text-primary);
  }

  .advisory-text strong {
    margin-right: 0.35rem;
  }

  .result-grid {
    display: grid;
    grid-template-columns: minmax(300px, 340px) minmax(0, 1fr);
    gap: 1.75rem;
    align-items: stretch;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 2.25rem 0 3rem;
    border-top: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 0.78rem;
    flex-wrap: wrap;
  }

  .footer-brand {
    font-weight: 750;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
  .footer-desc {
    display: block;
    margin-top: 0.15rem;
    font-size: 0.74rem;
    color: var(--text-secondary);
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 1040px) {
    .site-header, main, footer { width: min(100% - 3rem, 780px); }
    .hero { min-height: auto; grid-template-columns: 1fr; gap: 2.5rem; }
    .result-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  }

  @media (max-width: 640px) {
    .site-header, main, footer { width: calc(100% - 1.5rem); }
    .site-header { height: 70px; }
    main { padding: 1.75rem 0 3rem; gap: 1.5rem; }
    h1 { font-size: clamp(2.3rem, 10vw, 3.2rem); }
    .trust-grid { grid-template-columns: 1fr; gap: 0.5rem; }
    .panel-heading, .result-header { align-items: flex-start; flex-direction: column; }
    .record-count-badge { align-items: flex-start; }
    .check-panel, .results { padding: 1.5rem; }
    footer { flex-direction: column; align-items: flex-start; gap: 0.85rem; }
  }
</style>
