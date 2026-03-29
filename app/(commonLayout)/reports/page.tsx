"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import SupporterReportClient from "./_components/SupporterReportClient";
import WorkerReportClient from "./_components/WorkerReportClient";
import MemberReportClient from "./_components/MemberReportClient";
import AssociateReportClient from "./_components/AssociateReportClient";
import AdminReportClient from "./_components/AdminReportClient";

export default function ReportPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect to login if not authenticated
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	// Show loading state while checking auth
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border border-[rgba(0,200,83,0.1)] border-t-[rgba(0,200,83,0.6)]" />
			</div>
		);
	}

	// If not authenticated, don't render (will redirect)
	if (!user) {
		return null;
	}

	// Role-based rendering
	const roleComponents: Record<string, React.ReactNode> = {
		SUPPORTER: <SupporterReportClient />,
		WORKER: <WorkerReportClient />,
		MEMBER: <MemberReportClient />,
		ASSOCIATE: <AssociateReportClient />,
		ADMIN: <AdminReportClient />,
	};

	return <>{roleComponents[user.role] || <SupporterReportClient />}</>;
}
