import Button from '@/components/Button'
import Input from '@/components/Input'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Login() {
    const router = useRouter();
    const [position, setPosition] = useState<string>('login')
    return (
        <div className='flex'>
            <Head>
                <title>LOGIN</title>
            </Head>
            <div className='w-full bg-blue-500 h-[100vh] lg:flex flex-col gap-2 justify-center items-center hidden'>
                <h2 className='text-white font-bold text-3xl'>CAKAROOMS</h2>
                <p className='text-white'>Kelola Asset Propertimu Sekarang Juga!</p>
            </div>
            <div className='w-full bg-slate-50 h-[100vh] flex flex-col gap-2 justify-center items-center'>
                {
                    position == 'login' ?
                        <div className='border border-gray-200 shadow rounded lg:w-1/2 w-full px-10 h-auto p-4'>
                            <h2 className='text-center text-2xl font-semibold'>LOGIN</h2>
                            <form className='mt-4'>
                                <Input label='Email / No Telepon' placeholder='Masukkan Email / No Telepon' type='text' name='email' />
                                <Input label='Password' placeholder='********' type='password' name='password' />
                                <a href="#" className='flex justify-end text-blue-500 hover:text-blue-700 duration-150 transition-all'>Lupa Password?</a>
                                <div className='mt-5'>
                                    <Button color='info'>Masuk</Button>
                                    <p className='text-center'>Atau</p>
                                    <Button color='primary' type='button' onClick={() => { setPosition('register') }}>Daftar</Button>
                                </div>
                            </form>
                        </div>
                        :
                        <div className='border border-gray-200 shadow rounded lg:w-1/2 w-full px-10 h-auto p-4'>
                            <h2 className='text-center text-2xl font-semibold'>DAFTAR</h2>
                            <form className='mt-4'>
                                <Input label='Nama' placeholder='Masukkan Nama' name='name' />
                                <Input label='Email' placeholder='Masukkan Email' type='email' name='email' />
                                <Input label='No Telepon' placeholder='Masukkan No Telepon' type='text' name='phone' maxLength={13} />
                                <Input label='Password' placeholder='********' type='password' name='password' />
                                <div className='mt-5'>
                                    <Button color='info'>Daftar</Button>
                                    <p className='text-center'>Atau</p>
                                    <Button color='primary' type='button' onClick={() => { setPosition('login') }}>Login</Button>
                                </div>
                            </form>
                        </div>
                }

            </div>
        </div>
    )
}
