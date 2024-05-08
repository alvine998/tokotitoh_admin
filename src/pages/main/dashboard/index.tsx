import ApexChart from '@/components/Chart'
import React from 'react'

export default function index() {
    return (
        <div>

            <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                <p className='text-white text-xl'>Selamat Datang Admin</p>
            </div>

            <div className='flex gap-2 justify-between items-center mt-5'>
                <div className='bg-green-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Pengeluaran :</h5>
                    <p className='text-white text-xl'>Rp 10.000.000</p>
                </div>

                <div className='bg-orange-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Pendapatan :</h5>
                    <p className='text-white text-xl'>Rp 100.000.000</p>
                </div>
            </div>

            <div className='flex gap-2 justify-between items-center mt-5'>
                <div className='bg-green-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Pengguna :</h5>
                    <p className='text-white text-xl'>50</p>
                </div>

                <div className='bg-orange-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Properti :</h5>
                    <p className='text-white text-xl'>5</p>
                </div>

                <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Kamar :</h5>
                    <p className='text-white text-xl'>25</p>
                </div>

                <div className='bg-red-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Booking :</h5>
                    <p className='text-white text-xl'>125</p>
                </div>
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Perkembangan Pendapatan</h2>
                <ApexChart />
            </div>
        </div>
    )
}
