'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Chapter } from '@/types'
import { updateReadingProgress } from '@/server/actions/books'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ReaderProps {
  bookId: string
  chapter: Chapter
  totalChapters: number
  currentChapterIndex: number
}

export function Reader({ bookId, chapter, totalChapters, currentChapterIndex }: ReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const saveProgress = async () => {
      if (progress > 0) {
        setIsSaving(true)
        try {
          await updateReadingProgress(bookId, chapter.id, Math.round(progress))
        } finally {
          setTimeout(() => setIsSaving(false), 500)
        }
      }
    }

    const timeoutId = setTimeout(saveProgress, 2000)
    return () => clearTimeout(timeoutId)
  }, [progress, bookId, chapter.id])

  const prevChapter = currentChapterIndex > 0
  const nextChapter = currentChapterIndex < totalChapters - 1

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground w-16 text-right">
          {Math.round(progress)}%
        </span>
        {isSaving && (
          <span className="text-xs text-muted-foreground">Saving...</span>
        )}
      </div>

      {/* Chapter Content */}
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6">{chapter.title}</h1>
          <Separator className="mb-6" />
          <div
            ref={contentRef}
            className="prose prose-zinc dark:prose-invert max-w-none max-h-[600px] overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {prevChapter && (
            <Button variant="outline" asChild>
              <Link href={`/app/books/${bookId}/chapters/${getChapterId(currentChapterIndex - 1)}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          Chapter {currentChapterIndex + 1} of {totalChapters}
        </span>
        <div>
          {nextChapter && (
            <Button asChild>
              <Link href={`/app/books/${bookId}/chapters/${getChapterId(currentChapterIndex + 1)}`}>
                Next Chapter
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  function getChapterId(index: number): string {
    // This would need to be passed down from the parent or stored differently
    // For now, we'll handle this via the page component
    return ''
  }
}
