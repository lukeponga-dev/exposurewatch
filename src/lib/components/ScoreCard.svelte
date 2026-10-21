<script lang="ts">
  import type { ExposureLevel } from "$lib/types/exposure";

  interface Props {
    score: number;
    level: ExposureLevel;
  }
  let { score, level }: Props = $props();
  const levelClass = $derived(level.toLowerCase());
</script>

<section class="score-card" aria-label="Exposure score">
  <div class="score-topline">
    <span class="label">Risk score</span>
    <span class="level {levelClass}">{level}</span>
  </div>
  <div class="score-line"><strong class="syne">{score}</strong><span class="label">/ 100</span></div>
  <div class="meter" aria-hidden="true"><span style:width={`${Math.min(100, Math.max(0, score))}%`}></span></div>
  <p>Calculated from the number and sensitivity of known breach records.</p>
</section>

<style>
  .score-card {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
    padding: 2rem;
    border: 2px solid var(--ink);
    background: white;
    box-shadow: 6px 6px 0 var(--ink);
  }
  .score-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 700;
    color: var(--ink-medium);
  }
  .level {
    border: 2px solid var(--ink);
    padding: 0.35rem 0.75rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 700;
  }
  .level.high, .level.critical { background: rgba(255, 77, 0, 0.1); border-color: var(--accent); color: var(--accent); }
  .level.medium { background: rgba(255, 183, 3, 0.15); color: #b37d00; }
  .level.low { background: rgba(0, 208, 132, 0.15); color: #00874e; }

  .score-line { display: flex; align-items: baseline; gap: 0.5rem; }
  .syne { font-family: 'Syne', sans-serif; font-size: clamp(3.5rem, 6vw, 5rem); line-height: 0.9; }
  .score-line > span { font-size: 1rem; color: var(--ink-medium); }
  .meter { height: 10px; overflow: hidden; border: 2px solid var(--ink); background: var(--bg); }
  .meter span { display: block; height: 100%; background: var(--accent); }
  p { margin: 0; color: var(--ink-medium); font-size: 0.82rem; line-height: 1.5; font-family: 'Inter', sans-serif; }
</style>
