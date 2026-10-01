<script lang="ts">
  import type { PageData } from "./$types";
  let { data }: { data: PageData } = $props();
  let query = $state("");
  const filtered = $derived(data.documents.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase())));
</script>

<svelte:head>
  <title>{data.document.title} — ExposureWatch Docs</title>
  <meta name="description" content={`ExposureWatch documentation: ${data.document.title}`} />
</svelte:head>

<div class="docs-shell">
  <header>
    <a class="brand" href="/"><span aria-hidden="true">E</span>ExposureWatch</a>
    <nav aria-label="Main navigation"><a href="/">Email checker</a><a href="/docs" aria-current="page">Documentation</a></nav>
  </header>
  <div class="docs-grid">
    <aside class="sidebar">
      <p class="eyebrow">Knowledge base</p>
      <h2>Documentation</h2>
      <label for="doc-search" class="sr-only">Find a document</label>
      <input id="doc-search" type="search" placeholder="Find a document…" bind:value={query} />
      <nav aria-label="Documentation">
        {#each data.groups as group}
          {#if filtered.some((doc) => doc.group === group)}
            <div class="nav-group">
              <h3>{group}</h3>
              {#each filtered.filter((doc) => doc.group === group) as doc}
                <a href={`/docs/${doc.slug}`} class:active={doc.slug === data.document.slug} aria-current={doc.slug === data.document.slug ? "page" : undefined}>{doc.title}</a>
              {/each}
            </div>
          {/if}
        {/each}
        {#if filtered.length === 0}<p class="no-results">No matching documents.</p>{/if}
      </nav>
      <a class="source-link" href="https://github.com/lukeponga-dev/exposurewatch/tree/main/docs" target="_blank" rel="noreferrer">Browse source on GitHub</a>
    </aside>
    <main id="doc-content">
      <div class="doc-meta"><span>{data.document.group}</span><span>{data.documents.length} documents</span></div>
      <article class="prose">{@html data.html}</article>
      <footer>Docs are built from the repository Markdown files.<a href={`https://github.com/lukeponga-dev/exposurewatch/blob/main${data.document.path}`} target="_blank" rel="noreferrer">View this page’s source</a></footer>
    </main>
    <aside class="toc">
      <nav aria-label="On this page">
        <h2>On this page</h2>
        {#each data.headings as heading}
          <a href={`#${heading.id}`} class:subheading={heading.level === 3}>{heading.text}</a>
        {/each}
      </nav>
    </aside>
  </div>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { scroll-behavior: smooth; scroll-padding-top: 90px; }
  :global(body) { margin: 0; background: #06101f; color: #f4f8ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .docs-shell { min-height: 100vh; color-scheme: dark; }
  header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; height: 76px; padding: 0 3rem; border-bottom: 1px solid #20324a; }
  .brand { display: flex; align-items: center; gap: .7rem; color: #f4f8ff; font-weight: 750; text-decoration: none; }
  .brand span { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #6c5cff; }
  header nav { display: flex; gap: 1.5rem; }
  header nav a { font-size: .85rem; color: #aab9cb; text-decoration: none; }
  header nav a[aria-current] { color: #52e5ff; }
  .docs-grid { display: grid; grid-template-columns: 250px minmax(0, 820px) 200px; gap: 3rem; max-width: 1440px; margin: auto; padding: 2.5rem 3rem; }
  .sidebar { align-self: start; position: sticky; top: 2rem; }
  .eyebrow { font: 700 .65rem ui-monospace, monospace; letter-spacing: .16em; color: #52e5ff; text-transform: uppercase; margin: 0 0 .7rem; }
  .sidebar h2 { font-size: 1.3rem; margin: 0 0 1.5rem; letter-spacing: -.03em; }
  input { width: 100%; padding: .8rem; border: 1px solid #2f5475; background: #0b1728; color: #f4f8ff; border-radius: 8px; font: inherit; font-size: .8rem; }
  input:focus-visible, a:focus-visible { outline: 2px solid #52e5ff; outline-offset: 3px; }
  .nav-group { margin: 1.7rem 0; }
  .nav-group h3 { color: #8fa2ba; text-transform: uppercase; font: 700 .65rem ui-monospace, monospace; letter-spacing: .12em; margin: 0 0 .65rem; }
  .nav-group a { display: block; padding: .55rem .75rem; margin: .1rem 0; border-radius: 6px; text-decoration: none; font-size: .83rem; line-height: 1.5; color: #b5c6d9; }
  .nav-group a:hover { background: #0e1c30; color: #fff; }
  .nav-group a.active { background: #102b3e; color: #52e5ff; }
  .source-link { display: inline-block; color: #8fa2ba; font-size: .75rem; margin-top: 1rem; }
  .no-results { color: #8fa2ba; font-size: .85rem; }
  main { min-width: 0; }
  .doc-meta { display: flex; gap: 1rem; color: #81dff3; text-transform: uppercase; font: 700 .65rem ui-monospace, monospace; letter-spacing: .1em; border-bottom: 1px solid #20324a; padding-bottom: 1rem; margin-bottom: 1.8rem; }
  .doc-meta span + span { color: #8fa2ba; }
  .prose { font-size: .95rem; line-height: 1.8; color: #b8c7d9; overflow-wrap: anywhere; }
  .prose :global(h1) { font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.15; letter-spacing: -.04em; color: #f4f8ff; margin: 0 0 1.5rem; }
  .prose :global(h2) { color: #f4f8ff; font-size: 1.45rem; letter-spacing: -.02em; margin: 2.6rem 0 1rem; line-height: 1.35; }
  .prose :global(h3), .prose :global(h4) { color: #e2edfa; margin: 1.8rem 0 .8rem; line-height: 1.4; }
  .prose :global(a) { color: #52e5ff; text-underline-offset: 3px; }
  .prose :global(strong) { color: #e2edfa; }
  .prose :global(pre) { background: #0b1728; border: 1px solid #20324a; border-radius: 10px; padding: 1.1rem; overflow-x: auto; white-space: pre; font-size: .8rem; line-height: 1.6; }
  .prose :global(code) { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .85em; color: #a1deed; }
  .prose :global(:not(pre) > code) { background: #122238; border-radius: 4px; padding: .12em .3em; }
  .prose :global(table) { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; font-size: .83rem; margin: 1.3rem 0; }
  .prose :global(th), .prose :global(td) { padding: .75rem; text-align: left; border: 1px solid #20324a; min-width: 120px; }
  .prose :global(th) { color: #f4f8ff; background: #0e1c30; }
  .prose :global(blockquote) { margin: 1rem 0; padding: .25rem 1rem; border-left: 3px solid #19d3f3; background: #0b1728; }
  .prose :global(hr) { border: 0; border-top: 1px solid #20324a; margin: 2rem 0; }
  .prose :global(li) { margin: .35rem 0; }
  footer { margin-top: 3rem; border-top: 1px solid #20324a; padding-top: 1.5rem; color: #8fa2ba; font-size: .75rem; display: grid; gap: .5rem; }
  footer a { color: #52e5ff; }
  .toc { position: sticky; top: 2rem; align-self: start; border-left: 1px solid #20324a; padding-left: 1.2rem; }
  .toc h2 { font-size: .75rem; margin: 0 0 1rem; }
  .toc a { display: block; color: #8fa2ba; font-size: .72rem; text-decoration: none; line-height: 1.5; padding: .35rem 0; }
  .toc a:hover { color: #52e5ff; }
  .toc .subheading { padding-left: .7rem; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  @media (max-width: 1200px) { .docs-grid { grid-template-columns: 230px minmax(0, 1fr); gap: 2rem; } .toc { display: none; } }
  @media (max-width: 700px) { header { height: auto; min-height: 76px; padding: 1rem; flex-wrap: wrap; } header nav { gap: 1rem; } .docs-grid { padding: 1.5rem 1rem; grid-template-columns: 1fr; } .sidebar { position: static; } .sidebar nav { max-height: 230px; overflow-y: auto; border-bottom: 1px solid #20324a; } .sidebar h2 { margin-bottom: 1rem; } .nav-group { margin: 1rem 0; } .source-link { margin-top: .75rem; } }
  @media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } }
</style>
