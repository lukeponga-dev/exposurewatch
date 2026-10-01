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
    <span>Risk score</span>
    <span class="level {levelClass}">{level}</span>
  </div>
  <div class="score-line"><strong>{score}</strong><span>/ 100</span></div>
  <div class="meter" aria-hidden="true"><span style:width={`${Math.min(100, Math.max(0, score))}%`}></span></div>
  <p>Calculated from the number and sensitivity of known breach records.</p>
</section>

<style>
  .score-card { min-height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 1.05rem; padding: 1.7rem 1.8rem 1.7rem 0; border-right: 1px solid var(--border); }
  .score-topline { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: #a9bbce; text-transform: uppercase; font: 700 .65rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .15em; }
  .level { border: 1px solid #39516b; border-radius: 999px; padding: .42rem .68rem; color: #a9c2dd; letter-spacing: .08em; }
  .level.high, .level.critical { border-color: rgba(255, 95, 112, .48); background: rgba(255, 95, 112, .08); color: #ff7b88; }
  .level.medium { border-color: rgba(255, 190, 92, .42); color: #ffc56d; }
  .level.low { border-color: rgba(82, 229, 187, .38); color: #67e5be; }
  .score-line { display: flex; align-items: baseline; gap: .55rem; }
  strong { font-size: clamp(3.4rem, 7vw, 5.2rem); line-height: .85; letter-spacing: -.06em; }
  .score-line > span { color: var(--muted); font-size: .9rem; }
  .meter { height: 5px; overflow: hidden; border-radius: 99px; background: #1a293d; }
  .meter span { display: block; height: 100%; border-radius: inherit; background: var(--accent); }
  p { max-width: 340px; margin: 0; color: var(--muted); font-size: .78rem; line-height: 1.55; }
  @media (max-width: 980px) { .score-card { padding: 1.5rem 0; border-right: 0; border-bottom: 1px solid var(--border); } }
</style>
