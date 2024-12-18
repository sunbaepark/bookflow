'use client'

import { useState, useEffect } from 'react'
import MapToolbar from './MapToolbar'
import MapCanvas from './MapCanvas'
import ShelfPanel from './ShelfPanel'
import { FIXED_GRID_SIZE } from './constants'
import { useMapData } from '@/hooks/useMapData'
import MapGrid from './MapGrid'

export default function MapEditor({ onClose }) {
  const libraryId = new URLSearchParams(window.location.search).get('libraryId')
  const { loading, error, library, mapData, bookshelves } = useMapData(libraryId)
  
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

  // 초기 데이터 로딩
  useEffect(() => {
    if (mapData) {
      // 시작점과 도착점 설정
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

  // useEffect 추가
  useEffect(() => {
    if (mapData?.dimensions) {
      const rows = Math.floor(mapData.dimensions.height / FIXED_GRID_SIZE)
      const cols = Math.floor(mapData.dimensions.width / FIXED_GRID_SIZE)
      
      // walls 데이터가 있으면 사용하고, 없으면 새로운 그리드 생성
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
    }
  }, [mapData])

  // 초기 그리드 데이터 생성
  const initializeGridData = () => {
    const cellSize = 30;
    const cols = Math.floor(dimensions.width / cellSize);
    const rows = Math.floor(dimensions.height / cellSize);
    
    setGridData(Array(rows).fill(null).map(() => Array(cols).fill(null)));
    setCellSize({ width: cellSize, height: cellSize });
  };

  // dimensions 변경시 그리드 초기화
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      initializeGridData();
    }
  }, [dimensions]);

  // 마우스 이벤트 핸들러들
  const handleMouseDown = (i, j) => {
    if (selectedTool !== 'wall') return;
    
    setIsDrawing(true);
    const newGridData = [...gridData];
    newGridData[i][j] = newGridData[i][j] === 'wall' ? null : 'wall';
    setGridData(newGridData);
  };

  const handleMouseEnter = (i, j) => {
    if (!isDrawing || selectedTool !== 'wall') return;
    
    const newGridData = [...gridData];
    newGridData[i][j] = newGridData[i][j] === 'wall' ? null : 'wall';
    setGridData(newGridData);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // 맵 데이터 저장
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
      console.log('저��된 데이터:', result)
      setSaveMessage({ type: 'success', text: '성공적으로 저장되었습니다.' })
    } catch (error) {
      console.error('저장 중 오류:', error)
      setSaveMessage({ type: 'error', text: error.message })
    } finally {
      setIsSaving(false)
    }
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
              setDimensions={setDimensions}
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
