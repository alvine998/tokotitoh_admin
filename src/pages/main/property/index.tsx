import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { EyeIcon, PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'

const data: any = [
    {
        id: 1,
        name: "Homestay Banyuwangi Indah 2",
        pic_name: "Alba",
        pic_phone: "089975756474",
        pic_email: "alba@gmail.com",
        pic_id: 1,
        type: "homestay",
        status: 1
    }
]

export default function Property() {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const CustomerColumn: any = [
        {
            name: "Nama Properti",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "Jenis Properti",
            sortable: true,
            selector: (row: any) => row?.type?.toUpperCase()
        },
        {
            name: "Nama PIC",
            sortable: true,
            selector: (row: any) => row?.pic_name || "-"
        },
        {
            name: "No Telepon PIC",
            selector: (row: any) => row?.pic_phone
        },
        {
            name: "Email PIC",
            sortable: true,
            selector: (row: any) => row?.pic_email || "-"
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == 1 ? "Aktif" : "Non Aktif"
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                <Button title='Detail' color='warning' type='button' onClick={() => {
                    router.push(`/main/property/${row?.id}/detail`)
                }}>
                    <EyeIcon className='text-white w-5 h-5' />
                </Button>
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
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Properti</h2>

            <div className='mt-5'>
                <div className='flex justify-between items-center'>
                    <div>
                        <Input label='' type='search' placeholder='Cari disini...' />
                    </div>
                    <div>
                        <Button type='button' color='info' className={'flex gap-2 px-2'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Properti
                        </Button>
                    </div>
                </div>
                {
                    show &&
                    <DataTable
                        columns={CustomerColumn}
                        data={data}
                        selectableRows
                        customStyles={CustomTableStyle}
                    />
                }
                {
                    modal?.key == "create" || modal?.key == "update" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Properti</h2>
                        <form>
                            <Input label='Nama Properti' placeholder='Masukkan Nama Properti' name='name' defaultValue={modal?.data?.name || ""} required />
                            <div className='w-full my-2'>
                                <label className='text-gray-500' htmlFor="x">Jenis Properti</label>
                                <ReactSelect
                                    options={types}
                                    defaultValue={{ value: modal?.data?.type || "homestay", label: types?.find((v: any) => modal?.data?.type == v?.value)?.label || "Homestay" }}
                                    required
                                    name='type'
                                    id='x'
                                />
                            </div>
                            <Input label='Nama PIC' placeholder='Masukkan Nama PIC' name='pic_name' type='email' defaultValue={modal?.data?.pic_name || ""} />
                            <Input label='No Telepon PIC' placeholder='Masukkan No Telepon PIC' name='pic_phone' type='number' defaultValue={modal?.data?.pic_phone || ""} required />
                            <Input label='Email PIC' placeholder='Masukkan Email PIC' name='pic_email' type='email' defaultValue={modal?.data?.pic_email || ""} />
                            {
                                modal?.key == "update" ?
                                    <div className='w-full my-2'>
                                        <label className='text-gray-500' htmlFor="x">Status</label>
                                        <div className='flex gap-5'>
                                            <div className='flex gap-2'>
                                                <input type='radio' name='status' value={'1'} defaultChecked={modal?.data?.status == 1} />
                                                <span>Aktif</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <input type='radio' name='status' value={'0'} defaultChecked={modal?.data?.status == 0} />
                                                <span>Non Aktif</span>
                                            </div>
                                        </div>
                                    </div>
                                    : ""
                            }
                            <input type="hidden" name="id" value={modal?.data?.id || ""} />
                            <div className='flex gap-2 lg:flex-row flex-col justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='info' className={'flex gap-2 px-2 items-center'}>
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
                        <h2 className='text-xl font-semibold text-center'>Hapus Properti</h2>
                        <form>
                            <input type="hidden" name="id" value={modal?.data?.id} />
                            <p className='text-center my-2'>Apakah anda yakin ingin menghapus data {modal?.data?.name}?</p>
                            <div className='flex gap-2 lg:flex-row flex-col justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='danger' className={'flex gap-2 px-2 items-center'}>
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
