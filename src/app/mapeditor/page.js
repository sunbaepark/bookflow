'use client'

import MapEditor from '@/components/map-editor/MapEditor'
import { useSearchParams, useRouter } from 'next/navigation'

export default function MapEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const libraryId = searchParams.get('libraryId')

  if (!libraryId) {
    return <div>잘못된 접근입니다.</div>
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="min-h-screen min-w-[1024px] bg-white flex flex-col">
      <div className="flex-1 overflow-auto">
        <MapEditor onClose={handleClose} />
      </div>
    </div>
  )
}