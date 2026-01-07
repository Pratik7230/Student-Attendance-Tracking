import { LoaderIcon } from 'lucide-react'
import React from 'react'

export default function AnimatedSpin({children,loading}) {
  return (
    loading ? <LoaderIcon className='animate-spin' /> : children
  )
}
