'use client'

/**
 * DashboardSkeleton
 * Loading skeleton for dashboard while data is being fetched
 */

import React from 'react'
import { Card, CardBody, Skeleton } from '@heroui/react'

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="bg-background h-full min-h-screen">
      <div className="flex flex-col gap-8 mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-10 w-full max-w-[90rem]">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-64 h-10" />
          <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-96 h-5" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="bg-primary-200 dark:bg-primary-800 rounded-full w-1 h-6" />
            <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-32 h-7" />
          </div>
          <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-content1 shadow-md border-none w-full">
                <CardBody className="gap-4 p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col flex-1 gap-2">
                      <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-24 h-4" />
                      <Skeleton className="bg-default-300 dark:bg-default-700 rounded-lg w-32 h-8" />
                    </div>
                    <Skeleton className="bg-default-100 dark:bg-default-900 rounded-xl w-14 h-14" />
                  </div>
                  <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-20 h-6" />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="bg-success-200 dark:bg-success-800 rounded-full w-1 h-6" />
            <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-40 h-7" />
          </div>
          <Card className="bg-content1 shadow-md border-none w-full">
            <CardBody className="p-6">
              <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-full h-80" />
            </CardBody>
          </Card>
        </div>

        {/* Table Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="bg-warning-200 dark:bg-warning-800 rounded-full w-1 h-6" />
              <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-36 h-7" />
            </div>
            <Skeleton className="bg-primary-100 dark:bg-primary-900 rounded-lg w-24 h-6" />
          </div>
          <Card className="bg-content1 shadow-md border-none">
            <CardBody className="gap-3 p-4">
              {/* Table Header */}
              <div className="flex gap-4 bg-default-100 dark:bg-default-900 p-3 rounded-lg">
                <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-1/4 h-5" />
                <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-1/4 h-5" />
                <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-1/4 h-5" />
                <Skeleton className="bg-default-200 dark:bg-default-800 rounded-lg w-1/4 h-5" />
              </div>
              {/* Table Rows */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border-default-200 dark:border-default-700 last:border-0 border-b"
                >
                  <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-1/4 h-4" />
                  <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-1/4 h-4" />
                  <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-1/4 h-4" />
                  <Skeleton className="bg-default-100 dark:bg-default-900 rounded-lg w-1/4 h-4" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
