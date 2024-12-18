'use client'
import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { useSearchParams } from 'next/navigation'
import { useLibrary } from '@/contexts/LibraryContext'

export default function RoutePage() {
  const searchParams = useSearchParams()
  const [selectedBooks, setSelectedBooks] = useState([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageObj, setImageObj] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { selectedLibrary, setSelectedLibrary } = useLibrary()
  const containerRef = useRef(null)
  const stageRef = useRef(null)

  // 컨테이너 크기에 따른 이미지 크기 계산
  const calculateDimensions = () => {
    if (!containerRef.current || !imageObj) return

    const container = containerRef.current
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    const imageRatio = imageObj.width / imageObj.height
    const containerRatio = containerWidth / containerHeight

    let width, height

    if (imageRatio > containerRatio) {
      width = containerWidth
      height = containerWidth / imageRatio
    } else {
      height = containerHeight
      width = containerHeight * imageRatio
    }

    setDimensions({ width, height })
  }

  useEffect(() => {
    console.log('selectedLibrary:', selectedLibrary)
    if (selectedLibrary?.image) {
      const image = new window.Image()
      image.src = selectedLibrary.image
      console.log('Loading image from:', selectedLibrary.image)
      image.onload = () => {
        setImageObj(image)
        setImageLoaded(true)
        console.log('Image loaded successfully')
      }
      image.onerror = (e) => {
        console.error('Image load failed:', e)
      }
    }
  }, [selectedLibrary])

  useEffect(() => {
    if (imageLoaded) {
      calculateDimensions()
      window.addEventListener('resize', calculateDimensions)
      return () => window.removeEventListener('resize', calculateDimensions)
    }
  }, [imageLoaded])

  useEffect(() => {
    const bookIds = searchParams.get('books')?.split(',') || []
    if (bookIds.length > 0 && selectedLibrary?._id) {
      fetch(`/api/books?libraryId=${selectedLibrary._id}&ids=${bookIds.join(',')}`)
        .then(res => res.json())
        .then(data => {
          setSelectedBooks(data)
        })
        .catch(error => {
          console.error('도서 정보 로딩 실패:', error)
        })
    }
  }, [searchParams, selectedLibrary])

  // 도서관 정보 가져오기
  useEffect(() => {
    const libraryId = searchParams.get('libraryId')
    if (libraryId) {
      fetch('/api/libraries')
        .then(res => res.json())
        .then(libraries => {
          const library = libraries.find(lib => lib._id === libraryId)
          if (library) {
            setSelectedLibrary(library)
          }
        })
        .catch(error => {
          console.error('도서관 정보 로딩 실패:', error)
        })
    }
  }, [searchParams])

  return (
    <main className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 도서관 지도 */}
          <div className="flex-1 bg-white border border-zinc-200 rounded-lg">
            <div className="h-[88px] p-6 border-b border-zinc-200 bg-zinc-900/95 rounded-t-lg">
              <h2 className="text-lg font-medium text-zinc-100">도서관 지도</h2>
              <p className="text-sm text-zinc-400 mt-1">{selectedLibrary?.name}</p>
            </div>
            <div
              ref={containerRef}
              className="w-full h-[60vh] lg:h-[calc(100vh-12rem)] flex items-center justify-center p-6"
            >
              {imageLoaded && dimensions.width > 0 && (
                <Stage
                  width={dimensions.width}
                  height={dimensions.height}
                  ref={stageRef}
                >
                  <Layer>
                    <Image
                      image={imageObj}
                      width={dimensions.width}
                      height={dimensions.height}
                      opacity={0.7}
                    />
                  </Layer>
                </Stage>
              )}
            </div>
          </div>

          {/* 경로 안내 */}
          <div className="lg:w-96 bg-white border border-zinc-200 rounded-lg">
            <div className="h-[88px] p-6 border-b border-zinc-200 bg-zinc-900/95 rounded-t-lg flex flex-col justify-center">
              <h2 className="text-lg font-medium text-zinc-100">이동 경로</h2>
              <p className="text-sm text-zinc-400 mt-1">
                총 {selectedBooks.length}개의 경유지
              </p>
            </div>
            <div className="divide-y divide-zinc-200">
              {selectedBooks.map((book, index) => (
                <div key={book._id} className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-zinc-900">{book.title}</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-zinc-500">
                          • 현재 위치: {book.shelf || '위치 정보 없음'}
                        </p>
                        <p className="text-sm text-zinc-500">
                          • 필요한 작업: {book.status === "대출가능" ? "대출하기" : "반납하기"}
                        </p>
                        <p className="text-sm text-zinc-500">
                          • 상태: {book.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
