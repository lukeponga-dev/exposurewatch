<script lang="ts">
  import type { Breach } from "$lib/types/exposure";
  interface Props { breaches?: Breach[]; }
  let { breaches = [] }: Props = $props();
  let expanded = $state(false);
  const visibleBreaches = $derived(expanded ? breaches : breaches.slice(0, 8));

  function formatBreachDate(dateStr?: string): string {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  function isSensitive(dataClass: string): boolean {
    const s = dataClass.toLowerCase();
    return s.includes("password") || s.includes("pin") || s.includes("token") || s.includes("social security");
  }
</script>

<div class="breaches-container" aria-labelledby="breaches-heading">
  <div class="section-heading">
    <div>
      <span class="label">Incident Timeline</span>
      <h3 id="breaches-heading">Identified Breaches</h3>
    </div>
    <div class="heading-actions">
      <span class="record-badge">
        <strong>{breaches.length}</strong> {breaches.length === 1 ? "source" : "sources"}
      </span>
      {#if breaches.length > 8}
        <button type="button" class="expand-btn" onclick={() => (expanded = !expanded)}>
          {expanded ? "Show less" : `View all (${breaches.length})`}
        </button>
      {/if}
    </div>
  </div>

  {#if breaches.length === 0}
    <div class="empty">
      <div class="empty-icon-wrap" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      </div>
      <strong>No Breach Records Found</strong>
      <span>This address was not found in any indexed data compromise records.</span>
    </div>
  {:else}
    <ul class="breach-list">
      {#each visibleBreaches as breach, index}
        <li class="breach-item">
          <div class="index-column">
            <span class="index-num">{String(index + 1).padStart(2, "0")}</span>
          </div>
          
          <div class="breach-main">
            <div class="breach-top">
              <span class="breach-name">{breach.breachName}</span>
              {#if breach.breachDate}
                <span class="breach-date" title="Breach Date: {formatBreachDate(breach.breachDate)}">
                  <svg class="calendar-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatBreachDate(breach.breachDate)}
                </span>
              {/if}
            </div>

            {#if breach.dataClasses && breach.dataClasses.length > 0}
              <div class="data-pills">
                {#each breach.dataClasses as dc}
                  <span class="pill" class:sensitive={isSensitive(dc)}>
                    {#if isSensitive(dc)}
                      <span class="alert-dot" aria-hidden="true"></span>
                    {/if}
                    {dc}
                  </span>
                {/each}
              </div>
            {:else}
              <p class="no-details">Exposure details unavailable</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .breaches-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border, #D7D7D5);
    margin-bottom: 1rem;
  }
  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: var(--accent, #006B73);
  }
  h3 {
    margin: 0.25rem 0 0;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
    font-weight: 700;
    color: var(--text-primary, #2B2B2B);
  }
  .heading-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .record-badge {
    font-family: ui-monospace, monospace;
    font-size: 0.72rem;
    color: var(--text-secondary, #5A5A5A);
  }
  .record-badge strong {
    color: var(--text-primary, #2B2B2B);
  }
  .expand-btn {
    border: 1px solid var(--accent, #006B73);
    border-radius: 6px;
    padding: 0.35rem 0.75rem;
    background: transparent;
    color: var(--accent, #006B73);
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .expand-btn:hover {
    background: var(--accent-soft, #E0F4F5);
    border-color: var(--accent-hover, #00848D);
    color: var(--accent-hover, #00848D);
  }

  .breach-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .breach-item {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr);
    gap: 0.75rem;
    padding: 1rem 1.15rem;
    border-radius: 8px;
    background: var(--surface, #FFFFFF);
    border: 1px solid var(--border, #D7D7D5);
    transition: background-color 0.15s, border-color 0.15s;
  }
  .breach-item:hover {
    background: var(--surface-hover, #E0F4F5);
    border-color: var(--accent, #006B73);
  }
  .index-column {
    display: flex;
    align-items: flex-start;
    padding-top: 0.1rem;
  }
  .index-num {
    font-family: ui-monospace, monospace;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent, #006B73);
  }
  .breach-main {
    display: grid;
    gap: 0.5rem;
  }
  .breach-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .breach-name {
    font-size: 0.95rem;
    font-weight: 650;
    color: var(--text-primary, #2B2B2B);
    letter-spacing: -0.01em;
  }
  .breach-date {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: ui-monospace, monospace;
    font-size: 0.7rem;
    color: var(--text-secondary, #5A5A5A);
    background: var(--bg, #F2F2F0);
    border: 1px solid var(--border, #D7D7D5);
    padding: 0.18rem 0.55rem;
    border-radius: 4px;
    font-weight: 600;
  }
  .calendar-icon {
    color: var(--accent, #006B73);
  }
  .data-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.74rem;
    color: var(--text-secondary, #5A5A5A);
    background: var(--bg, #F2F2F0);
    border: 1px solid var(--border, #D7D7D5);
    padding: 0.18rem 0.55rem;
    border-radius: 4px;
  }
  .pill.sensitive {
    color: var(--status-error, #C94F4F);
    background: var(--status-error-bg, #FAEDED);
    border-color: rgba(201, 79, 79, 0.3);
    font-weight: 600;
  }
  .alert-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--status-error, #C94F4F);
  }
  .no-details {
    margin: 0;
    font-size: 0.76rem;
    color: var(--text-tertiary, #9C9C9C);
  }

  .empty {
    padding: 3rem 1.5rem;
    text-align: center;
    display: grid;
    place-items: center;
    gap: 0.5rem;
    border-radius: 8px;
    background: var(--surface, #FFFFFF);
    border: 1px dashed var(--border, #D7D7D5);
  }
  .empty-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--accent-soft, #E0F4F5);
    color: var(--accent, #006B73);
    margin-bottom: 0.25rem;
  }
  .empty strong {
    font-size: 1.05rem;
    color: var(--text-primary, #2B2B2B);
    font-weight: 700;
  }
  .empty span {
    color: var(--text-secondary, #5A5A5A);
    font-size: 0.88rem;
    max-width: 360px;
  }
</style>
