/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'export', // Outputs a Single-Page Application (SPA).
    // distDir: './dist', // Changes the build output directory to `./dist/`.
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cms.geroserial.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
  }
   
  export default nextConfig