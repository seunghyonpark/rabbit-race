import './globals.css'
import { Bebas_Neue } from '@next/font/google'

const BebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebasNeue',
  weight: "400",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${BebasNeue.className}`} >{children}</body>
    </html>
  )
}
