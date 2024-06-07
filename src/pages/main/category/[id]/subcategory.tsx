import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import PropertyTabs from '@/components/tabs/PropertyTabs'
import { CONFIG } from '@/config'
import axios from 'axios'
import { EyeIcon, PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: any) {
    try {
        const { page, size, search } = context.query;
        const { id } = context.params;
        const result = await axios.get(CONFIG.base_url_api + `/subcategories?pagination=true&category_id=${id}&page=${+page - 1}&size=${size || 10}&search=${search || ""}`, {
            headers: {
                "bearer-token": "tokotitohapi",
                "x-partner-code": "id.marketplace.tokotitoh"
            }
        })
        const detail = await axios.get(CONFIG.base_url_api + `/categories?id=${id}`, {
            headers: {
                "bearer-token": "tokotitohapi",
                "x-partner-code": "id.marketplace.tokotitoh"
            }
        })
        return {
            props: {
                table: result?.data,
                detail: detail?.data?.items?.rows[0],
                id
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default function PropertyRoomType({ id, table, detail }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [filter, setFilter] = useState<any>(router.query);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const Column: any = [
        {
            name: "Nama",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "Aksi",
            selector: (row: any) => <div className='flex gap-2 flex-row'>
                <Button title='Edit' color='primary' type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                }}>
                    <PencilIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Hapus' color='danger' type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }}>
                    <TrashIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]

    const types = [
        { value: "homestay", label: "Homestay" },
        { value: "hotel", label: "Hotel" },
        { value: "villa", label: "Villa" }
    ]

    useEffect(() => {
        const queryFilter = new URLSearchParams(filter).toString();
        router.push(`?${queryFilter}`)
    }, [filter])

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                ...formData,
                category_id: id
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/subcategory`, payload, {
                    headers: {
                        "bearer-token": "tokotitohapi",
                        "x-partner-code": "id.marketplace.tokotitoh"
                    }
                })
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/subcategory`, payload, {
                    headers: {
                        "bearer-token": "tokotitohapi",
                        "x-partner-code": "id.marketplace.tokotitoh"
                    }
                })
            }
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Disimpan"
            })
            setModal({ ...modal, open: false })
            router.push(`/main/category/${id}/subcategory`)
        } catch (error) {
            console.log(error);
        }
    }
    const onRemove = async (e: any) => {
        try {
            e?.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target))
            const result = await axios.delete(CONFIG.base_url_api + `/subcategory?id=${formData?.id}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            })
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Dihapus"
            })
            setModal({ ...modal, open: false })
            router.push(`/main/category/${id}/subcategory`)
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <PropertyTabs id={id} detail={detail}>
            <h2 className='text-2xl font-semibold'>Sub Kategori</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' defaultValue={filter?.search} placeholder='Cari disini...' onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                    <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Sub Kategori
                        </Button>
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
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Sub Kategori</h2>
                        <form onSubmit={onSubmit}>
                            <Input label='Nama Sub Kategori' placeholder='Masukkan Nama Sub Kategori' name='name' defaultValue={modal?.data?.name || ""} required />
                            {
                                modal.key == "update" &&
                                <input type="hidden" name="id" value={modal?.data?.id || null} />
                            }
                            <div className='flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='info' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <SaveAllIcon className='w-4 h-4' />
                                        Simpan
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
                {
                    modal?.key == "delete" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Hapus Sub Kategori</h2>
                        <form onSubmit={onRemove}>
                            <input type="hidden" name="id" value={modal?.data?.id} />
                            <p className='text-center my-2'>Apakah anda yakin ingin menghapus data {modal?.data?.name}?</p>
                            <div className='flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='danger' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <Trash2Icon className='w-4 h-4' />
                                        Hapus
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
            </div>
        </PropertyTabs>
    )
}
