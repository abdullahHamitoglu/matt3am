import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const isDocker = process.env.DOCKER_BUILD === '1'

// Only import dev tooling when not building for Docker
let codeInspectorPlugin: any = null
if (!isDocker) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    codeInspectorPlugin = require('code-inspector-plugin').codeInspectorPlugin
  } catch {
    // code-inspector-plugin not available (production build)
  }
}

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  // cleanDistDir: false keeps pre-created middleware stubs needed by Turbopack standalone
  ...(isDocker ? { output: 'standalone', cleanDistDir: false } : {}),

  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (config, { dev }) => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
