import { Skeleton } from "./skeleton"

export function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] p-4 space-y-4">
      {/* Chart header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      
      {/* Main chart area */}
      <Skeleton className="h-80 w-full" />
      
      {/* Chart controls/legend */}
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function WidgetSkeleton() {
  return (
    <div className="w-full h-full min-h-[300px] p-4">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export function TableLoadingSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Table header */}
      <div className="flex space-x-4 pb-2 border-b">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      
      {/* Table rows */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  )
}

export function CardLoadingSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
