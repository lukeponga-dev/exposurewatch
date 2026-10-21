<script lang="ts">
  import type { Breach } from "$lib/types/exposure";
  interface Props { breaches?: Breach[]; }
  let { breaches = [] }: Props = $props();
  let expanded = $state(false);
  const visibleBreaches = $derived(expanded ? breaches : breaches.slice(0, 8));
</script>

<section class="breaches" aria-labelledby="breaches-heading">
  <div class="section-heading">
    <div>
      <span class="label">Exposure details</span>
      <h3 id="breaches-heading" class="syne">Known breaches</h3>
    </div>
    <div class="heading-actions">
      <span class="label">{breaches.length} {breaches.length === 1 ? "record" : "records"}</span>
      {#if breaches.length > 8}
        <button type="button" class="expand-btn" onclick={() => (expanded = !expanded)}>
          {expanded ? "Show summary" : `Show all ${breaches.length}`}
        </button>
      {/if}
    </div>
  </div>
  {#if breaches.length === 0}
    <div class="empty">
      <strong>No known breaches found</strong>
      <span>No matching record was returned for this address.</span>
    </div>
  {:else}
    <ul>
      {#each visibleBreaches as breach, index}
        <li>
          <span class="index label">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong class="breach-name">{breach.breachName}</strong>
            {#if breach.dataClasses?.length}
              <p>{breach.dataClasses.join(" · ")}</p>
            {:else}
              <p>Exposure details unavailable</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .breaches {
    border: 2px solid var(--ink);
    padding: 2rem;
    background: white;
    box-shadow: 6px 6px 0 var(--ink);
  }
  .section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid var(--ink);
    margin-bottom: 1.25rem;
  }
  .label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 700;
    color: var(--accent);
  }
  .syne {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    margin: 0.3rem 0 0;
  }
  .heading-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .expand-btn {
    border: 1px solid var(--ink);
    padding: 0.35rem 0.75rem;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 700;
  }
  .expand-btn:hover { background: var(--ink); color: var(--bg); }
  
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--ink-faint);
    align-items: start;
  }
  li:last-child { border-bottom: none; }
  .index { color: var(--accent); }
  .breach-name { font-size: 0.95rem; font-family: 'Inter', sans-serif; font-weight: 600; }
  p { margin: 0.35rem 0 0; color: var(--ink-medium); font-size: 0.78rem; line-height: 1.45; }
  
  .empty {
    padding: 2rem 0;
    text-align: center;
    display: grid;
    gap: 0.5rem;
  }
  .empty strong { font-size: 1rem; font-family: 'Syne', sans-serif; color: #00874e; }
  .empty span { color: var(--ink-medium); font-size: 0.85rem; }
</style>
