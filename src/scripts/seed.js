import 'dotenv/config'
import mongoose from 'mongoose'
import dbConnect from '../lib/mongodb.js'
import Library from '../models/Library.js'
import Bookshelf from '../models/Bookshelf.js'
import Book from '../models/Book.js'

const LIBRARIES = [
  {
    name: "세종도서관",
    image: "/images/sejong-library.png"
  },
  {
    name: "대지중학교 도서관",
    image: "/images/daeji-library.png"
  },
  {
    name: "홍익대학교 중앙도서관",
    image: "/images/hongik-library.png"
  }
]

const BOOKSHELF_NAMES = [
  "문학",
  "과학",
  "역사",
  "예술",
  "철학"
]

const SAMPLE_BOOKS = [
  "해리포터와 마법사의 돌",
  "반지의 제왕",
  "어린왕자",
  "데미안",
  "1984",
  "위대한 개츠비",
  "동물농장",
  "호빗",
  "노인과 바다",
  "페르마의 마지막 정리",
  "코스모스",
  "사피엔스",
  "이기적 유전자",
  "총균쇠",
  "침묵의 봄"
]

async function seed() {
  try {
    await dbConnect()

    await Library.deleteMany({})
    await Bookshelf.deleteMany({})
    await Book.deleteMany({})

    const libraries = await Library.insertMany(LIBRARIES)

    for (const library of libraries) {
      const bookshelves = await Bookshelf.insertMany(
        BOOKSHELF_NAMES.map(name => ({
          name,
          libraryId: library._id
        }))
      )

      for (const bookshelf of bookshelves) {
        const numBooks = Math.floor(Math.random() * 6) + 5
        const books = Array(numBooks).fill(null).map(() => ({
          title: SAMPLE_BOOKS[Math.floor(Math.random() * SAMPLE_BOOKS.length)],
          status: Math.random() > 0.3 ? '대출가능' : '대출중',
          bookshelfId: bookshelf._id,
          libraryId: library._id
        }))
        await Book.insertMany(books)
      }
    }

    console.log('Seed 완료!')
    console.log(`${LIBRARIES.length}개의 도서관이 생성되었습니다.`)
    console.log(`각 도서관마다 ${BOOKSHELF_NAMES.length}개의 책장이 생성되었습니다.`)

  } catch (error) {
    console.error('Seed 실패:', error)
  } finally {
    await mongoose.disconnect()
  }
}

seed() 
