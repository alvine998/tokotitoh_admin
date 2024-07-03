import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import PropertyTabs from '@/components/tabs/PropertyTabs'
import { CONFIG } from '@/config'
import { storage } from '@/config/firebase'
import { queryToUrlSearchParams } from '@/utils'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { CheckIcon, EyeIcon, PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'

const data: any = [
    {
        id: 1,
        name: "Toyota",
        show: 1,
        image: 'toyota.png'
    }
]

export async function getServerSideProps(context: any) {
    try {
        const { page, size, search, brand_id } = context.query;
        const { id } = context.params;
        const result = await axios.get(CONFIG.base_url_api + `/brands?pagination=true&category_id=${id}&page=${+page - 1}&size=${size || 10}&search=${search || ""}`, {
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

export default function PropertyRoom({ id, detail, table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
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
            name: "Logo",
            sortable: true,
            selector: (row: any) => row?.image ? <Image alt='image' src={row?.image} width={300} height={300} layout='relative' className='w-[100px] h-[100px] m-2' /> : "-"
        },
        {
            name: "Tipe",
            sortable: true,
            selector: (row: any) => <button type='button' onClick={() => {
                router.push(`/main/category/${id}/${row?.id}/type`)
            }} className='bg-blue-700 text-white p-2 rounded' >Lihat</button>
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == 1 ? "Ditampilkan" : "Tidak ditampilkan"
        },
        {
            name: "Aksi",
            selector: (row: any) => <div className='flex gap-2 flex-row'>
                <Button title='Edit' color='primary' type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                    setImage(row?.image)
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

    const [filter, setFilter] = useState<any>(router.query)
    const [image, setImage] = useState<any>();
    const [progress, setProgress] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const queryFilter = new URLSearchParams(filter).toString();
        router.push(`?${queryFilter}`)
    }, [filter])

    const handleImage = async (e: any) => {
        if (e.target.files) {
            const file = e.target.files[0]
            if (file?.size <= 500000) {
                const storageRef = ref(storage, `images/brand/${file?.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress);
                }, (error) => {
                    console.log(error);
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImage(downloadURL);
                    })
                })
            } else {
                return Swal.fire({
                    icon: "error",
                    text: "Ukuran Gambar Tidak Boleh Lebih Dari 500Kb"
                })
            }
        }
    }

    const params = queryToUrlSearchParams(router?.query)?.toString();

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                image: image,
                category_id: id,
                ...formData
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/brand`, payload, {
                    headers: {
                        "bearer-token": "tokotitohapi",
                        "x-partner-code": "id.marketplace.tokotitoh"
                    }
                })
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/brand`, payload, {
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
            setLoading(false)
            setImage(null)
            setProgress(null)
            setModal({ ...modal, open: false })
            router.push(`/main/category/${id}/brand?${params}`)
        } catch (error: any) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.message
            })
            console.log(error);
        }
    }
    const onRemove = async (e: any) => {
        e?.preventDefault();
        setLoading(true)
        try {
            const formData = Object.fromEntries(new FormData(e.target))
            const result = await axios.delete(CONFIG.base_url_api + `/brand?id=${formData?.id}`, {
                headers: {
                    "bearer-token": "tokotitohapi",
                    "x-partner-code": "id.marketplace.tokotitoh"
                }
            })
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Dihapus"
            })
            setLoading(false)
            setModal({ ...modal, open: false })
            router.push(`/main/category/${id}/brand?${params}`)
        }
        catch (error: any) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.message
            })
            console.log(error);
        }
    }

    return (
        <PropertyTabs id={id} detail={detail}>
            <h2 className='text-2xl font-semibold'>Brand</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' defaultValue={filter?.search} onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                    <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Brand
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
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Brand</h2>
                        <form onSubmit={onSubmit}>
                            <Input label='Nama Brand' placeholder='Masukkan Nama Brand' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='Logo' type='file' onChange={handleImage} accept='image/*' />
                            {
                                progress && <p>Progress: {progress}%</p>
                            }
                            {
                                image && <a href={image} target='_blank' className='text-blue-500'>Lihat</a>
                            }
                            {
                                modal.key == 'update' ?
                                    <div>
                                        <div className='w-full my-2'>
                                            <label className='text-gray-500' htmlFor="x">Tampilkan Logo Brand</label>
                                            <div className='flex gap-5'>
                                                <div className='flex gap-2'>
                                                    <input type='radio' name='status' value={'1'} defaultChecked={modal?.data?.status == 1} />
                                                    <span>Ya</span>
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input type='radio' name='status' value={'0'} defaultChecked={modal?.data?.status == 0} />
                                                    <span>Tidak</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : ""
                            }
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
                                    <Button disabled={loading} color='info' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <SaveAllIcon className='w-4 h-4' />
                                        {loading ? "Menyimpan..." : "Simpan"}
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
                {
                    modal?.key == "delete" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Hapus Brand</h2>
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
                                    <Button disabled={loading} color='danger' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <Trash2Icon className='w-4 h-4' />
                                        {loading ? "Menghapus..." : "Hapus"}
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
