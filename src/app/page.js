import LibraryDropdown from '@/components/LibraryDropdown'
import Title from '@/components/title'
import BookSearch from '@/components/BookSearch'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="lg:mr-80">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <LibraryDropdown />
          </div>
          <Title />
        </div>
      </div>
      <BookSearch />
    </main>
  )
}
