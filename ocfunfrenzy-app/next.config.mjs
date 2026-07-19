import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.dirname(appRoot);

const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@connormccarl/nextos'],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;

