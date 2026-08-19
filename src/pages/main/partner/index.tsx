import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { CONFIG } from '@/config'
import { storage } from '@/config/firebase'
import { queryToUrlSearchParams } from '@/utils'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { PencilIcon, PlusIcon, SaveAllIcon, Search, Trash2Icon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: any) {
    try {
        const { page, size } = context.query;
        const result = await axios.get(CONFIG.base_url_api + `/partners?pagination=true&page=${+page - 1}&size=${size || 10}`, {
            headers: { "bearer-token": "tokotitohapi" }
        })
        return {
            props: {
                table: result?.data
            }
        }
    } catch (error) {
        console.log(error);
        return {
            props: {}
        }
    }
}

export default function Partner({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [filter, setFilter] = useState<any>()
    const [image, setImage] = useState<any>();
    const [progress, setProgress] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false)

    const handleImage = async (e: any) => {
        if (e.target.files) {
            const file = e.target.files[0]
            if (file?.size <= 500000) {
                setProgress(0);
                setImage(null);
                const storageRef = ref(storage, `images/partner/${file?.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress);
                }, (error) => {
                    console.log(error);
                    setProgress(null);
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImage(downloadURL);
                        setProgress(null);
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
            if (!image) {
                return Swal.fire({
                    icon: "error",
                    text: "Logo Wajib Diisi"
                })
            }
            const payload = {
                logo: image,
                ...formData
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/partner`, { ...payload, id: formData?.id }, {
                    headers: { "bearer-token": "tokotitohapi" }
                })
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/partner`, payload, {
                    headers: { "bearer-token": "tokotitohapi" }
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
            router.push(`?${params}`)
        } catch (error) {
            console.log(error);
            setLoading(false)
            Swal.fire({
                icon: "error",
                text: "Gagal Menyimpan Data"
            })
        }
    }
    const onRemove = async (e: any) => {
        e?.preventDefault();
        setLoading(true)
        try {
            const formData = Object.fromEntries(new FormData(e.target))
            const result = await axios.delete(CONFIG.base_url_api + `/partner?id=${formData?.id}`, {
                headers: { "bearer-token": "tokotitohapi" }
            })
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Dihapus"
            })
            setLoading(false)
            setModal({ ...modal, open: false })
            router.push(`?${params}`)
        }
        catch (error: any) {
            setLoading(false)
            console.log(error);
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.message
            })
        }
    }
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
            name: "Kode",
            selector: (row: any) => row?.package_name
        },
        {
            name: "Logo",
            sortable: true,
            cell: (row: any) => row?.logo ? (
                <Image alt='logo' src={row?.logo} width={300} height={300} layout='relative' className='w-[100px] h-[100px] m-2 rounded-lg object-cover' />
            ) : (
                <span className="text-gray-400">-</span>
            )
        },
        {
            name: "Slogan",
            sortable: true,
            selector: (row: any) => row?.shortdesc || "-"
        },
        {
            name: "Aksi",
            right: true,
            cell: (row: any) => (
                <div className="flex gap-1">
                    <button
                        type="button"
                        title="Edit"
                        onClick={() => {
                            setModal({ ...modal, open: true, data: row, key: "update" })
                            setImage(row?.logo)
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Hapus"
                        onClick={() => setModal({ ...modal, open: true, data: row, key: "delete" })}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        },
    ]
    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mitra</h1>
                <p className="mt-1 text-sm text-gray-500">Kelola mitra dan partner bisnis.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Cari mitra..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <Button
                        type="button"
                        color="info"
                        size="auto"
                        className="flex gap-2 px-4 py-2 items-center"
                        onClick={() => setModal({ ...modal, open: true, data: null, key: "create" })}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Tambah Mitra
                    </Button>
                </div>
                <div className="p-4">
                    {show && (
                        <DataTable
                            pagination
                            onChangePage={(pageData) => setFilter({ ...filter, page: pageData })}
                            onChangeRowsPerPage={(currentRow, currentPage) => setFilter({ ...filter, page: currentPage, limit: currentRow })}
                            responsive={true}
                            paginationTotalRows={table?.items?.count}
                            paginationDefaultPage={1}
                            paginationServer={true}
                            columns={Column}
                            data={table?.items?.rows}
                            customStyles={CustomTableStyle}
                        />
                    )}
                </div>
            </div>

            {(modal?.key == "create" || modal?.key == "update") && (
                <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                    <h2 className="text-xl font-semibold text-center">{modal.key == 'create' ? "Tambah" : "Ubah"} Mitra</h2>
                    <form onSubmit={onSubmit} className="mt-4 space-y-4">
                        {modal.key == "update" && <input type="hidden" name="id" value={modal?.data?.id || null} />}
                        <Input label="Nama Mitra" placeholder="Masukkan Nama Mitra" name="name" defaultValue={modal?.data?.name || ""} required />
                        <Input label="Kode Mitra" placeholder="Masukkan Kode Mitra" name="package_name" defaultValue={modal?.data?.package_name || ""} />
                        <Input label="Logo" placeholder="Masukkan logo" type="file" onChange={handleImage} accept="image/*" />
                        {progress !== null && progress !== undefined && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                        {progress !== null && progress !== undefined && <p className="text-sm text-gray-600">{progress}%</p>}
                        {image && <a href={image} target="_blank" className="text-sm text-blue-500 hover:underline">Lihat gambar</a>}
                        <Input label="Slogan" placeholder="Masukkan Slogan" name="shortdesc" defaultValue={modal?.data?.shortdesc || ""} />
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button color="white" type="button" onClick={() => setModal({ open: false })}>
                                Kembali
                            </Button>
                            <Button disabled={loading} color="info" type="submit" className="flex gap-2 px-4 py-2 items-center">
                                <SaveAllIcon className="w-4 h-4" />
                                {loading ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal?.key == "delete" && (
                <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                    <h2 className="text-xl font-semibold text-center">Hapus Mitra</h2>
                    <form onSubmit={onRemove} className="mt-4">
                        <input type="hidden" name="id" value={modal?.data?.id} />
                        <p className="text-center my-4 text-gray-600">Apakah anda yakin ingin menghapus data <strong>{modal?.data?.name}</strong>?</p>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button color="white" type="button" onClick={() => setModal({ open: false })}>
                                Kembali
                            </Button>
                            <Button disabled={loading} type="submit" color="danger" className="flex gap-2 px-4 py-2 items-center">
                                <Trash2Icon className="w-4 h-4" />
                                {loading ? "Menghapus..." : "Hapus"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}
