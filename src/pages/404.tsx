import Button from '@/components/Button'
import { useRouter } from 'next/router'
import React from 'react'

export default function index() {
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center items-center mt-[250px]'>
            <p className='text-xl font-semibold'>Halaman Tidak Ditemukan!</p>
            <div>
                <Button onClick={() => { router.push('/main/dashboard') }} color='warning' className={"px-2"}>Kembali</Button>
            </div>
        </div>
    )
}
