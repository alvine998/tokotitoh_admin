import ApexChart from '@/components/Chart'
import { CONFIG } from '@/config';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { BarChart3, Building2, FileText, FolderOpen, NewspaperIcon, Users } from 'lucide-react';
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

const statCards = [
    { key: 'users', label: 'Total Pengguna', icon: Users, color: 'bg-blue-50 text-blue-600', accent: 'bg-blue-600' },
    { key: 'ads', label: 'Iklan Aktif', icon: Building2, color: 'bg-green-50 text-green-600', accent: 'bg-green-600' },
    { key: 'reports', label: 'Total Laporan', icon: NewspaperIcon, color: 'bg-amber-50 text-amber-600', accent: 'bg-amber-600' },
    { key: 'brands', label: 'Total Brand', icon: FolderOpen, color: 'bg-purple-50 text-purple-600', accent: 'bg-purple-600' },
    { key: 'categories', label: 'Total Kategori', icon: FileText, color: 'bg-rose-50 text-rose-600', accent: 'bg-rose-600' },
]

export default function Dashboard({ brands, categories, users, reports, ads }: any) {
    const data: Record<string, number> = { users, ads, reports, brands, categories }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-2xl font-bold text-gray-900'>Selamat Datang, Admin</h1>
                <p className='mt-1 text-sm text-gray-500'>Berikut ringkasan aktivitas platform Anda hari ini.</p>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.key} className='bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3'>
                            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                                <Icon className='w-5 h-5' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-gray-900'>{data[card.key] || 0}</p>
                                <p className='text-sm text-gray-500 mt-0.5'>{card.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='bg-white rounded-xl border border-gray-200 p-5'>
                    <div className='flex items-center gap-2 mb-4'>
                        <BarChart3 className='w-5 h-5 text-gray-400' />
                        <h2 className='text-base font-semibold text-gray-900'>Perkembangan Pengguna</h2>
                    </div>
                    <ApexChart />
                </div>
                <div className='bg-white rounded-xl border border-gray-200 p-5'>
                    <div className='flex items-center gap-2 mb-4'>
                        <BarChart3 className='w-5 h-5 text-gray-400' />
                        <h2 className='text-base font-semibold text-gray-900'>Perkembangan Iklan</h2>
                    </div>
                    <ApexChart />
                </div>
            </div>
        </div>
    )
}
