import "./globals.css"

export const metadata = {
  title: "Bookflow",
  description: "A service that visualizes the optimal routes for librarians to shelve returned books or retrieve reserved books, enhancing productivity in their tasks.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
