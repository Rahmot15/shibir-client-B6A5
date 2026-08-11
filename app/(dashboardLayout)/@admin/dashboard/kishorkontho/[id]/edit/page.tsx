import KishorkonthoForm from "@/components/dashboard/Admin/Kishorkontho/KishorkonthoForm"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

async function getIssue(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/v1/kishorkontho/${id}`, {
    cache: "no-store",
  })
  const data = await res.json()
  return data.success ? data.data : null
}

export default async function EditKishorkonthoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const issue = await getIssue(id)

  if (!issue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050f08]">
        <p className="text-emerald-200/60">সংখ্যা পাওয়া যায়নি</p>
      </div>
    )
  }

  const initialData = {
    title: issue.title,
    month: issue.month,
    year: issue.year,
    price: Number(issue.price),
    discount: issue.discount,
    coverImage: issue.coverImage,
    description: issue.description,
    slug: issue.slug,
    pdfFull: issue.pdfFull || "",
    pdfPreview: issue.pdfPreview || "",
    isFreePreview: issue.isFreePreview,
    purchaseType: issue.purchaseType,
    stock: issue.stock,
    isAvailable: issue.isAvailable,
    paymentMethods: issue.paymentMethods,
    subscriptionEligible: issue.subscriptionEligible,
    language: issue.language,
    publisherName: issue.publisherName,
    publisherOrg: issue.publisherOrg,
    editorName: issue.editorName,
    editorRole: issue.editorRole,
    tags: issue.tags,
    contents: issue.contents?.map((c: any) => ({
      type: c.type,
      title: c.title,
      author: c.author,
      page: c.page,
    })) || [],
  }

  return <KishorkonthoForm mode="edit" initialData={initialData} issueId={id} />
}
