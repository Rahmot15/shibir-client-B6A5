import AuthPageShell from "@/components/auth/AuthPageShell";
import RegisterForm from "@/components/pages/register/RegisterForm";

export default function RegisterPage() {
	return (
		<AuthPageShell mode="register" title="অ্যাকাউন্ট তৈরি করুন" subtitle="নতুন সদস্য হিসেবে যোগ দিন">
			<RegisterForm />
		</AuthPageShell>
	);
}
