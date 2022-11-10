import { Html, Head, Main, NextScript } from 'next/document'

const Header = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Put your Google photos into battle" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  </>
)

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Header />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
