<script lang="ts">
  import type { ExposureLevel } from "$lib/types/exposure";

  interface Props {
    score: number;
    level: ExposureLevel;
  }
  let { score, level }: Props = $props();
  const levelClass = $derived(level.toLowerCase());
  
  const levelColor = $derived(
    level === 'Critical' || level === 'High' ? '#ff5f70' :
    level === 'Medium' ? '#ffc56d' : '#63e6be'
  );
</script>

<div class="score-card {levelClass}" aria-label="Exposure risk score">
  <div class="card-glow" aria-hidden="true" style:background={levelColor}></div>
  
  <div class="score-topline">
    <div class="topline-left">
      <span class="pulse-indicator" style:background={levelColor}></span>
      <span class="label">Threat Level</span>
    </div>
    <span class="level-badge {levelClass}">{level}</span>
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
        style:box-shadow={`0 0 12px ${levelColor}`}
      ></div>
    </div>
  </div>

  <div class="score-details">
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <strong class="detail-val">
        {#if level === 'Critical'}Urgent Attention Required
        {:else if level === 'High'}High Risk Identified
        {:else if level === 'Medium'}Moderate Exposure
        {:else}Low Exposure Detected
        {/if}
      </strong>
    </div>
    <p class="description">
      Calculated from incident volume, recency, and sensitive exposed data classes.
    </p>
  </div>
</div>

<style>
  .score-card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 2rem;
    border: 1px solid var(--border-bright, #2f5475);
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba(14, 28, 48, 0.85) 0%, rgba(9, 20, 36, 0.95) 100%);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  }
  .card-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    filter: blur(50px);
    opacity: 0.18;
    pointer-events: none;
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
    gap: 0.6rem;
  }
  .pulse-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
    animation: pulse 2.2s infinite ease-in-out;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.85); }
  }
  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 700;
    color: var(--muted, #8fa2ba);
  }
  .level-badge {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.28rem 0.75rem;
    border-radius: 999px;
    border: 1px solid currentColor;
  }
  .level-badge.critical, .level-badge.high {
    color: #ff5f70;
    background: rgba(255, 95, 112, 0.12);
    border-color: rgba(255, 95, 112, 0.45);
    box-shadow: 0 0 16px rgba(255, 95, 112, 0.18);
  }
  .level-badge.medium {
    color: #ffc56d;
    background: rgba(255, 197, 109, 0.12);
    border-color: rgba(255, 197, 109, 0.45);
    box-shadow: 0 0 16px rgba(255, 197, 109, 0.15);
  }
  .level-badge.low {
    color: #63e6be;
    background: rgba(99, 230, 190, 0.12);
    border-color: rgba(99, 230, 190, 0.45);
    box-shadow: 0 0 16px rgba(99, 230, 190, 0.15);
  }
  .score-display {
    display: grid;
    gap: 0.75rem;
  }
  .score-value-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
  }
  .score-number {
    font-size: clamp(3.6rem, 5.5vw, 4.8rem);
    line-height: 0.88;
    font-weight: 800;
    letter-spacing: -0.06em;
  }
  .score-scale {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .max-score {
    font-size: 1rem;
    color: var(--muted, #8fa2ba);
  }
  .scale-label {
    font-family: ui-monospace, monospace;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #617b98;
  }
  .meter-track {
    height: 8px;
    border-radius: 99px;
    background: rgba(20, 37, 60, 0.9);
    overflow: hidden;
    border: 1px solid rgba(47, 84, 117, 0.4);
  }
  .meter-bar {
    height: 100%;
    border-radius: inherit;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .score-details {
    display: grid;
    gap: 0.65rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(47, 84, 117, 0.3);
  }
  .detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .detail-label {
    font-family: ui-monospace, monospace;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted, #8fa2ba);
  }
  .detail-val {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text, #f4f8ff);
  }
  .description {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.5;
    color: var(--muted, #8fa2ba);
  }
</style>
