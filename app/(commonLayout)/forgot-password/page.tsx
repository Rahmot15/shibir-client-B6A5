import AuthPageShell from "@/components/auth/AuthPageShell";
import ForgotPasswordForm from "@/components/pages/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell mode="forgot" title="পাসওয়ার্ড পুনরুদ্ধার" subtitle="আপনার ইমেইল অ্যাড্রেসটি প্রদান করুন">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
