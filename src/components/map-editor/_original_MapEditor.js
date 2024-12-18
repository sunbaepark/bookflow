/*
'use client'

import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image, Rect, Group, Text } from 'react-konva'

const iconSources = {
  start: '/icons/start-marker.png',
  end: '/icons/end-marker.png',
  shelf: '/icons/bookshelf.png',
  selectedShelf: '/icons/selected-bookshelf.png'
}

const ICON_SIZE = {
  start: 36,
  end: 36,
  shelf: 36
};

export default function MapEditor({ onClose }) {
  const FIXED_GRID_SIZE = 20
  const [library, setLibrary] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageObj, setImageObj] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [cellSize, setCellSize] = useState({ width: 0, height: 0 })
  const [gridData, setGridData] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const [markers, setMarkers] = useState({
    start: null,
    end: null
  })
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [nextShelfNumber, setNextShelfNumber] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const containerRef = useRef(null)

  const handleContextMenu = (e) => {
    e.preventDefault() // 기본 컨텍스트 메뉴 방지
    
    if (selectedShelf) {
      setSelectedShelf(null)
      setShelves(shelves.map(shelf => ({
        ...shelf,
        isSelected: false
      })))
    }
    
    if (selectedTool) {
      setSelectedTool(null)
    }
  }

  // 초기 데이터 로딩
  useEffect(() => {
    const libraryId = new URLSearchParams(window.location.search).get('libraryId')
    if (!libraryId) return

    // 도서관 정보와 맵 데이터를 동시에 로드
    Promise.all([
      fetch(`/api/libraries/${libraryId}`).then(res => res.json()),
      fetch(`/api/maps?libraryId=${libraryId}`).then(res => res.json())
    ])
    .then(([libraryData, mapData]) => {
      setLibrary(libraryData)
      setMapData(mapData)

      if (mapData) {
        // 벽 데이터 설정
        if (mapData.walls) {
          setGridData(mapData.walls.map(row => 
            row.map(cell => cell === 1 ? 'wall' : null)
          ))
        } else {
          initializeGridData()
        }

        // 시작점 설정
        if (mapData.start && cellSize.width && cellSize.height) {
          setMarkers(prev => ({
            ...prev,
            start: {
              x: mapData.start.x * cellSize.width,
              y: mapData.start.y * cellSize.height
            }
          }))
        }

        // 도착점 설정
        if (mapData.end && cellSize.width && cellSize.height) {
          setMarkers(prev => ({
            ...prev,
            end: {
              x: mapData.end.x * cellSize.width,
              y: mapData.end.y * cellSize.height
            }
          }))
        }

        // 책장 데이터 설정
        if (mapData.shelves && cellSize.width && cellSize.height) {
          const existingShelves = mapData.shelves.map(shelf => ({
            id: shelf.bookshelfId._id,
            number: shelf.number || nextShelfNumber,
            name: shelf.bookshelfId.name,
            category: shelf.bookshelfId.category || '미지정',
            x: shelf.x * cellSize.width,
            y: shelf.y * cellSize.height,
            isSelected: false
          }))
          setShelves(existingShelves)
          
          const maxNumber = Math.max(...existingShelves.map(s => s.number), 0)
          setNextShelfNumber(maxNumber + 1)
        }
      } else {
        initializeGridData()
      }
    })
    .catch(error => {
      console.error('데이터 로딩 중 오류:', error)
    })
  }, [cellSize.width, cellSize.height])

  // 맵 데이터 저장
  const saveMapData = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    const libraryId = new URLSearchParams(window.location.search).get('libraryId')
    const newMapData = {
      dimensions: {
        width: FIXED_GRID_SIZE,
        height: FIXED_GRID_SIZE
      },
      start: markers.start ? {
        x: Math.round(markers.start.x / cellSize.width),
        y: Math.round(markers.start.y / cellSize.height)
      } : null,
      end: markers.end ? {
        x: Math.round(markers.end.x / cellSize.width),
        y: Math.round(markers.end.y / cellSize.height)
      } : null,
      walls: gridData.map(row => 
        row.map(cell => cell === 'wall' ? 1 : 0)
      ),
      shelves: shelves.map(shelf => ({
        bookshelfId: shelf.id,
        x: Math.round(shelf.x / cellSize.width),
        y: Math.round(shelf.y / cellSize.height)
      }))
    }

    try {
      const response = await fetch('/api/maps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryId,
          mapData: newMapData
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || '맵 저장 실패')
      }

      setMapData(result)
      setSaveMessage({ type: 'success', text: '맵이 성공적으로 저장되었습니다.' })
    } catch (error) {
      console.error('맵 저장 중 오류:', error)
      setSaveMessage({ type: 'error', text: error.message || '맵 저장에 실패했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  // ... 나머지 코드는 그대로 유지 (handleMouseDown, handleMouseMove 등)

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">책장 배치 편집</h2>
            <p className="text-sm text-zinc-500 mt-1">{library?.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTool('start')}
              className={`px-4 py-2 rounded-lg ${
                selectedTool === 'start' ? 'bg-green-500 text-white' : 'bg-zinc-100'
              }`}
            >
              출발지점
            </button>
            <button
              onClick={() => setSelectedTool('end')}
              className={`px-4 py-2 rounded-lg ${
                selectedTool === 'end' ? 'bg-red-500 text-white' : 'bg-zinc-100'
              }`}
            >
              도착지점
            </button>
            <button
              onClick={() => setSelectedTool('shelf')}
              className={`px-4 py-2 rounded-lg ${
                selectedTool === 'shelf' ? 'bg-blue-500 text-white' : 'bg-zinc-100'
              }`}
            >
              책장
            </button>
            <button
              onClick={() => setSelectedTool('wall')}
              className={`px-4 py-2 rounded-lg ${
                selectedTool === 'wall' ? 'bg-zinc-800 text-white' : 'bg-zinc-100'
              }`}
            >
              장애물
            </button>
          </div>
        </div>
        <div 
          ref={containerRef} 
          className="h-[calc(100vh-88px)] overflow-auto p-6"
          onContextMenu={handleContextMenu}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="min-w-fit min-h-fit inline-block">
            <Stage 
              width={dimensions.width} 
              height={dimensions.height}
              onClick={(e) => {
                if (!selectedTool || selectedTool === 'wall') return;
                
                const stage = e.target.getStage();
                const pos = stage.getPointerPosition();
                
                if (selectedTool === 'start') {
                  setMarkers(prev => ({ ...prev, start: { x: pos.x, y: pos.y } }));
                } else if (selectedTool === 'end') {
                  setMarkers(prev => ({ ...prev, end: { x: pos.x, y: pos.y } }));
                }
              }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Layer>
                <Image
                  image={imageObj}
                  width={dimensions.width}
                  height={dimensions.height}
                  opacity={0.7}
                />
                {gridData.map((row, i) => 
                  row.map((cell, j) => (
                    <Rect
                      key={`${i}-${j}`}
                      x={j * cellSize.width}
                      y={i * cellSize.height}
                      width={cellSize.width}
                      height={cellSize.height}
                      stroke={selectedTool === 'wall' ? "rgba(0,0,0,0.05)" : "transparent"}
                      fill={cell === 'wall' ? 'rgba(0,0,0,0.3)' : 'transparent'}
                      onMouseDown={(e) => handleMouseDown(e, i, j)}
                      onMouseEnter={(e) => handleMouseEnter(e, i, j)}
                    />
                  ))
                )}

                {markers.start && icons.start.image && (
                  <Image
                    image={icons.start.image}
                    x={markers.start.x}
                    y={markers.start.y}
                    width={icons.start.image.naturalWidth}
                    height={icons.start.image.naturalHeight}
                    offsetX={icons.start.image.naturalWidth / 2}
                    offsetY={icons.start.image.naturalHeight / 2}
                    draggable={selectedTool === 'start'}
                    onDragEnd={(e) => handleDragEnd(e, 'start')}
                    scaleX={ICON_SIZE.start / icons.start.image.naturalWidth}
                    scaleY={ICON_SIZE.start / icons.start.image.naturalHeight}
                  />
                )}

                {markers.end && icons.end.image && (
                  <Image
                    image={icons.end.image}
                    x={markers.end.x}
                    y={markers.end.y}
                    width={icons.end.image.naturalWidth}
                    height={icons.end.image.naturalHeight}
                    offsetX={icons.end.image.naturalWidth / 2}
                    offsetY={icons.end.image.naturalHeight / 2}
                    draggable={selectedTool === 'end'}
                    onDragEnd={(e) => handleDragEnd(e, 'end')}
                    scaleX={ICON_SIZE.end / icons.end.image.naturalWidth}
                    scaleY={ICON_SIZE.end / icons.end.image.naturalHeight}
                  />
                )}

                {shelves.map(shelf => (
                  <Group
                    key={shelf.id}
                    x={shelf.x}
                    y={shelf.y}
                    draggable={selectedTool === 'shelf'}
                    onDragEnd={(e) => handleDragEnd(e, 'shelf', shelf.id)}
                    onClick={() => {
                      if (selectedTool === 'shelf') {
                        handleShelfSelect(shelf.id);
                      }
                    }}
                  >
                    <Image
                      image={shelf.isSelected ? icons.selectedShelf.image : icons.shelf.image}
                      width={ICON_SIZE.shelf}
                      height={ICON_SIZE.shelf}
                      offsetX={ICON_SIZE.shelf / 2}
                      offsetY={ICON_SIZE.shelf / 2}
                      scaleX={1}
                      scaleY={1}
                      opacity={selectedTool === 'shelf' ? 1 : 0.6}
                    />
                    <Text
                      text={shelf.number.toString()}
                      fontSize={16}
                      fill="white"
                      width={ICON_SIZE.shelf}
                      height={ICON_SIZE.shelf}
                      offsetX={ICON_SIZE.shelf / 2}
                      offsetY={ICON_SIZE.shelf / 2}
                      align="center"
                      verticalAlign="middle"
                    />
                  </Group>
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      <div className="w-80 border-l flex flex-col h-screen">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">책장 정보</h3>
          <button
            onClick={addShelf}
            className="text-blue-500 hover:text-blue-700"
          >
            + 새 책장
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {shelves.map(shelf => (
              <div
                key={shelf.id}
                onClick={() => handleShelfSelect(shelf.id)}
                className={`p-4 rounded-lg border ${
                  shelf.isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">책장 {shelf.number}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShelves(shelves.filter(s => s.id !== shelf.id))
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    제거
                  </button>
                </div>
                <input
                  type="text"
                  value={shelf.category}
                  onChange={(e) => handleCategoryChange(e, shelf.id)}
                  onBlur={(e) => handleCategoryBlur(shelf.id, e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500"
                  placeholder="카테고리 입력"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={saveMapData}
            disabled={isSaving}
            className={`w-full py-2 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg relative`}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
          {saveMessage && (
            <div className={`mt-2 text-center text-sm ${
              saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
} 
*/ 