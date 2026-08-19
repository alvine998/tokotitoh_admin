import NavbarDesktop from '@/components/navbar/NavbarDesktop'
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import NavbarMobile from '../navbar/NavbarMobile'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'

export default function LayoutDashboard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [sessionData, setSessionData] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const sessions = getCookie('session')
        try {
            if (sessions && sessions !== 'undefined') {
                setSessionData(JSON.parse(sessions as string))
            }
        } catch (error) {
            console.error("Error parsing session:", error)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && !sessionData) {
            router.push("/")
        }
    }, [sessionData, mounted, router])

    if (!mounted) {
        return (
            <section className='min-h-screen bg-gray-100'>
                <Head>
                    <title>Dashboard - Tokotitoh</title>
                </Head>
            </section>
        )
    }

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
