import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { CONFIG } from '@/config'
import { storage } from '@/config/firebase'
import { queryToUrlSearchParams } from '@/utils'
import { Textarea } from '@headlessui/react'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { EyeIcon, PencilIcon, PlusIcon, ReplyIcon, SaveAllIcon, Search, SendIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: any) {
    try {
        const { page, size, search } = context.query;
        const result = await axios.get(CONFIG.base_url_api + `/reports?pagination=true&page=${+page - 1}&size=${size || 10}&search=${search || ""}`, {
            headers: {
                "bearer-token": "tokotitohapi",
                "x-partner-code": "id.marketplace.tokotitoh"
            }
        })
        return {
            props: {
                table: result?.data
            }
        }
    } catch (error: any) {
        console.log(error);
        if (error?.response?.status == 401) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }
        return {
            props: {
                error: error?.response?.data?.message,
            }
        }
    }
}

export default function Category({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [filter, setFilter] = useState<any>(router.query)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    useEffect(() => {
        const queryFilter = new URLSearchParams(filter).toString();
        router.push(`?${queryFilter}`)
    }, [filter])
    const Column: any = [
        {
            name: "Iklan",
            sortable: true,
            selector: (row: any) => row?.ads_id + " - " + row?.ads_name
        },
        {
            name: "Nama Pengguna",
            sortable: true,
            selector: (row: any) => row?.user_name
        },
        {
            name: "Judul Laporan",
            sortable: true,
            selector: (row: any) => row?.title
        },
        {
            name: "Deskripsi",
            sortable: true,
            selector: (row: any) => <button className='text-blue-500' type='button' onClick={() => {
                setModal({ ...modal, open: true, data: row, key: "desc" })
            }} >Lihat</button>
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == 1 ? "Sudah Dibalas" : "Menunggu Tanggapan"
        },
        {
            name: "Aksi",
            selector: (row: any) => <div className='flex gap-2 flex-row'>
                {
                    row?.status == 0 ?
                        <Button title='Edit' color='primary' type='button' onClick={() => {
                            setModal({ ...modal, open: true, data: row, key: "update" })
                        }}>
                            <ReplyIcon className='text-white w-5 h-5' />
                        </Button> : ""
                }
            </div>
        },
    ]
    const params = queryToUrlSearchParams(router?.query)?.toString();
    const onSubmit = async (e: any) => {
        e?.preventDefault();
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                title: formData?.title,
                content: formData?.content,
                user_id: formData?.user_id
            }
            const payload2 = {
                id: formData?.id,
                status: formData?.status
            }
            const result = await axios.post(CONFIG.base_url_api + `/notification`, payload, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            })

            if (result) {
                await axios.patch(CONFIG.base_url_api + `/report`, payload2, {
                    headers: {
                        "bearer-token": "tokotitohapi",
                        "x-partner-code": "id.marketplace.tokotitoh"
                    }
                })
            }

            Swal.fire({
                icon: "success",
                text: "Data Berhasil Dikirim"
            })
            setLoading(false)
            setModal({ ...modal, open: false })
            router.push(`?${params}`)
        } catch (error) {
            console.log(error);
            setLoading(false)
            Swal.fire({
                icon: "error",
                text: "Gagal Data Berhasil Dikirim"
            })
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-semibold'>Laporan</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' defaultValue={filter?.search} onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                </div>
                <div className='mt-5'>
                    {
                        show &&
                        <DataTable
                            pagination
                            onChangePage={(pageData) => {
                                setFilter({ ...filter, page: pageData })
                            }}
                            onChangeRowsPerPage={(currentRow, currentPage) => {
                                setFilter({ ...filter, page: currentPage, size: currentRow })
                            }}
                            responsive={true}
                            paginationTotalRows={table?.items?.count}
                            paginationDefaultPage={1}
                            paginationServer={true}
                            striped
                            columns={Column}
                            data={table?.items?.rows}
                            customStyles={CustomTableStyle}
                        />
                    }
                </div>

                {
                    modal?.key == "create" || modal?.key == "update" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Balas Laporan</h2>
                        <form onSubmit={onSubmit}>
                            <Input label='Judul' name='title' placeholder='Masukkan judul balasan' required />
                            <Textarea
                                className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 my-4"
                                name='content'
                                placeholder='Ketik Disini...'
                                required
                            />
                            <input type="hidden" name="status" value={1} />
                            <input type="hidden" name="user_id" value={modal.data.user_id} />
                            <input type="hidden" name="id" value={modal.data.id} />
                            <div className='flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>
                                <div>
                                    <Button disabled={loading} color='info' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <SendIcon className='w-4 h-4' />
                                        {loading ? "Mengirim..." : "Kirim"}
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
                {
                    modal?.key == "desc" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Deskripsi Laporan</h2>
                        <p className='my-4'>{modal?.data?.description}</p>
                        <div className='flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end'>
                            <div>
                                <Button color='white' type='button' onClick={() => {
                                    setModal({ open: false })
                                }}>
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </Modal>
                        : ""
                }
            </div>
        </div>
    )
}
