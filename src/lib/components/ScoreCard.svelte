<script lang="ts">
  import type { ExposureLevel } from "$lib/types/exposure";

  interface Props {
    score: number;
    level: ExposureLevel;
  }
  let { score, level }: Props = $props();
  const levelClass = $derived(level.toLowerCase());
  
  const levelColor = $derived(
    level === 'Critical' || level === 'High' ? '#C94F4F' :
    level === 'Medium' ? '#D9A441' : '#2F7F6D'
  );

  const levelBg = $derived(
    level === 'Critical' || level === 'High' ? '#FAEDED' :
    level === 'Medium' ? '#FDF7EA' : '#EAF4F1'
  );
</script>

<div class="score-card {levelClass}" aria-label="Exposure risk score">
  <div class="score-topline">
    <div class="topline-left">
      <span class="pulse-indicator" style:background={levelColor}></span>
      <span class="label">Threat Evaluation</span>
    </div>
    <span class="level-badge" style:color={levelColor} style:background={levelBg}>
      {level} Risk
    </span>
  </div>

  <div class="score-display">
    <div class="score-value-wrap">
      <strong class="score-number" style:color={levelColor}>{score}</strong>
      <div class="score-scale">
        <span class="max-score">/ 100</span>
        <span class="scale-label">Risk Index</span>
      </div>
    </div>

    <div class="meter-track" aria-hidden="true">
      <div
        class="meter-bar"
        style:width={`${Math.min(100, Math.max(0, score))}%`}
        style:background={levelColor}
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
    border: 1px solid #D7D7D5;
    border-radius: 12px;
    background: #FFFFFF;
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
  }
  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: #5A5A5A;
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
  .score-scale {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .max-score {
    font-size: 1rem;
    font-weight: 600;
    color: #5A5A5A;
  }
  .scale-label {
    font-family: ui-monospace, monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9C9C9C;
  }
  .meter-track {
    height: 6px;
    border-radius: 99px;
    background: #F2F2F0;
    border: 1px solid #D7D7D5;
    overflow: hidden;
  }
  .meter-bar {
    height: 100%;
    border-radius: inherit;
    transition: width 0.5s ease;
  }
  .score-details {
    display: grid;
    gap: 0.65rem;
    padding-top: 1.25rem;
    border-top: 1px solid #D7D7D5;
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
    color: #5A5A5A;
  }
  .detail-val {
    font-size: 0.88rem;
    font-weight: 600;
    color: #2B2B2B;
  }
  .description {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #5A5A5A;
  }
</style>
