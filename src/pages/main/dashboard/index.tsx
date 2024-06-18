import ApexChart from '@/components/Chart'
import { CONFIG } from '@/config';
import axios from 'axios';
import React from 'react'

export async function getServerSideProps(context: any) {
    try {
        const { page, size } = context.query;
        const [brands, categories, reports, users, ads] = await Promise.all([
            axios.get(CONFIG.base_url_api + `/brands?page=0&size=${size || 999999}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            }),
            axios.get(CONFIG.base_url_api + `/categories?page=0&size=${size || 999999}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            }),
            axios.get(CONFIG.base_url_api + `/reports?page=0&size=${size || 999999}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            }),
            axios.get(CONFIG.base_url_api + `/users?role=customer&page=0&size=${size || 999999}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            }),
            axios.get(CONFIG.base_url_api + `/ads?status=1&page=0&size=${size || 999999}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            }),
        ])
        return {
            props: {
                brands: brands?.data?.items?.count,
                categories: categories?.data?.items?.count,
                users: users?.data?.items?.count,
                reports: reports?.data?.items?.count,
                ads: ads?.data?.items?.count,
            }
        }
    } catch (error) {
        console.log(error);
        return {
            props: {

            }
        }
    }
}

export default function Dashboard({ brands, categories, users, reports, ads }: any) {
    return (
        <div>

            <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                <p className='text-white text-xl lg:text-left text-center'>Selamat Datang Admin</p>
            </div>

            <div className='flex lg:flex-row flex-col gap-2 justify-between items-center mt-5'>
                <div className='bg-green-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Pengguna :</h5>
                    <p className='text-white text-xl'>{users || 0}</p>
                </div>

                <div className='bg-orange-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Iklan Aktif :</h5>
                    <p className='text-white text-xl'>{ads || 0}</p>
                </div>

                <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Laporan :</h5>
                    <p className='text-white text-xl'>{reports || 0}</p>
                </div>

                <div className='bg-gray-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Brand :</h5>
                    <p className='text-white text-xl'>{brands || 0}</p>
                </div>

                <div className='bg-red-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Kategori :</h5>
                    <p className='text-white text-xl'>{categories || 0}</p>
                </div>
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Perkembangan Pengguna</h2>
                <ApexChart />
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Perkembangan Iklan</h2>
                <ApexChart />
            </div>
        </div>
    )
}
