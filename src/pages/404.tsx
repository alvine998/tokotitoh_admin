import Button from '@/components/Button'
import Image from 'next/image';
import { useRouter } from 'next/router'
import React from 'react'

export default function Error404() {
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center items-center'>
            <Image src={'/images/404.jpg'} alt='not-found' layout='relative' width={300} height={300} className='lg:w-[500px] w-full lg:h-auto' />
            <p className='text-xl font-semibold'>Halaman Tidak Ditemukan!</p>
            <div>
                <Button onClick={() => { router.push('/main/dashboard') }} color='warning' className={"px-2"}>Kembali</Button>
            </div>
        </div>
    )
}
