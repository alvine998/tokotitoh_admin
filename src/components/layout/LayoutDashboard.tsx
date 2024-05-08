import NavbarDesktop from '@/components/navbar/NavbarDesktop'
import Head from 'next/head'
import React, { ReactNode } from 'react'

export default function LayoutDashboard({ children, session }: { children: ReactNode, session: any }) {
    return (
        <section className='min-h-screen overflow-x-hidden relative'>
            <Head>
                <title>Dashboard - Cakarooms</title>
            </Head>
            <div className='lg:block hidden'>
                <NavbarDesktop session={session}>
                    {children}
                </NavbarDesktop>
            </div>
        </section>
    )
}