import NavbarDesktop from '@/components/navbar/NavbarDesktop'
import Head from 'next/head'
import React, { ReactNode, useEffect } from 'react'
import NavbarMobile from '../navbar/NavbarMobile'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'

export default function LayoutDashboard({ children }: { children: ReactNode }) {
    const router = useRouter();
    let sessionData: any = null
    const sessions = getCookie('session')

    try {
        if (sessions && sessions !== 'undefined') {
            sessionData = JSON.parse(sessions as string)
        }
    } catch (error) {
        console.error("Error parsing session:", error)
    }

    useEffect(() => {
        if (!sessionData) {
            router.push("/")
        }
    }, [sessionData, router])

    return (
        <section className='min-h-screen overflow-x-hidden relative'>
            <Head>
                <title>Dashboard - Tokotitoh</title>
            </Head>
            <div className='lg:block hidden'>
                <NavbarDesktop session={sessionData}>
                    {children}
                </NavbarDesktop>
            </div>
            <div className='lg:hidden block'>
                <NavbarMobile session={sessionData}>
                    {children}
                </NavbarMobile>
            </div>
        </section>
    )
}