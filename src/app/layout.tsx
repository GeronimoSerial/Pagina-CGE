import "./index.css"
import Footer from '../modules/layout/Footer'
import Header from '../modules/layout/Header'
import { montserrat } from '../styles/fonts'
import metadata from './metadata'

export {metadata}

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