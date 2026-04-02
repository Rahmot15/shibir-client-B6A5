"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import WorkerReportClient from "./_components/WorkerReportClient";
import RouteLoadingView from "@/components/shared/fallback/RouteLoadingView";

const ALLOWED_REPORT_ROLES = ["WORKER", "MEMBER", "ASSOCIATE"] as const;

export default function ReportPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect to login if not authenticated
		if (!loading && !user) {
			router.replace("/login");
		}

		if (!loading && user && !ALLOWED_REPORT_ROLES.includes(user.role as (typeof ALLOWED_REPORT_ROLES)[number])) {
			if (user.role === "SUPPORTER") {
				router.replace("/dashboard/report");
				return;
			}

			router.replace("/dashboard/overview");
		}
	}, [user, loading, router]);

	// Show loading state while checking auth
	if (loading) {
		return <RouteLoadingView />;
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
