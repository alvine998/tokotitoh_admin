import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import RootLayout from './layout';
import LayoutDashboard from '@/components/layout/LayoutDashboard';
import NextNProgress from 'nextjs-progressbar'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return !router.pathname?.includes('login') ?
    <RootLayout>
      <NextNProgress color="#265fa3" nonce="my-nonce" />
      <LayoutDashboard session={pageProps?.session}>
        <Component {...pageProps} />
      </LayoutDashboard>
    </RootLayout>
    :
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
}
