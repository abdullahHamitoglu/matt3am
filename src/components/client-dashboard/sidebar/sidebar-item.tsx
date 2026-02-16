import NextLink from 'next/link'
import React from 'react'
import { useSidebarContext } from '../layout/layout-context'
import clsx from 'clsx'

interface Props {
  title: string
  icon: React.ReactNode
  isActive?: boolean
  href?: string
}

export const SidebarItem = ({ icon, title, isActive, href = '' }: Props) => {
  const { collapsed, setCollapsed } = useSidebarContext()

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed()
    }
  }
  return (
    <NextLink href={href} className="active:bg-none max-w-full text-default-900">
      <div
        className={clsx(
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/30 [&_svg_path]:fill-primary-500 dark:[&_svg_path]:fill-primary-400'
            : 'hover:bg-default-100 dark:hover:bg-default-50/10',
          'flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]',
        )}
        onClick={handleClick}
      >
        <span className="">{icon}</span>
        <span className="text-default-900">{title}</span>
      </div>
    </NextLink>
  )
}
