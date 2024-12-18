'use client'

import { Group, Image, Text } from 'react-konva'
import { useEffect, useState } from 'react'

const iconSources = {
  shelf: '/icons/bookshelf.png',
  selectedShelf: '/icons/selected-bookshelf.png'
}

export default function ShelfLayer({
  shelves,
  setShelves,
  selectedTool,
  selectedShelf,
  setSelectedShelf,
  cellSize
}) {
  const [icons, setIcons] = useState({ shelf: null, selectedShelf: null })

  useEffect(() => {
    const loadImage = (key, src) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        setIcons(prev => ({ ...prev, [key]: img }))
      }
    }
    loadImage('shelf', iconSources.shelf)
    loadImage('selectedShelf', iconSources.selectedShelf)
  }, [])

  const handleDragEnd = (e, shelfId) => {
    const { x, y } = e.target.position()
    setShelves(shelves.map(s => s.id === shelfId ? { ...s, x, y } : s))
  }

  const handleClick = (shelfId) => {
    if (selectedTool === 'shelf') {
      setSelectedShelf(shelfId)
    }
  }

  return (
    <>
      {shelves.map(shelf => (
        <Group
          key={shelf.id}
          x={shelf.x}
          y={shelf.y}
          draggable={selectedTool === 'shelf'}
          onDragEnd={(e) => handleDragEnd(e, shelf.id)}
          onClick={() => handleClick(shelf.id)}
        >
          {icons[shelf.id === selectedShelf ? 'selectedShelf' : 'shelf'] && (
            <Image
              image={icons[shelf.id === selectedShelf ? 'selectedShelf' : 'shelf']}
              width={36}
              height={36}
              offsetX={18}
              offsetY={18}
              opacity={selectedTool === 'shelf' ? 1 : 0.8}
            />
          )}
          <Text
            text={shelf.number?.toString() || ''}
            fontSize={16}
            fill="white"
            width={36}
            height={36}
            offsetX={18}
            offsetY={18}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      ))}
    </>
  )
}
