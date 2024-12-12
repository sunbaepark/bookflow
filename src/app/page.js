import LibraryDropdown from '@/components/LibraryDropdown'
import Title from '@/components/title'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-center mb-8">
        <LibraryDropdown />
      </div>
      <Title />
    </main>
  )
}
