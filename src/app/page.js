import LibraryDropdown from '@/components/LibraryDropdown'
import Title from '@/components/title'
import BookSearch from '@/components/BookSearch'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-center mb-8">
        <LibraryDropdown />
      </div>
      <Title />
      <BookSearch />
    </main>
  )
}
