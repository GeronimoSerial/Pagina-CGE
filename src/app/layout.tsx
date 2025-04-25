import type {Metadata} from 'next'
import "./index.css"
import { Footer, Header } from '../modules/layout'


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
        <body>
        <Header/>
          <div id="root">{children}</div>
        <Footer/>
        </body>
      </html>
    )
  }