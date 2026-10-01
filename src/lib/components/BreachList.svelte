<script lang="ts">
  import type { Breach } from "$lib/types/exposure";
  interface Props { breaches?: Breach[]; }
  let { breaches = [] }: Props = $props();
  let expanded = $state(false);
  const visibleBreaches = $derived(expanded ? breaches : breaches.slice(0, 8));
</script>

<section class="breaches" aria-labelledby="breaches-heading">
  <div class="section-heading">
    <div><span>Exposure details</span><h3 id="breaches-heading">Known breaches</h3></div>
    <div class="heading-actions">
      <span>{breaches.length} {breaches.length === 1 ? "record" : "records"}</span>
      {#if breaches.length > 8}
        <button type="button" onclick={() => (expanded = !expanded)}>
          {expanded ? "Show summary" : `Show all ${breaches.length}`}
        </button>
      {/if}
    </div>
  </div>
  {#if breaches.length === 0}
    <div class="empty"><strong>No known breaches found</strong><span>No matching record was returned for this address.</span></div>
  {:else}
    <ul>
      {#each visibleBreaches as breach, index}
        <li>
          <span class="index">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>{breach.breachName}</strong>
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
  .breaches { padding: 1.7rem 0 0 1.8rem; }
  .section-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; }
  .section-heading div > span { color: #81dff3; text-transform: uppercase; font: 700 .62rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .16em; }
  .heading-actions { display: flex; align-items: center; gap: .8rem; }
  .heading-actions > span { color: var(--muted); font-size: .7rem; }
  button { border: 0; padding: .35rem 0; background: none; color: var(--accent-strong); font: 700 .68rem ui-monospace, SFMono-Regular, Menlo, monospace; cursor: pointer; }
  button:hover { color: #fff; }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  h3 { margin: .3rem 0 0; font-size: 1rem; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: grid; grid-template-columns: 2.2rem minmax(0, 1fr); gap: .8rem; padding: .9rem 0; border-top: 1px solid var(--border); }
  .index { color: #68cfe7; font: 700 .65rem ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; }
  li strong { font-size: .86rem; }
  p { margin: .32rem 0 0; color: var(--muted); font-size: .74rem; line-height: 1.45; }
  .empty { display: grid; gap: .35rem; padding: 1.25rem 0; border-top: 1px solid var(--border); }
  .empty strong { color: #67e5be; font-size: .88rem; }
  .empty span { color: var(--muted); font-size: .76rem; }
  @media (max-width: 980px) { .breaches { padding: 1.5rem 0 0; } }
  @media (max-width: 560px) { .section-heading { align-items: flex-start; flex-direction: column; } }
</style>
