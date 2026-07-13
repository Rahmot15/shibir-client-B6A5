import AuthPageShell from "@/components/auth/AuthPageShell";
import ResetPasswordForm from "@/components/pages/reset-password/ResetPasswordForm";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email || "";

  return (
    <AuthPageShell mode="reset" title="পাসওয়ার্ড রিসেট" subtitle="নতুন পাসওয়ার্ড সেট করুন">
      <ResetPasswordForm email={email} />
    </AuthPageShell>
  );
}
