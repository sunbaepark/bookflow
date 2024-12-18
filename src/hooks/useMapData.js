import { useState, useEffect } from 'react'

export function useMapData(libraryId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [library, setLibrary] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [bookshelves, setBookshelves] = useState([])

  useEffect(() => {
    if (!libraryId) {
      setError('도서관 ID가 필요합니다')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // 1. 도서관 정보 가져오기
        console.log('도서관 정보 요청:', libraryId)
        const libraryRes = await fetch(`/api/libraries/${libraryId}`)
        
        if (!libraryRes.ok) {
          const errorData = await libraryRes.json()
          throw new Error(errorData.error || '도서관 정보를 가져오는데 실패했습니다')
        }
        
        const libraryData = await libraryRes.json()
        console.log('받은 도서관 데이터:', libraryData)
        setLibrary(libraryData)

        // 2. 맵 데이터 가져오기
        console.log('맵 데이터 요청')
        const mapRes = await fetch(`/api/maps?libraryId=${libraryId}`)
        if (!mapRes.ok) {
          throw new Error('맵 데이터를 가져오는데 실패했습니다')
        }
        const mapData = await mapRes.json()
        console.log('받은 맵 데이터:', mapData)
        setMapData(mapData)

        // 3. 책장 데이터 가져오기
        console.log('책장 데이터 요청')
        const bookshelvesRes = await fetch(`/api/bookshelves?libraryId=${libraryId}`)
        if (!bookshelvesRes.ok) {
          throw new Error('책장 정보를 가져오는데 실패했습니다')
        }
        const bookshelvesData = await bookshelvesRes.json()
        console.log('받은 책장 데이터:', bookshelvesData)
        setBookshelves(bookshelvesData)

      } catch (err) {
        console.error('데이터 로딩 오류:', err)
        console.error('에러 상세:', {
          message: err.message,
          stack: err.stack
        })
        setError(err.message)
        setMapData({
          dimensions: { width: 800, height: 600 },
          markers: { start: null, end: null },
          shelves: []
        })
        setBookshelves([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [libraryId])

  return { loading, error, library, mapData, bookshelves }
} 