"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import WorkerReportClient from "./_components/WorkerReportClient";

const ALLOWED_REPORT_ROLES = ["WORKER", "MEMBER", "ASSOCIATE"] as const;

export default function ReportPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect to login if not authenticated
		if (!loading && !user) {
			router.push("/login");
		}

		if (!loading && user && !ALLOWED_REPORT_ROLES.includes(user.role as (typeof ALLOWED_REPORT_ROLES)[number])) {
			if (user.role === "SUPPORTER") {
				router.push("/dashboard/report");
				return;
			}

			router.push("/dashboard/overview");
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

	if (!ALLOWED_REPORT_ROLES.includes(user.role as (typeof ALLOWED_REPORT_ROLES)[number])) {
		if (user.role === "SUPPORTER") {
			return null;
		}

		return null;
	}

	return <WorkerReportClient />;
}
