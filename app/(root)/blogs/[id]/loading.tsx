import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <Skeleton className="h-10 w-24 mb-6" />
            <Skeleton className="h-100 w-full mb-8" />
            <div className="space-y-4 flex flex-col">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="mt-8 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </main>
    )
}
export default Loading
