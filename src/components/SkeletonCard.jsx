import React from 'react'

const SkeletonCard = () => {
    return (
        <div className='bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10 animate-pulse'>
            <div className='w-full h-[300px] bg-gray-800 rounded-lg mb-4'></div>

            <div className='space-y-3'>
                <div className='h-4 bg-gray-800 rounded w-3/4'></div>

                <div className='flex items-center gap-2 mt-2'>
                    <div className='h-3 bg-gray-800 rounded w-8'></div>
                    <div className='h-3 bg-gray-800 rounded w-1 h-3 rounded-full'></div>
                    <div className='h-3 bg-gray-800 rounded w-12'></div>
                    <div className='h-3 bg-gray-800 rounded w-1 h-3 rounded-full'></div>
                    <div className='h-3 bg-gray-800 rounded w-10'></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard
