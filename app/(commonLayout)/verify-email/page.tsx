import AuthPageShell from "@/components/auth/AuthPageShell";
import VerifyEmailForm from "@/components/pages/verify-email/VerifyEmailForm";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email || "";

  return (
    <AuthPageShell mode="forgot" title="ইমেইল ভেরিফিকেশন" subtitle="আপনার ইমেইল ভেরিফাই করার জন্য ওটিপি কোড দিন">
      <VerifyEmailForm email={email} />
    </AuthPageShell>
  );
}
