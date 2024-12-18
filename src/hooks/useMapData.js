import { useState, useEffect } from 'react'

export function useMapData(libraryId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [library, setLibrary] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [bookshelves, setBookshelves] = useState([])

  useEffect(() => {
    if (!libraryId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const libRes = await fetch(`/api/libraries/${libraryId}`)
        if (!libRes.ok) {
          throw new Error('도서관 정보를 가져오는데 실패했습니다.')
        }
        const libData = await libRes.json()

        const mapRes = await fetch(`/api/maps?libraryId=${libraryId}`)
        if (!mapRes.ok) {
          throw new Error('맵 정보를 가져오는데 실패했습니다.')
        }
        const mapResData = await mapRes.json()

        const shelfRes = await fetch(`/api/bookshelves?libraryId=${libraryId}`)
        if (!shelfRes.ok) {
          throw new Error('책장 정보를 가져오는데 실패했습니다.')
        }
        const shelfData = await shelfRes.json()

        setLibrary(libData)
        setMapData(mapResData)
        setBookshelves(shelfData)
      } catch (err) {
        console.error('데이터 로딩 오류:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [libraryId])

  return { loading, error, library, mapData, bookshelves }
}
