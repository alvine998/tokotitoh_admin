import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from '../Button';
import { ChevronLeft } from 'lucide-react';

export default function PropertyTabs({ children, id }: { children: ReactNode, id: any }) {
    const router = useRouter();
    console.log(router.pathname, 'path');
    const tabs = [
        {
            name: "Sub Kategori",
            href: `/main/category/${id}/subcategory`,
            active: 'subcategory'
        },
        {
            name: "Brand",
            href: `/main/category/${id}/brand`,
            active: 'brand'
        },
        {
            name: "Tipe",
            href: `/main/category/${id}/type`,
            active: 'type'
        },
    ]

    // const descdata = [
    //     { title: "Kategori", value: "Mobil" },
    // ]
    return (
        <div>
            <div className='flex'>
                <div>
                    <Button type='button' className={'flex gap-2'} color='white' onClick={() => {
                        router.push('/main/category')
                    }}>
                        <ChevronLeft />
                        Kembali
                    </Button>
                </div>
            </div>
            <div className='bg-white shadow-lg rounded w-full p-4 h-full'>
                <h5 className='font-semibold text-xl'>Detail Kategori Mobil</h5>
                {/* <div className='flex gap-2 justify-between items-center flex-wrap mt-4'>
                    {
                        descdata?.map((v: any) => (
                            <div key={v?.title} className='w-[300px] border-b border-b-gray-300 lg:mt-0 mt-2'>
                                <label htmlFor={v?.title} className='font-semibold'>{v?.title}</label>
                                <p className='text-sm mt-2' id={v?.title}>{v?.value}</p>
                            </div>
                        ))
                    }
                </div> */}
            </div>
            <div className='flex gap-2 lg:flex-wrap flex-nowrap lg:overflow-x-hidden overflow-x-auto mt-5'>
                {
                    tabs?.map((v: any) => (
                        <button key={v?.name} type='button' className={
                            router.pathname?.includes(v?.active) ?
                                `p-2 bg-blue-500 text-white rounded w-[200px]` :
                                `p-2 bg-blue-300 hover:bg-blue-500 text-white rounded w-[200px] duration-200 transition-all`}
                            onClick={() => router.push(v?.href, v?.href, { scroll: false })}
                        >
                            {v?.name}
                        </button>
                    ))
                }
            </div>
            <div className='mt-5'>
                {children}
            </div>
        </div>
    )
}
