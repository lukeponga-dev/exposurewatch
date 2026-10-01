import { error } from "@sveltejs/kit";
import { documents, groups, renderDocument } from "$lib/docs";

export function load({ params }: { params: { slug: string } }) {
  const document = documents.find((item) => item.slug === params.slug);
  if (!document) error(404, "Documentation page not found");
  return {
    document: { title: document.title, slug: document.slug, path: document.path, group: document.group },
    documents: documents.map(({ title, slug, group }) => ({ title, slug, group })),
    groups,
    ...renderDocument(document),
  };
}
