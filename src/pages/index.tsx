import { CONFIG } from '@/config'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon, Loader2, LockKeyhole, Mail } from 'lucide-react'

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (e: any) => {
    e?.preventDefault();
    setError(null)
    setLoading(true)
    const formData: any = Object.fromEntries(new FormData(e.target))
    try {
      const payload = {
        ...formData
      }
      const result = await axios.post(CONFIG.base_url_api + '/user/admin/login', payload, {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh"
        }
      })
      setCookie('session', JSON.stringify(result.data?.user))
      setLoading(false)
      router.push('/main/dashboard')
    } catch (error: any) {
      console.log(error);
      setLoading(false)
      setError(error?.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.")
    }
  }

  return (
    <div className='min-h-screen lg:flex'>
      <Head>
        <title>Login Admin - Tokonyang</title>
      </Head>

      {/* Brand panel - left */}
      <div className='relative w-full bg-[#1e3a5f] lg:w-[45%] lg:flex lg:flex-col lg:justify-between lg:p-12 hidden lg:block overflow-hidden'>
        {/* Decorative blobs */}
        <div className='absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10' />
        <div className='absolute -bottom-32 -left-16 w-[28rem] h-[28rem] rounded-full bg-[#132a45]/50' />
        <div className='absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-400/10 blur-2xl' />

        <div className='relative'>
          <Image alt='icon-logo' src={'/images/tokonyang.png'} width={100} height={100} className='w-20 h-20' />
        </div>

        <div className='relative space-y-6'>
          <h2 className='text-white font-bold text-4xl leading-tight'>Selamat datang kembali</h2>
          <p className='text-slate-300 text-lg max-w-md leading-relaxed'>
            Kelola toko, produk, dan pelanggan Anda dari satu tempat.
          </p>
        </div>

        <div className='relative flex items-center gap-3 text-slate-400 text-sm'>
          <span className='w-px h-10 bg-white/20' />
          <p className='max-w-xs' suppressHydrationWarning>Tokonyang Admin &copy; {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Form panel - right */}
      <div className='w-full min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 lg:px-8'>
        <div className='w-full max-w-md'>
          {/* Mobile brand */}
          <div className='lg:hidden flex flex-col items-center mb-8'>
            <Image alt='icon-logo' src={'/images/tokonyang.png'} width={72} height={72} className='w-18 h-18' />
            <h1 className='mt-4 text-2xl font-bold text-gray-900'>Selamat datang kembali</h1>
            <p className='mt-1 text-sm text-gray-500'>Masuk untuk mengelola toko Anda</p>
          </div>

          {/* Desktop heading */}
          <div className='hidden lg:block mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>Masuk</h1>
            <p className='mt-2 text-gray-500'>Masukkan akun admin Anda untuk melanjutkan.</p>
          </div>

          {error && (
            <div className='mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2' role='alert'>
              <span className='mt-0.5'>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={login} className='space-y-4' noValidate>
            <div>
              <label htmlFor='identity' className='block text-sm font-medium text-gray-700 mb-1.5'>
                Email / No Telepon
              </label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  id='identity'
                  name='identity'
                  type='text'
                  autoComplete='username'
                  placeholder='Masukkan email atau no telepon'
                  required
                  className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:outline-none transition'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                {/* <a href='#' className='text-sm text-[#1e3a5f] hover:text-[#132a45] font-medium'>
                  Lupa Password?
                </a> */}
              </div>
              <div className='relative'>
                <LockKeyhole className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  id='password'
                  name='password'
                  type={show ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Masukkan password'
                  required
                  className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:outline-none transition'
                />
                <button
                  type='button'
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1'
                >
                  {show ? <EyeOffIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='mt-2 w-full rounded-lg bg-[#1e3a5f] hover:bg-[#2a4a73] active:bg-[#132a45] disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-semibold text-white transition flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Menunggu...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-xs text-gray-400' suppressHydrationWarning>
            &copy; 2024 Tokonyang. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  )
}
