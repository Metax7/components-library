/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://d1in1s7rt5h9uy.cloudfront.net/**")],
  },
  cacheComponents: true,
}

export default nextConfig
