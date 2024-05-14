import Button from '@/components/Button'
import Input from '@/components/Input'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function Login() {
    const router = useRouter();
    const [position, setPosition] = useState<string>('login')

    const login = async (e: any) => {
        e?.preventDefault();
        const formData: any = Object.fromEntries(new FormData(e.target))
        try {
            if (formData?.email !== "085703049632") {
                return Swal.fire({
                    icon: "error",
                    text: "Email / No Telepon tidak terdaftar!"
                })
            }
            if (formData?.password !== "admincaka123") {
                return Swal.fire({
                    icon: "error",
                    text: "Password Salah!"
                })
            }
            Swal.fire({
                icon: "success",
                text: "Selamat Datang Admin"
            })
            router.push('/main/dashboard')
        } catch (error) {
            console.log(error);
        }
    }
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
                            <form className='mt-4' onSubmit={login}>
                                <Input label='Email / No Telepon' placeholder='Masukkan Email / No Telepon' type='text' name='email' required />
                                <Input label='Password' placeholder='********' type='password' name='password' required />
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
                                <Input label='Nama' placeholder='Masukkan Nama' name='name' required />
                                <Input label='Email' placeholder='Masukkan Email' type='email' name='email' required />
                                <Input label='No Telepon' placeholder='Masukkan No Telepon' type='text' name='phone' maxLength={13} required />
                                <Input label='Password' placeholder='********' type='password' name='password' required />
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
