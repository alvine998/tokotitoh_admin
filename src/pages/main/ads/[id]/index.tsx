import Button from '@/components/Button';
import Modal, { useModal } from '@/components/Modal';
import { CONFIG } from '@/config';
import { toMoney } from '@/utils';
import axios from 'axios';
import { CheckIcon, CheckSquareIcon, ChevronLeft, RecycleIcon, XIcon, XSquareIcon } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

export async function getServerSideProps(context: any) {
    try {
        const { id } = context.params;
        const detail = await axios.get(CONFIG.base_url_api + `/ads?id=${id}`, {
            headers: {
                "bearer-token": "tokotitohapi",
                "x-partner-code": "id.marketplace.tokotitoh"
            }
        })
        return {
            props: {
                detail: detail?.data?.items?.rows[0],
                id
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default function Detail({ detail }: any) {
    const router = useRouter();
    const [modal, setModal] = useState<useModal>()
    const [loading, setLoading] = useState<boolean>(false)


    const descdata: any = [
        { title: "Judul Iklan", value: detail?.title },
        { title: "Nama Pengiklan", value: detail?.user_name },
        { title: "Lokasi", value: `${detail?.district_name}, ${detail?.city_name}, ${detail?.province_name}` },
        { title: "Harga", value: toMoney(detail?.price) },
        { title: "Kategori", value: detail?.category_name },
        { title: "Sub Kategori", value: detail?.subcategory_name },
        { title: "Brand", value: detail?.brand_name || "-" },
        { title: "Tipe", value: detail?.type_name || "-" },
        { title: "Tahun", value: detail?.year || "-" },
        { title: "Transmisi", value: detail?.transmission || "-" },
        { title: "Trip KM", value: toMoney(detail?.km) || "-" },
        { title: "Aktif Sampai", value: moment(detail?.expired_on).format("DD-MM-YYYY") },
        { title: "Jenis Kepemilikan", value: detail?.ownership || "-" },
        { title: "Warna", value: detail?.color || "-" },
        { title: "Deskripsi", value: detail?.description },
    ]

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                id: detail?.id,
                status: modal?.key == "approved" ? 1 : 2,
                ...formData
            }
            const payload2 = {
                title: modal?.key == "approved" ? "Iklan Telah Tayang" : "Iklan Ditolak",
                content: `Iklan ${modal?.data?.title} telah ` + (modal?.key == "approved" ? "ditanyangkan" : "ditolak"),
                user_id: formData?.user_id
            }
            const result = await axios.patch(CONFIG.base_url_api + `/ads`, payload, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            })
            const result2 = await axios.post(CONFIG.base_url_api + `/notification`, payload2, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            })

            Swal.fire({
                icon: "success",
                text: "Data Berhasil Disimpan"
            })
            setLoading(false)
            setModal({ ...modal, open: false })
            router.push(`/main/ads/${detail?.id}`)
        } catch (error: any) {
            setLoading(false)
            console.log(error);
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.message
            })
        }
    }
    return (
        <div>
            <div className='flex'>
                <div>
                    <Button type='button' className={'flex gap-2'} color='white' onClick={() => {
                        router.push('/main/ads/waiting')
                    }}>
                        <ChevronLeft />
                        Kembali
                    </Button>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div className='my-2 flex items-center gap-4'>
                    <h5 className='text-lg font-semibold'>Status Iklan: {detail?.status == 0 ? "Menunggu" : detail?.status == 1 ? "Disetujui" : "Ditolak"}</h5>
                    {
                        detail?.status == 0 ?
                            <RecycleIcon className='text-blue-700' /> :
                            detail?.status == 1 ?
                                <CheckSquareIcon className='text-green-700' /> :
                                <XSquareIcon className='text-red-700' />
                    }
                </div>

                {
                    detail?.status == 0 ? (
                        <div className='flex gap-2'>
                            <Button type='button' onClick={() => {
                                setModal({ ...modal, open: true, data: detail, key: "approved" })
                            }} className={"p-2 flex items-center gap-2"}><CheckIcon /> Terima</Button>
                            <Button type='button' onClick={() => {
                                setModal({ ...modal, open: true, data: detail, key: "rejected" })
                            }} className={"p-2 flex items-center gap-2"} color='danger'><XIcon /> Tolak</Button>
                        </div>
                    ) : ""
                }

{
                    detail?.status == 1 ? (
                        <div className='flex gap-2'>
                            <Button type='button' onClick={() => {
                                setModal({ ...modal, open: true, data: detail, key: "rejected" })
                            }} className={"p-2 flex items-center gap-2"} color='danger'><XIcon /> Non Aktifkan</Button>
                        </div>
                    ) : ""
                }

            </div>
            <div className='py-4 flex gap-4 items-center overflow-y-auto'>
                {
                    JSON.parse(detail?.images)?.map((val: any, index: number) => (
                        <Image key={index} layout='relative' width={300} height={300} className='w-1/4 h-[300px]' alt='images' src={val} />
                    ))
                }
            </div>
            <div className='flex gap-2 justify-between items-center flex-wrap my-4'>
                {
                    descdata?.map((v: any) => (
                        <div key={v?.title} className='w-[300px] border-b border-b-gray-300 lg:mt-0 mt-2'>
                            <label htmlFor={v?.title} className='font-semibold'>{v?.title}</label>
                            <p className='text-sm mt-2' id={v?.title}>{v?.value}</p>
                        </div>
                    ))
                }
            </div>

            {
                modal?.key == "approved" || modal?.key == "rejected" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                    <h2 className='text-xl font-semibold text-center'>{modal.key == 'approved' ? `Verifikasi` : `Tolak Pengajuan`} Iklan</h2>
                    <form onSubmit={onSubmit}>
                        <input type="hidden" name="id" value={modal?.data?.id} />
                        <input type="hidden" name='user_id' value={modal?.data?.user_id} />
                        <p className='text-center my-2'>Apakah anda yakin ingin {modal.key == 'approved' ? "memverifikasi" : "tolak pengajuan"} iklan {modal?.data?.title}?</p>
                        <div className='flex gap-2 lg:flex-row flex-col-reverse justify-end'>
                            <div>
                                <Button color='white' type='button' onClick={() => {
                                    setModal({ open: false })
                                }}>
                                    Kembali
                                </Button>
                            </div>

                            <div>
                                {
                                    modal.key == "approved" ?
                                        <Button disabled={loading} className={'flex gap-2 px-2 items-center justify-center'}>
                                            <CheckIcon className='w-4 h-4' />
                                            {loading ? "Memverifikasi..." : "Verifikasi"}
                                        </Button> :
                                        <Button disabled={loading} color="danger" className={'flex gap-2 px-2 items-center justify-center'}>
                                            <XIcon className='w-4 h-4' />
                                            {loading ? "Memproses..." : "Tolak Iklan"}
                                        </Button>
                                }
                            </div>

                        </div>
                    </form>
                </Modal>
                    : ""
            }
        </div>
    )
}
