'use client';

interface SkeletonProps { width?: string | number; height?: string | number; className?: string; }

export function Skeleton({ width, height, className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
      style={{width, height}}
      aria-hidden='true'
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='space-y-2'>
        <Skeleton width={280} height={36} />
        <Skeleton width={200} height={20} />
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='card p-5 space-y-3'>
            <Skeleton width={20} height={20} />
            <Skeleton width={60} height={36} />
            <Skeleton height={16} />
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 card p-6 space-y-5'>
          <Skeleton width={160} height={24} />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton height={16} />
              <Skeleton height={8} className='rounded-full' />
              <Skeleton width={100} height={12} />
            </div>
          ))}
        </div>
        <div className='card p-6 space-y-4'>
          <Skeleton width={120} height={24} />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='p-3 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2'>
              <Skeleton height={16} />
              <Skeleton width={140} height={12} />
              <Skeleton width={100} height={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CoursesSkeleton() {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='space-y-2'>
        <Skeleton width={160} height={36} />
        <Skeleton width={220} height={20} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='card overflow-hidden'>
            <Skeleton className='rounded-none' height={176} />
            <div className='p-5 space-y-3'>
              <Skeleton width={120} height={12} />
              <Skeleton height={24} />
              <Skeleton height={16} />
              <Skeleton width='80%' height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobsSkeleton() {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='space-y-2'>
        <Skeleton width={160} height={36} />
        <Skeleton width={260} height={20} />
      </div>
      <div className='space-y-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='card p-5 flex gap-5'>
            <Skeleton width={28} height={28} className='flex-shrink-0' />
            <div className='flex-1 space-y-3'>
              <Skeleton width='60%' height={20} />
              <Skeleton width='40%' height={14} />
              <Skeleton height={14} />
              <Skeleton width='80%' height={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
