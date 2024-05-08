import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from '../Button';
import { ChevronLeft } from 'lucide-react';

export default function PropertyTabs({ children, id }: { children: ReactNode, id: any }) {
    const router = useRouter();
    console.log(router.pathname, 'path');
    const tabs = [
        {
            name: "Tipe",
            href: `/main/property/${id}/type`,
            active: 'type'
        },
        {
            name: "Fasilitas",
            href: `/main/property/${id}/facilities`,
            active: 'facilities'
        },
        {
            name: "Ruangan",
            href: `/main/property/${id}/room`,
            active: 'room'
        },
    ]

    const descdata = [
        { title: "Nama Properti", value: "Homestay Banyuwangi Indah 2" },
        { title: "Jenis Properti", value: "Homestay" },
        { title: "Status", value: "Aktif" },
        { title: "Nama PIC", value: "Alba" },
        { title: "Email PIC", value: "alba@gmail.com" },
        { title: "No Telepon PIC", value: "085746463535" },
    ]
    return (
        <div>
            <div className='flex'>
                <div>
                    <Button type='button' className={'flex gap-2'} color='white' onClick={() => {
                        router.push('/main/property')
                    }}>
                        <ChevronLeft />
                        Kembali
                    </Button>
                </div>
            </div>
            <div className='bg-white shadow-lg rounded w-full p-4 h-full'>
                <h5 className='font-semibold text-xl'>Detail Properti</h5>
                <div className='flex gap-2 justify-between items-center flex-wrap mt-4'>
                    {
                        descdata?.map((v: any) => (
                            <div key={v?.title} className='w-[300px] border-b border-b-gray-300 lg:mt-0 mt-2'>
                                <label htmlFor={v?.title} className='font-semibold'>{v?.title}</label>
                                <p className='text-sm mt-2' id={v?.title}>{v?.value}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='flex gap-2 lg:flex-wrap flex-nowrap lg:overflow-x-hidden overflow-x-auto mt-5'>
                {
                    tabs?.map((v: any) => (
                        <button key={v?.name} type='button' className={
                            router.pathname?.includes(v?.active) ?
                                `p-2 bg-blue-500 text-white rounded w-[200px]` :
                                `p-2 bg-blue-300 hover:bg-blue-500 text-white rounded w-[200px] duration-200 transition-all`}
                            onClick={() => router.push(v?.href)}
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
