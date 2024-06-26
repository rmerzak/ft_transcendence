const nextConfig = {
    headers: async function () {
      return [
        {
          source: '/dashboard/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization, X-Requested-With',
            },
            {
              key: 'Access-Control-Allow-Credentials',
              value: 'true',
            },
          ],
        },
      ];
    },
    env: {
      API_BASE_URL: process.env.SERVER_BACKEND,
      API_USER_VERIFY: process.env.USER_VERIFY,
      API_USER_FINISH_AUTH: process.env.USER_FINISH_AUTH,
      API_Cloudinary_URL: process.env.CLOUDINARY_URL,
      API_USER_LOGOUT: process.env.USER_API_USER_LOGOUT,
      API_FRONT_END: process.env.SERVER_FRONTEND,

    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.intra.42.fr',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'cdn.intra.42.fr',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'i.pravatar.cc',
          port: '',
          pathname: '/**',
        },
      ],
    },
    reactStrictMode: false,
};
  
  module.exports = nextConfig;
