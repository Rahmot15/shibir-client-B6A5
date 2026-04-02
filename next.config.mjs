/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
	async rewrites() {
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

		return [
			{
				source: "/api/v1/:path*",
				destination: `${backendUrl}/api/v1/:path*`,
			},
		]
	},
}

export default nextConfig
