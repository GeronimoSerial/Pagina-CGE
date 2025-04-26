import type {Metadata} from 'next'
import "./index.css"
import Footer from '../modules/layout/Footer'
import Header from '../modules/layout/Header'
import { montserrat } from '../styles/fonts'


export const metadata: Metadata = {
    title: 'My App',
    description: 'My app is a..'
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
        <Header/>
          <div id="root">{children}</div>
        <Footer/>
        </body>
      </html>
    )
  }