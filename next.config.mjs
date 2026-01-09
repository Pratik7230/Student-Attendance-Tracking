/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['gravatar.com', 'lh3.googleusercontent.com'],
    },
    // Exclude puppeteer/chromium from serverless bundle for Vercel
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push(
          'puppeteer',
          'puppeteer-core',
          '@sparticuz/chromium',
          'chrome-aws-lambda'
        );
      }
      return config;
    },
  };
  
  export default nextConfig;
  