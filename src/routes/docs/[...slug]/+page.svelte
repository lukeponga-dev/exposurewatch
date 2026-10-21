<script lang="ts">
  import type { PageData } from "./$types";
  let { data }: { data: PageData } = $props();
  let query = $state("");
  const filtered = $derived(
    data.documents.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))
  );
</script>

<svelte:head>
  <title>{data.document.title} — ExposureWatch Docs</title>
  <meta name="description" content={`ExposureWatch documentation: ${data.document.title}`} />
</svelte:head>

<div class="docs-shell">
  <header>
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true">E</span>
      <span class="brand-name">Exposure<span class="brand-accent">Watch</span></span>
    </a>
    <nav aria-label="Main navigation">
      <a href="/">Email checker</a>
      <a href="/docs" aria-current="page">Documentation</a>
    </nav>
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
                <a
                  href={`/docs/${doc.slug}`}
                  class:active={doc.slug === data.document.slug}
                  aria-current={doc.slug === data.document.slug ? "page" : undefined}
                >
                  {doc.title}
                </a>
              {/each}
            </div>
          {/if}
        {/each}
        {#if filtered.length === 0}
          <p class="no-results">No matching documents.</p>
        {/if}
      </nav>
      <a
        class="source-link"
        href="https://github.com/lukeponga-dev/exposurewatch/tree/main/docs"
        target="_blank"
        rel="noreferrer"
      >
        Browse source on GitHub
      </a>
    </aside>

    <main id="doc-content">
      <div class="doc-meta">
        <span class="meta-group">{data.document.group}</span>
        <span class="meta-count">{data.documents.length} documents</span>
      </div>
      <article class="prose">
        {@html data.html}
      </article>
      <footer>
        <span>Docs are built from the repository Markdown files.</span>
        <a
          href={`https://github.com/lukeponga-dev/exposurewatch/blob/main${data.document.path}`}
          target="_blank"
          rel="noreferrer"
        >
          View this page’s source
        </a>
      </footer>
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
  
  :global(:root) {
    color-scheme: light dark;
    --bg: #F2F2F0;
    --surface: #FFFFFF;
    --surface-hover: #E0F4F5;
    --nav-hover: #EBEBE6;
    
    --text-primary: #2B2B2B;
    --text-secondary: #5A5A5A;
    --text-tertiary: #9C9C9C;
    
    --border: #D7D7D5;
    
    --accent: #006B73;
    --accent-hover: #00848D;
    --accent-soft: #E0F4F5;
    --accent-contrast: #FFFFFF;
  }

  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --bg: #121417;
      --surface: #1A1D21;
      --surface-hover: rgba(0, 163, 166, 0.14);
      --nav-hover: #252930;
      
      --text-primary: #E8EAED;
      --text-secondary: #9FA6B2;
      --text-tertiary: #6C727D;
      
      --border: #2D3239;
      
      --accent: #00A3A6;
      --accent-hover: #21C1C4;
      --accent-soft: rgba(0, 163, 166, 0.15);
      --accent-contrast: #0E1217;
    }
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s, color 0.2s;
  }
  .docs-shell {
    min-height: 100vh;
    background-color: var(--bg);
    transition: background-color 0.2s;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    height: 76px;
    padding: 0 3rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-primary);
    font-weight: 700;
    text-decoration: none;
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }
  .brand-mark {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--accent);
    color: var(--accent-contrast);
    font-size: 0.95rem;
    font-weight: 800;
  }
  .brand-name {
    color: var(--text-primary);
  }
  .brand-accent {
    color: var(--accent);
  }
  header nav {
    display: flex;
    gap: 1.5rem;
  }
  header nav a {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s;
  }
  header nav a:hover {
    color: var(--accent-hover);
  }
  header nav a[aria-current] {
    color: var(--accent);
    font-weight: 600;
  }
  .docs-grid {
    display: grid;
    grid-template-columns: 250px minmax(0, 820px) 200px;
    gap: 3rem;
    max-width: 1440px;
    margin: auto;
    padding: 2.5rem 3rem;
  }
  .sidebar {
    align-self: start;
    position: sticky;
    top: 2rem;
  }
  .eyebrow {
    font: 700 0.7rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    color: var(--accent);
    text-transform: uppercase;
    margin: 0 0 0.5rem;
  }
  .sidebar h2 {
    font-size: 1.3rem;
    margin: 0 0 1.25rem;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    font-weight: 750;
  }
  input {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-primary);
    border-radius: 8px;
    font: inherit;
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
  }
  input::placeholder {
    color: var(--text-tertiary);
  }
  input:hover {
    border-color: var(--accent);
  }
  input:focus-visible, input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 107, 115, 0.2);
  }
  .nav-group {
    margin: 1.5rem 0;
  }
  .nav-group h3 {
    color: var(--text-secondary);
    text-transform: uppercase;
    font: 700 0.68rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    margin: 0 0 0.5rem;
  }
  .nav-group a {
    display: block;
    padding: 0.45rem 0.7rem;
    margin: 0.15rem 0;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--text-secondary);
    transition: background-color 0.15s, color 0.15s;
  }
  .nav-group a:hover {
    background: var(--nav-hover);
    color: var(--text-primary);
  }
  .nav-group a.active {
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 600;
  }
  .source-link {
    display: inline-block;
    color: var(--text-secondary);
    font-size: 0.75rem;
    margin-top: 1rem;
    text-decoration: none;
  }
  .source-link:hover {
    color: var(--accent);
    text-decoration: underline;
  }
  .no-results {
    color: var(--text-tertiary);
    font-size: 0.85rem;
  }
  main {
    min-width: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  }
  .doc-meta {
    display: flex;
    gap: 1rem;
    color: var(--accent);
    text-transform: uppercase;
    font: 700 0.68rem ui-monospace, monospace;
    letter-spacing: 0.08em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
    margin-bottom: 1.8rem;
  }
  .meta-group {
    background: var(--accent-soft);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: var(--accent);
  }
  .meta-count {
    color: var(--text-secondary);
    padding: 0.2rem 0;
  }
  .prose {
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--text-primary);
    overflow-wrap: anywhere;
  }
  .prose :global(h1) {
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    line-height: 1.15;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin: 0 0 1.25rem;
    font-weight: 800;
  }
  .prose :global(h2) {
    color: var(--text-primary);
    font-size: 1.4rem;
    letter-spacing: -0.02em;
    margin: 2.25rem 0 0.85rem;
    line-height: 1.35;
    font-weight: 750;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.4rem;
  }
  .prose :global(h3), .prose :global(h4) {
    color: var(--text-primary);
    margin: 1.5rem 0 0.65rem;
    line-height: 1.4;
    font-weight: 700;
  }
  .prose :global(p) {
    color: var(--text-primary);
    margin: 1rem 0;
  }
  .prose :global(a) {
    color: var(--accent);
    text-underline-offset: 3px;
    text-decoration: underline;
  }
  .prose :global(a:hover) {
    color: var(--accent-hover);
  }
  .prose :global(strong) {
    color: var(--text-primary);
    font-weight: 650;
  }
  .prose :global(pre) {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.1rem;
    overflow-x: auto;
    white-space: pre;
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--text-primary);
  }
  .prose :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.88em;
  }
  .prose :global(:not(pre) > code) {
    background: var(--accent-soft);
    color: var(--accent);
    border-radius: 4px;
    padding: 0.15em 0.4em;
    font-weight: 600;
  }
  .prose :global(table) {
    display: table;
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin: 1.5rem 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .prose :global(th), .prose :global(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border: 1px solid var(--border);
  }
  .prose :global(th) {
    color: var(--text-primary);
    background: var(--bg);
    font-weight: 700;
  }
  .prose :global(tr:hover td) {
    background: var(--surface-hover);
  }
  .prose :global(blockquote) {
    margin: 1.25rem 0;
    padding: 0.5rem 1.25rem;
    border-left: 3px solid var(--accent);
    background: var(--accent-soft);
    color: var(--text-primary);
    border-radius: 0 6px 6px 0;
  }
  .prose :global(hr) {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
  }
  .prose :global(li) {
    margin: 0.35rem 0;
    color: var(--text-primary);
  }
  footer {
    margin-top: 3rem;
    border-top: 1px solid var(--border);
    padding-top: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.78rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  footer a {
    color: var(--accent);
    text-decoration: none;
  }
  footer a:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }
  .toc {
    position: sticky;
    top: 2rem;
    align-self: start;
    border-left: 1px solid var(--border);
    padding-left: 1.25rem;
  }
  .toc h2 {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    margin: 0 0 0.85rem;
    font-weight: 700;
  }
  .toc a {
    display: block;
    color: var(--text-secondary);
    font-size: 0.76rem;
    text-decoration: none;
    line-height: 1.5;
    padding: 0.25rem 0;
    transition: color 0.15s;
  }
  .toc a:hover {
    color: var(--accent);
  }
  .toc .subheading {
    padding-left: 0.75rem;
    color: var(--text-tertiary);
  }
  .toc .subheading:hover {
    color: var(--accent);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  @media (max-width: 1200px) {
    .docs-grid {
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 2rem;
    }
    .toc {
      display: none;
    }
  }
  @media (max-width: 760px) {
    header {
      height: auto;
      min-height: 70px;
      padding: 1rem 1.5rem;
      flex-wrap: wrap;
    }
    header nav {
      gap: 1rem;
    }
    .docs-grid {
      padding: 1.5rem 1rem;
      grid-template-columns: 1fr;
    }
    .sidebar {
      position: static;
    }
    .sidebar nav {
      max-height: 230px;
      overflow-y: auto;
      border-bottom: 1px solid var(--border);
    }
    main {
      padding: 1.5rem;
    }
  }
</style>
