import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { CONFIG } from '@/config'
import { storage } from '@/config/firebase'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { EyeIcon, PencilIcon, PlusIcon, SaveAllIcon, Search, Trash2Icon, TrashIcon } from 'lucide-react'
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
        const result = await axios.get(CONFIG.base_url_api + `/categories?pagination=true&page=${+page - 1}&size=${+size || 10}&search=${search || ""}`, {
            headers: {
                "bearer-token": "tokotitohapi",
                "x-partner-code": "id.marketplace.tokotitoh"
            }
        })
        console.log(result?.data);
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
    const [image, setImage] = useState<any>();
    const [progress, setProgress] = useState<any>();

    const handleImage = async (e: any) => {
        if (e.target.files) {
            const file = e.target.files[0]
            if (file?.size <= 500000) {
                const storageRef = ref(storage, `images/category/${file?.name}`);
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
            name: "Nama",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "Urutan Ke",
            sortable: true,
            selector: (row: any) => row?.seq
        },
        {
            name: "Ikon",
            sortable: true,
            selector: (row: any) => row?.icon ? <Image alt='icon' src={row?.icon} width={300} height={300} layout='relative' className='w-[100px] h-[100px] m-2' /> : "-"
        },
        {
            name: "Aksi",
            selector: (row: any) => <div className='flex gap-2 flex-row'>
                <Button title='Detail' color='warning' type='button' onClick={() => {
                    router.push(`/main/category/${row?.id}/subcategory`)
                }}>
                    <EyeIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Edit' color='primary' type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                    setImage(row?.icon)
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

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            if (!image) {
                return Swal.fire({
                    icon: "error",
                    text: "Icon Wajib Diisi"
                })
            }
            const payload = {
                icon: image,
                ...formData
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/category`, payload, {
                    headers: {
                        "bearer-token": "tokotitohapi",
                        "x-partner-code": "id.marketplace.tokotitoh"
                    }
                })
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/category`, payload, {
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
            setImage(null)
            setProgress(null)
            setModal({ ...modal, open: false })
            router.push('')
        } catch (error) {
            console.log(error);
        }
    }
    const onRemove = async (e: any) => {
        try {
            e?.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target))
            const result = await axios.delete(CONFIG.base_url_api + `/category?id=${formData?.id}`, {
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
            router.push('')
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Kategori</h2>

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
                            Kategori
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
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Kategori</h2>
                        <form onSubmit={onSubmit}>
                            <Input label='Nama Kategori' placeholder='Masukkan Nama Kategori' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='Urutan Tampil' placeholder='Masukkan Urutan Tampil' name='seq' defaultValue={modal?.data?.seq || ""} required />
                            <Input label='Icon' placeholder='Masukkan icon' type='file' onChange={handleImage} accept='image/*' />
                            {
                                progress && <p>Progress: {progress}%</p>
                            }
                            {
                                image && <a href={image} target='_blank' className='text-blue-500'>Lihat</a>
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
                        <h2 className='text-xl font-semibold text-center'>Hapus Kategori</h2>
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
        </div>
    )
}
