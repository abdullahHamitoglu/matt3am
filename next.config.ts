import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  images: {
    domains: ['placehold.co'],
  },

  // Turbopack configuration for Next.js >= 15.3.x
  turbopack: {
    rules: {
      ...codeInspectorPlugin({
        bundler: 'turbopack',
        hotKeys: ['altKey'],
      }),
    },
  },

  // Your Next.js config here
  webpack: (config, { dev, isServer }) => {
    if (dev) {
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
