<script lang="ts">
  import EmailCheckForm from '$lib/components/EmailCheckForm.svelte';
  import ScoreCard from '$lib/components/ScoreCard.svelte';
  import BreachList from '$lib/components/BreachList.svelte';
  import { checkExposure } from '$lib/api/exposure';
  import type { ExposureResult } from '$lib/types/exposure';

  let result = $state<ExposureResult | null>(null);
  let loading = $state(false);
  let error = $state('');

  async function handleCheck(email: string) {
    loading = true;
    error = '';
    result = null;
    try {
      result = await checkExposure(email);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to check this email.';
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
  <header>
    <div class="brand"><span class="mark">E</span><span>ExposureWatch</span></div>
    <span class="status">Privacy-first exposure checks</span>
  </header>

  <main>
    <section class="hero">
      <p class="kicker">EMAIL SECURITY</p>
      <h1>Know where your email has been exposed.</h1>
      <p class="lede">Check an email address against the ExposureWatch service and get a simple risk score with the breaches that contributed to it.</p>
    </section>

    <section class="panel">
      <EmailCheckForm onCheck={handleCheck} disabled={loading} />
    </section>

    {#if loading}
      <section class="message" aria-live="polite"><span class="spinner"></span> Checking exposure…</section>
    {:else if error}
      <section class="message error" role="alert"><strong>Check failed.</strong> {error}</section>
    {:else if result}
      <section class="results" aria-live="polite">
        <ScoreCard score={result.score} level={result.level} />
        <BreachList breaches={result.breaches} />
      </section>
    {/if}
  </main>

  <footer>ExposureWatch · Built for responsible security awareness</footer>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(:root) { --bg: #f6f7fb; --surface: #fff; --text: #121522; --muted: #687080; --border: #e2e5ec; --accent: #635bff; --soft-accent: #eeedff; }
  .page-shell { min-height: 100vh; display: flex; flex-direction: column; }
  header, main, footer { width: min(960px, calc(100% - 2rem)); margin-inline: auto; }
  header { padding: 1.4rem 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .brand { display: flex; align-items: center; gap: .6rem; font-weight: 800; }
  .mark { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: .65rem; background: var(--accent); color: white; }
  .status { color: var(--muted); font-size: .85rem; }
  main { flex: 1; padding: 4rem 0; }
  .hero { max-width: 720px; margin-bottom: 2rem; }
  .kicker { margin: 0 0 .6rem; color: var(--accent); font-weight: 800; letter-spacing: .1em; font-size: .75rem; }
  h1 { margin: 0; font-size: clamp(2.5rem, 7vw, 5rem); line-height: .98; letter-spacing: -.045em; }
  .lede { max-width: 650px; margin: 1.2rem 0 0; color: var(--muted); font-size: 1.08rem; line-height: 1.65; }
  .panel, .message { border: 1px solid var(--border); border-radius: 1rem; background: var(--surface); padding: 1.25rem; }
  .results { margin-top: 1rem; display: grid; gap: 1rem; }
  .message { margin-top: 1rem; display: flex; align-items: center; gap: .7rem; color: var(--muted); }
  .error { color: #a32135; }
  .spinner { width: 1rem; height: 1rem; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  footer { padding: 1.5rem 0; color: var(--muted); font-size: .8rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) { main { padding: 2.5rem 0; } header { align-items: flex-start; } .status { display: none; } }
</style>
