/** @type {import('next').NextConfig} */
const nextConfig = {
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
