import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const isDocker = process.env.DOCKER_BUILD === '1'

// Only import dev tooling when not building for Docker
let codeInspectorPlugin: any = null
if (!isDocker) {
  try {
    codeInspectorPlugin = (await import('code-inspector-plugin')).codeInspectorPlugin
  } catch {
    // code-inspector-plugin not available (production build)
  }
}

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  ...(isDocker ? { output: 'standalone' } : {}),

  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  images: {
    domains: ['placehold.co'],
  },

  // Turbopack configuration for Next.js >= 15.3.x (dev only)
  ...(codeInspectorPlugin
    ? {
        turbopack: {
          rules: {
            ...codeInspectorPlugin({
              bundler: 'turbopack',
              hotKeys: ['altKey'],
            }),
          },
        },
      }
    : {}),

  // Your Next.js config here
  webpack: (config, { dev }) => {
    if (dev && codeInspectorPlugin) {
      config.plugins.push(
        codeInspectorPlugin({
          bundler: 'webpack',
          hotKeys: ['altKey'],
        }),
      )
    }
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
