<script lang="ts">
  import type { ExposureLevel } from '$lib/types/exposure';

  interface Props { score: number; level: ExposureLevel; }
  let { score, level }: Props = $props();
</script>

<section class="score-card" aria-label="Exposure score">
  <div>
    <span class="eyebrow">Exposure score</span>
    <strong>{score}</strong>
  </div>
  <span class="level">{level}</span>
</section>

<style>
  .score-card { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.4rem; border: 1px solid var(--border); border-radius: 1rem; background: var(--surface); }
  .score-card div { display: grid; gap: .2rem; }
  .eyebrow { color: var(--muted); font-size: .85rem; }
  strong { font-size: clamp(2rem, 7vw, 3.2rem); line-height: 1; }
  .level { border-radius: 999px; padding: .45rem .7rem; background: var(--soft-accent); color: var(--accent); font-weight: 800; }
</style>
