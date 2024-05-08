import { HomeIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

export default function NavbarDesktop({ children, session }: { children: ReactNode, session: any }) {
    const router = useRouter();

    const navs = [
        {
            name: "Dashboard",
            href: `/main/dashboard`,
            icon: <HomeIcon />
        },
        {
            name: "Pelanggan",
            href: `/main/customer`,
            icon: <UserIcon />
        }
    ]
    return (
        <div className='overflow-hidden'>
            {/* Topbar */}
            <div className='bg-blue-500 w-full h-10'>

            </div>

            <div className='flex'>
                {/* Sidebar */}
                <div className='bg-blue-500 w-1/6 h-[100vh] absolute z-10 top-0 left-0 pt-2'>
                    <h2 className='text-white text-2xl text-center'>CAKAROOMS</h2>
                    <div className='flex flex-col mt-5'>
                        {
                            navs?.map((v: any) => (
                                <button
                                    key={v?.name}
                                    className={router.pathname.includes(v?.href) ? 'text-xl flex gap-2 bg-white p-2 text-blue-500 pl-10' : 'text-white text-xl flex gap-2 hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-10'}
                                    type='button'
                                    onClick={()=>{
                                        router.push(v?.href)
                                    }}
                                >
                                    {v?.icon}
                                    {v?.name}
                                </button>
                            ))
                        }
                    </div>

                </div>
                <main className='container mt-5 ml-[280px] px-10 h-[91vh] w-full overflow-y-auto'>
                    {children}
                </main>
            </div>

        </div>
    )
}
