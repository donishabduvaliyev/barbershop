import React from 'react';

export const Skeleton = ({ className = '' }) => (
    <div className={`skeleton rounded-md ${className}`} />
);

export const CatalogSkeleton = () => (
    <div className="pt-4 pb-4 px-4">
        {[0, 1, 2].map((row) => (
            <div key={row} className="mb-6">
                <div className="flex justify-between items-center mb-3 py-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex space-x-4 overflow-hidden">
                    {[0, 1, 2, 3].map((card) => (
                        <div key={card} className="min-w-[140px] rounded-xl overflow-hidden">
                            <Skeleton className="h-24 w-full rounded-none" />
                            <div className="p-2 space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export const BookingSkeleton = () => (
    <div className="p-4 max-w-md mx-auto min-h-screen">
        <div className="text-center mb-6">
            <Skeleton className="w-full h-48 rounded-lg mb-4" />
            <Skeleton className="h-6 w-40 mx-auto mb-2" />
            <Skeleton className="h-4 w-28 mx-auto" />
        </div>
        <div className="space-y-4">
            <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
        <div className="mt-8">
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 pb-28">
        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl my-4 shadow-sm">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
            {[0, 1].map((row) => (
                <div key={row} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="w-4 h-4" />
                </div>
            ))}
        </div>
    </div>
);
