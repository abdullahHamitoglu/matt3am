"use client";

import React from 'react'
import { LightLogo } from "@/components/icons/logo/light";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DrawerContent, Drawer, useDisclosure, DrawerHeader, DrawerBody, Listbox, ListboxItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import MobileSidebar from './MobileSidebar';
type Props = {
}

export const ItemCounter = ({ number, locale }: { number?: number, locale: string }) => (
    <div className="flex items-center gap-1 text-default-400">
        {number && <span className="text-small">{number}</span>}
        <Icon icon={`fluent:chevron-${locale === 'ar' ? 'left' : 'right'}-24-filled`} width="16" height="16" />
    </div>
);

const Header = (props: Props) => {
    const t = useTranslations();
    const path = usePathname();
    const theme = useTheme();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { locale } = useParams();

    const menu = [
        {
            name: t('services'),
            url: '/services'
        },
        {
            name: t('packages'),
            url: '/packages'
        },
        {
            name: t('about_us'),
            url: '/about'
        },
        // login 
        {
            name: t('login'),
            url: '/login',
            className: 'text-primary-500'
        }
    ]
    return (
        <Navbar shouldHideOnScroll maxWidth="2xl" classNames={{
            wrapper: 'px-0'
        }}>
            <NavbarBrand as={Link} href="/">
                <LightLogo />
            </NavbarBrand>
            <NavbarContent className={isMobile ? 'flex !justify-end pe-2' : 'flex !justify-end'}>
                {!isMobile &&
                    <>
                        {menu.map((item, index) => (
                            <NavbarItem key={index} isActive={path === item.url} className={item.className}>
                                <Link href={item.url || '#'}>{item.name}</Link>
                            </NavbarItem>
                        ))}
                        <NavbarItem>
                            <Button as={Link} color="primary" isIconOnly={isMobile} href="#" variant="faded" className="bg-primary-500 rounded-full text-white" endContent={<Icon icon="ph:seal-percent-duotone" width="25" height="25" />}>
                                {t('bookNow')}
                            </Button>
                        </NavbarItem>
                    </>
                }
                <MobileSidebar
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                    menu={menu}
                />
            </NavbarContent>
        </Navbar >
    )
}

export default Header