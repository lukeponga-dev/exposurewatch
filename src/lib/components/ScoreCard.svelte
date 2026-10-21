<script lang="ts">
  import type { ExposureLevel } from "$lib/types/exposure";

  interface Props {
    score: number;
    level: ExposureLevel;
  }
  let { score, level }: Props = $props();
  const levelClass = $derived(level.toLowerCase());
</script>

<div class="score-card {levelClass}" aria-label="Exposure risk score">
  <div class="score-topline">
    <div class="topline-left">
      <span class="pulse-indicator"></span>
      <span class="label">Threat Evaluation</span>
    </div>
    <span class="level-badge {levelClass}">
      {level} Risk
    </span>
  </div>

  <div class="score-display">
    <div class="score-value-wrap">
      <strong class="score-number {levelClass}">{score}</strong>
      <div class="score-scale">
        <span class="max-score">/ 100</span>
        <span class="scale-label">Risk Index</span>
      </div>
    </div>

    <div class="meter-track" aria-hidden="true">
      <div
        class="meter-bar {levelClass}"
        style:width={`${Math.min(100, Math.max(0, score))}%`}
      ></div>
    </div>
  </div>

  <div class="score-details">
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <strong class="detail-val">
        {#if level === 'Critical'}Immediate action advised
        {:else if level === 'High'}High exposure identified
        {:else if level === 'Medium'}Moderate exposure
        {:else}Low exposure detected
        {/if}
      </strong>
    </div>
    <p class="description">
      Calculated from breach volume, recency, and sensitive exposed data classes.
    </p>
  </div>
</div>

<style>
  .score-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 2rem;
    border: 1px solid var(--border, #D7D7D5);
    border-radius: 12px;
    background: var(--surface, #FFFFFF);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  }
  .score-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .topline-left {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }
  .pulse-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent, #006B73);
  }
  .score-card.critical .pulse-indicator,
  .score-card.high .pulse-indicator {
    background: var(--status-error, #C94F4F);
  }
  .score-card.medium .pulse-indicator {
    background: var(--status-warning, #D9A441);
  }
  .score-card.low .pulse-indicator {
    background: var(--status-success, #2F7F6D);
  }

  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: var(--text-secondary, #5A5A5A);
  }
  .level-badge {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
  }
  .level-badge.critical,
  .level-badge.high {
    color: var(--status-error, #C94F4F);
    background: var(--status-error-bg, #FAEDED);
  }
  .level-badge.medium {
    color: var(--status-warning, #D9A441);
    background: var(--status-warning-bg, #FDF7EA);
  }
  .level-badge.low {
    color: var(--status-success, #2F7F6D);
    background: var(--status-success-bg, #EAF4F1);
  }

  .score-display {
    display: grid;
    gap: 0.75rem;
  }
  .score-value-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }
  .score-number {
    font-size: clamp(3.6rem, 5vw, 4.6rem);
    line-height: 0.88;
    font-weight: 800;
    letter-spacing: -0.05em;
  }
  .score-number.critical,
  .score-number.high {
    color: var(--status-error, #C94F4F);
  }
  .score-number.medium {
    color: var(--status-warning, #D9A441);
  }
  .score-number.low {
    color: var(--status-success, #2F7F6D);
  }

  .score-scale {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .max-score {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary, #5A5A5A);
  }
  .scale-label {
    font-family: ui-monospace, monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary, #9C9C9C);
  }
  .meter-track {
    height: 6px;
    border-radius: 99px;
    background: var(--bg, #F2F2F0);
    border: 1px solid var(--border, #D7D7D5);
    overflow: hidden;
  }
  .meter-bar {
    height: 100%;
    border-radius: inherit;
    transition: width 0.5s ease;
  }
  .meter-bar.critical,
  .meter-bar.high {
    background: var(--status-error, #C94F4F);
  }
  .meter-bar.medium {
    background: var(--status-warning, #D9A441);
  }
  .meter-bar.low {
    background: var(--status-success, #2F7F6D);
  }

  .score-details {
    display: grid;
    gap: 0.65rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border, #D7D7D5);
  }
  .detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .detail-label {
    font-family: ui-monospace, monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary, #5A5A5A);
  }
  .detail-val {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary, #2B2B2B);
  }
  .description {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--text-secondary, #5A5A5A);
  }
</style>
