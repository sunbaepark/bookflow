'use client'

import { useState, useEffect } from 'react'
import MapToolbar from './MapToolbar'
import MapCanvas from './MapCanvas'
import ShelfPanel from './ShelfPanel'
import { FIXED_GRID_SIZE } from './constants'
import { useMapData } from '@/hooks/useMapData'

export default function MapEditor({ onClose }) {
  const [libraryId, setLibraryId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null)
  const [markers, setMarkers] = useState({ start: null, end: null })
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [gridData, setGridData] = useState([])
  const [cellSize, setCellSize] = useState({ width: 30, height: 30 })
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    // 클라이언트 환경에서만 window 사용
    if (typeof window !== 'undefined') {
      const id = new URLSearchParams(window.location.search).get('libraryId')
      setLibraryId(id)
    }
  }, [])

  const { loading, error, library, mapData, bookshelves } = useMapData(libraryId)

  useEffect(() => {
    if (mapData) {
      const initialMarkers = {
        start: mapData.markers?.start ? {
          x: mapData.markers.start.x,
          y: mapData.markers.start.y
        } : null,
        end: mapData.markers?.end ? {
          x: mapData.markers.end.x,
          y: mapData.markers.end.y
        } : null
      }
      setMarkers(initialMarkers)
    }
  }, [mapData])

  useEffect(() => {
    if (mapData?.dimensions) {
      const rows = Math.floor(mapData.dimensions.height / FIXED_GRID_SIZE)
      const cols = Math.floor(mapData.dimensions.width / FIXED_GRID_SIZE)
      
      if (mapData.walls) {
        setGridData(mapData.walls.map(row => 
          row.map(cell => cell === 1 ? 'wall' : null)
        ))
      } else {
        const newGridData = Array(rows).fill(null).map(() => 
          Array(cols).fill(null)
        )
        setGridData(newGridData)
      }

      setDimensions({ 
        width: mapData.dimensions.width, 
        height: mapData.dimensions.height 
      })
    }
  }, [mapData])

  // 초기 그리드 데이터 생성
  const initializeGridData = () => {
    if (!dimensions.width || !dimensions.height) return;
    const cSize = 30;
    const cols = Math.floor(dimensions.width / cSize);
    const rows = Math.floor(dimensions.height / cSize);
    
    const newGridData = Array(rows).fill(null).map(() => 
      Array(cols).fill(null)
    );
    setGridData(newGridData);
    setCellSize({ width: cSize, height: cSize });
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      initializeGridData();
    }
  }, [dimensions]);

  const handleMouseDown = (e, i, j) => {
    if (selectedTool !== 'wall') return;
    setIsDrawing(true);
    const newGridData = [...gridData];
    newGridData[i][j] = newGridData[i][j] === 'wall' ? null : 'wall';
    setGridData(newGridData);
  };

  const handleMouseEnter = (e, i, j) => {
    if (!isDrawing || selectedTool !== 'wall') return;
    const newGridData = [...gridData];
    newGridData[i][j] = newGridData[i][j] === 'wall' ? null : 'wall';
    setGridData(newGridData);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch(`/api/maps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryId,
          markers: {
            start: markers.start,
            end: markers.end
          },
          dimensions: mapData?.dimensions || { width: 800, height: 600 },
          walls: gridData.map(row => 
            row.map(cell => cell === 'wall' ? 1 : 0)
          ),
          shelves: shelves.map(shelf => ({
            bookshelfId: shelf.id,
            x: shelf.x,
            y: shelf.y
          }))
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '저장에 실패했습니다')
      }

      const result = await response.json()
      setSaveMessage({ type: 'success', text: '성공적으로 저장되었습니다.' })
    } catch (error) {
      console.error('저장 중 오류:', error)
      setSaveMessage({ type: 'error', text: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (!libraryId) {
    return <div>라이브러리 ID를 불러오는 중...</div>;
  }

  if (error) {
    return <div>도서관 정보를 가져오는 중 문제가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 overflow-hidden">
        <MapToolbar 
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          libraryName={library?.name}
          libraryImage={library?.image}
        />
        <div className="flex-1 flex">
          <div className="flex-1">
            <MapCanvas
              mapData={mapData}
              selectedTool={selectedTool}
              markers={markers}
              setMarkers={setMarkers}
              shelves={shelves}
              setShelves={setShelves}
              selectedShelf={selectedShelf}
              setSelectedShelf={setSelectedShelf}
              library={library}
              onMouseUp={handleMouseUp}
              gridData={gridData}
              handleMouseDown={handleMouseDown}
              handleMouseEnter={handleMouseEnter}
              dimensions={dimensions}
            />
          </div>
        </div>
      </div>
      <ShelfPanel
        shelves={shelves}
        setShelves={setShelves}
        selectedShelf={selectedShelf}
        setSelectedShelf={setSelectedShelf}
        bookshelves={bookshelves}
        onSave={handleSave}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />
    </div>
  )
}
