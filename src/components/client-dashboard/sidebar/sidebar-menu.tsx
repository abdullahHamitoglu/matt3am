import React from 'react'

interface Props {
  title: string
  children?: React.ReactNode
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-normal text-default-500 dark:text-default-400 text-xs">{title}</span>
      {children}
    </div>
  )
}
