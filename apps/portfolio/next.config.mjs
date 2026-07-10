/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                "value": "frame-ancestors 'self' https://*.jeremiahgage.me https://*.jeremiah.dev https://dateinyourcircle.com https://vestry.church https://ozarkhighlandshepherds.com"              },
            ],
          },
        ];
    },
};

export default nextConfig;
