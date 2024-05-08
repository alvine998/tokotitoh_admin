import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { PencilIcon, PlusIcon, SaveAllIcon, TrashIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const data: any = [
    {
        name: "alfa",
        phone: "089975756474",
        email: "alfa@gmail.com",
        nik: "1234123412341234"
    }
]

export default function index() {
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const CustomerColumn: any = [
        {
            name: "Nama",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "No Telepon",
            selector: (row: any) => row?.phone
        },
        {
            name: "Email",
            sortable: true,
            selector: (row: any) => row?.email || "-"
        },
        {
            name: "NIK",
            sortable: true,
            selector: (row: any) => row?.nik || "-"
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                <Button title='Edit' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                }}>
                    <PencilIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Hapus' color='danger'>
                    <TrashIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Pelanggan</h2>

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
                            Pelanggan
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
                    modal?.open && <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Pelanggan</h2>
                        <form>
                            <div className='flex gap-2 lg:flex-row flex-col'>
                                <Input label='Nama' placeholder='Masukkan Nama' name='name' defaultValue={modal?.data?.name || ""} required />
                                <Input label='NIK' placeholder='Masukkan NIK' name='nik' defaultValue={modal?.data?.nik || ""} maxLength={16} />
                            </div>
                            <div className='flex gap-2 lg:flex-row flex-col'>
                                <Input label='No Telepon' placeholder='Masukkan No Telepon' name='phone' type='number' defaultValue={modal?.data?.phone || ""} required />
                                <Input label='Email' placeholder='Masukkan Email' name='email' type='email' defaultValue={modal?.data?.email || ""} />
                            </div>
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
                }
            </div>
        </div>
    )
}
