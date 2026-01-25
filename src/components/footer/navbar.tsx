"use client";

import React from 'react'
import { LightLogo } from "@/components/icons/logo/light";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DrawerContent, Drawer, useDisclosure, DrawerHeader, DrawerBody, Listbox, ListboxItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
type Props = {
}

export const ItemCounter = ({ number, locale }: { number?: number, locale: string }) => (
    <div className="flex items-center gap-1 text-default-400">
        {number && <span className="text-small">{number}</span>}
        <Icon icon={`fluent:chevron-${locale === 'ar' ? 'left' : 'right'}-24-filled`} width="16" height="16" />
    </div>
);

const FooterNavBar = (props: Props) => {
    const t = useTranslations();
    const path = usePathname();
    const theme = useTheme();

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
        {
            name: t('login'),
            url: '/login',
            className: 'text-primary-500'
        }
    ]
    return (
        <Navbar maxWidth="2xl" classNames={{
            base: 'md:block hidden',
            wrapper: 'px-0'
        }}>
            <NavbarContent >
                {menu.map((item, index) => index === 3 ? null : (
                    <NavbarItem key={index} isActive={path === item.url} className={item.className}>
                        <Link href={item.url || '#'}>{item.name}</Link>
                    </NavbarItem>
                ))}
                <div className='flex justify-center items-center gap-2 ms-auto'>
                    <NavbarItem isActive={path === menu[3].url} className={menu[3].className}>
                        <Link href={menu[3].url || '#'}>{menu[3].name}</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" variant="faded" className="bg-primary-500 rounded-full text-white" endContent={<Icon icon="ph:seal-percent-duotone" width="25" height="25" />}>
                            {t('bookNow')}
                        </Button>
                    </NavbarItem>
                </div>
            </NavbarContent>

        </Navbar>
    )
}

export default FooterNavBar