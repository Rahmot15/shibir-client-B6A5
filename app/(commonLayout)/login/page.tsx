import AuthPageShell from "@/components/auth/AuthPageShell";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageShell mode="login" title="স্বাগতম!" subtitle="ইসলামী ছাত্রশিবির পোর্টালে লগইন করুন">
      <LoginForm />
    </AuthPageShell>
  );
}
