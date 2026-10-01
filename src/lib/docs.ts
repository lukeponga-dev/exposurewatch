import { Marked, Renderer } from "marked";

const sources = import.meta.glob<string>(
  ["/docs/**/*.md", "/README.md", "/API-Reference.MD", "/server/README.md"],
  { query: "?raw", import: "default", eager: true },
);

function slug(path: string) {
  if (path === "/README.md") return "getting-started";
  if (path === "/API-Reference.MD") return "api-reference";
  if (path === "/server/README.md") return "backend";
  return path.replace(/^\/docs\//, "").replace(/\.md$/i, "").replace(/\/README$/i, "");
}

export const documents = Object.entries(sources).map(([path, content]) => ({
  slug: slug(path),
  path,
  title: content.match(/^#\s+(.+)$/m)?.[1] ?? slug(path),
  content,
  group: path.includes("/decisions/") ? "Decisions" : path === "/API-Reference.MD" || path === "/server/README.md" || path.endsWith("/api.md") || path.endsWith("/architecture.md") ? "Engineering" : "Project",
})).sort((a, b) => {
  const order = ["overview", "getting-started", "product-requirements", "roadmap", "architecture", "api", "backend", "api-reference", "operations", "decisions", "decisions/0001-exposure-level-contract"];
  return order.indexOf(a.slug) - order.indexOf(b.slug);
});

export const groups = ["Project", "Engineering", "Decisions"];

export function renderDocument(document: typeof documents[number]) {
  const headings: { id: string; text: string; level: number }[] = [];
  const usedIds = new Map<string, number>();
  const markdown = new Marked();
  const defaultRenderer = new Renderer();
  markdown.use({ renderer: {
    heading(token) {
      const base = token.text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "section";
      const count = usedIds.get(base) ?? 0;
      usedIds.set(base, count + 1);
      const id = count ? base + "-" + count : base;
      if (token.depth === 2 || token.depth === 3) headings.push({ id, text: token.text.replace(/[`*]/g, ""), level: token.depth });
      return '<h' + token.depth + ' id="' + id + '">' + this.parser.parseInline(token.tokens) + '</h' + token.depth + '>';
    },
    link(token) {
      const href = token.href;
      if (!/^(https?:|mailto:|#)/i.test(href)) {
        const resolved = new URL(href, "https://docs.local" + document.path);
        const target = documents.find((item) => item.path.toLowerCase() === decodeURIComponent(resolved.pathname).toLowerCase());
        if (target) token.href = "/docs/" + target.slug + resolved.hash;
        else token.href = "https://github.com/lukeponga-dev/exposurewatch/blob/main" + resolved.pathname + resolved.hash;
      }
      if (/^https:\/\/github.com\/lukeponga-dev\/exposurewatch\/README.md$/i.test(token.href)) token.href = "/docs/getting-started";
      if (!/^(https?:|mailto:|#|\/docs\/)/i.test(token.href)) token.href = "#";
      return defaultRenderer.link.call(this, token);
    },
    html(token) {
      // Repository Markdown remains text content; executable HTML is never embedded.
      return token.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
  }});
  return { html: markdown.parse(document.content) as string, headings };
}
