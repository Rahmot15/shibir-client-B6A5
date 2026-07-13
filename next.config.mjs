/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"plus.unsplash.com",
			"images.unsplash.com",
			"rokbucket.rokomari.io",
			"ecom.kishorkanthabd.com",
			"waflife-media.waflife.com",
			"wafilife-media.wafilife.com",
			"lh3.googleusercontent.com",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "rokbucket.rokomari.io",
			},
			{
				protocol: "https",
				hostname: "ecom.kishorkanthabd.com",
			},
			{
				protocol: "https",
				hostname: "waflife-media.waflife.com",
			},
			{
				protocol: "https",
				hostname: "wafilife-media.wafilife.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
	async rewrites() {
		const backendUrl =
			process.env.NEXT_PUBLIC_BACKEND_URL ||
			(process.env.NODE_ENV === "production"
				? "https://shibir-server.vercel.app"
				: "http://localhost:5000")

		return [
			{
				source: "/api/v1/:path*",
				destination: `${backendUrl}/api/v1/:path*`,
			},
		]
	},
}

export default nextConfig
