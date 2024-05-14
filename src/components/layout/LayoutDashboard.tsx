import NavbarDesktop from '@/components/navbar/NavbarDesktop'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import NavbarMobile from '../navbar/NavbarMobile'

export default function LayoutDashboard({ children, session }: { children: ReactNode, session: any }) {
    return (
        <section className='min-h-screen overflow-x-hidden relative'>
            <Head>
                <title>Dashboard - Tokotitoh</title>
            </Head>
            <div className='lg:block hidden'>
                <NavbarDesktop session={session}>
                    {children}
                </NavbarDesktop>
            </div>
            <div className='lg:hidden block'>
                <NavbarMobile session={session}>
                    {children}
                </NavbarMobile>
            </div>
        </section>
    )
}