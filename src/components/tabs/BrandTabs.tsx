import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from '../Button';
import { ChevronLeft } from 'lucide-react';

export default function BrandTabs({ children, id, detail }: { children: ReactNode, id: any, detail: any }) {
    const router = useRouter();

    return (
        <div>
            <div className='flex'>
                <div>
                    <Button type='button' className={'flex gap-2'} color='white' onClick={() => {
                        router.push(`/main/category/${id}/brand`)
                    }}>
                        <ChevronLeft />
                        Kembali
                    </Button>
                </div>
            </div>
            <div className='bg-white shadow-lg rounded w-full p-4 h-full'>
                <h5 className='font-semibold text-xl'>Tipe Brand {detail?.name}</h5>
            </div>
            <div className='mt-5'>
                {children}
            </div>
        </div>
    )
}
