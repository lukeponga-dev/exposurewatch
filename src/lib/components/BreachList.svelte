<script lang="ts">
  import type { Breach } from '$lib/types/exposure';
  interface Props { breaches?: Breach[]; }
  let { breaches = [] }: Props = $props();
</script>

<section class="breaches" aria-labelledby="breaches-heading">
  <h2 id="breaches-heading">Known breaches</h2>
  {#if breaches.length === 0}
    <p class="empty">No known breaches for this email.</p>
  {:else}
    <ul>
      {#each breaches as breach}
        <li>
          <div>
            <strong>{breach.breachName}</strong>
            {#if breach.date}<time>{breach.date}</time>{/if}
          </div>
          {#if breach.dataClasses?.length}
            <p>Data exposed: {breach.dataClasses.join(', ')}</p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .breaches { display: grid; gap: .8rem; }
  h2 { margin: 0; font-size: 1.1rem; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .65rem; }
  li { padding: 1rem; border: 1px solid var(--border); border-radius: .85rem; background: var(--surface); }
  li div { display: flex; justify-content: space-between; gap: 1rem; }
  time { color: var(--muted); font-size: .85rem; }
  p { margin: .35rem 0 0; color: var(--muted); }
  .empty { margin: 0; padding: 1rem; border-radius: .85rem; background: var(--surface); color: var(--muted); }
</style>
