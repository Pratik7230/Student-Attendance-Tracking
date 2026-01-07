import React from 'react'

function Card({icon,title,value}) {
  return (
    <div className='flex items-center gap-3 md:gap-5 p-4 md:p-7 bg-sky-100 rounded-lg shadow-sm'>
        <div className='p-2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-white text-primary flex-shrink-0'>
            {icon}
        </div>
        <div className='min-w-0 flex-1'>
            <h2 className='font-bold text-sm md:text-base'>{title}</h2>
            <h2 className='text-base md:text-lg'>{value}</h2>
        </div>
    </div>
  )
}

export default Card