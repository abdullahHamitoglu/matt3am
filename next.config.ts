import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  images: {
    domains: ['placehold.co'],
  },

  // Turbopack configuration for Next.js >= 15.3.x
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
      editor: 'code',
      hotKeys: ['altKey'],
    }),
  },

  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
