import { notFound } from "next/navigation";
import KisorkonthoDetailsClient from "@/components/pages/kisorkontho/KisorkonthoDetailsClient";
import { fetchKishorkonthoBySlug, fetchRelatedIssues } from "@/components/pages/kisorkontho/data";

type Params = {
  slug: string;
};

export default async function KisorkonthoDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const issue = await fetchKishorkonthoBySlug(slug);

  if (!issue) {
    notFound();
  }

  const related = await fetchRelatedIssues(slug, 3);

  return <KisorkonthoDetailsClient issue={issue} related={related} />;
}
