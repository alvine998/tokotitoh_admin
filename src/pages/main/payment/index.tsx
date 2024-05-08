import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'

const data: any = [
    {
        name: "Bank BCA",
        type: "bank",
        account_holder: "Alfa",
        account_number: "1234123412341234",
        bank: "bca",
        ewallet: "",
        qr_photo: "https://www.oreilly.com/api/v2/epubs/9781118370711/files/images/9781118370711-fg0101_fmt.png"
    }
]

export default function Payment() {
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [image, setImage] = useState<any>({
        preview: null,
        data: null
    })
    const [selected, setSelected] = useState<any>({
        type: 'bank',
        bank: ''
    })
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const Column: any = [
        {
            name: "Nama Pembayaran",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "Jenis Pembayaran",
            sortable: true,
            selector: (row: any) => row?.type?.toUpperCase() || "-"
        },
        {
            name: "No Rekening",
            selector: (row: any) => row?.account_number
        },
        {
            name: "Nama Pemilik Rekening",
            sortable: true,
            selector: (row: any) => row?.account_holder || "-"
        },
        {
            name: "QR Code",
            selector: (row: any) => row?.qr_photo ? <button type='button' onClick={() => {
                setModal({ ...modal, open: true, data: row, key: "view" })
            }}>
                <Image loader={() => row?.qr_photo} alt='qrcode' src={row?.qr_photo} width={200} height={200} />
            </button>
                : "-"
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                <Button title='Edit' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                    setImage({
                        preview: row?.qr_photo,
                        data: row?.qr_photo
                    })
                }}>
                    <PencilIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Hapus' color='danger' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }}>
                    <TrashIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]
    const types = [
        { value: "bank", label: "Bank" },
        { value: "qris", label: "QRIS" },
        { value: "ewallet", label: "E-Wallet" },
    ]

    const wallets = [
        { value: "dana", label: "Dana" },
        { value: "ovo", label: "Ovo" },
        { value: "gopay", label: "Gopay" },
        { value: "shopeepay", label: "ShopeePay" }
    ]

    const banks = [
        { value: "bca", label: "Bank BCA" },
        { value: "bni", label: "Bank BNI" },
        { value: "mandiri", label: "Bank Mandiri" },
        { value: "bri", label: "Bank BRI" },
        { value: "bsi", label: "Bank BSI" },
        { value: "cimb", label: "Bank CIMB Niaga" },
        { value: "ocbc", label: "Bank OCBC" },
        { value: "seabank", label: "Seabank" },
        { value: "permata", label: "Bank Permata" },
        { value: "bjb", label: "Bank BJB" },
        { value: "dki", label: "Bank DKI" },
        { value: "other", label: "Lainnya" },
    ]

    const handleUpload = (e: any) => {
        const file = e?.target?.files[0]
        if (file) {
            if (file?.size > 500000) {
                return Swal.fire({
                    icon: "warning",
                    text: "Ukuran gambar terlalu besar! Maksimal 500Kb"
                })
            }
            const objectUrl = URL.createObjectURL(file)
            setImage({
                preview: objectUrl,
                data: file
            })
        }
    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Pembayaran</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' />
                    </div>
                    <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                            setImage({
                                preview: null,
                                data: null
                            })
                        }}>
                            <PlusIcon className='w-4' />
                            Pembayaran
                        </Button>
                    </div>
                </div>
                <div className='mt-5'>
                    {
                        show &&
                        <DataTable
                            columns={Column}
                            data={data}
                            selectableRows
                            customStyles={CustomTableStyle}
                        />
                    }
                </div>
                {
                    modal?.key == "create" || modal?.key == "update" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Pembayaran</h2>
                        <form>
                            <div className='w-full my-2'>
                                <label className='text-gray-500' htmlFor="x">Jenis Pembayaran</label>
                                <ReactSelect
                                    options={types}
                                    defaultValue={{ value: modal?.data?.type || "bank", label: types?.find((v: any) => modal?.data?.type == v?.value)?.label || "Bank" }}
                                    required
                                    name='type'
                                    id='x'
                                    onChange={(e: any) => {
                                        setSelected({ type: e?.value })
                                    }}
                                />
                            </div>
                            {
                                selected?.type == "ewallet" ?
                                    <div className='w-full my-2'>
                                        <label className='text-gray-500' htmlFor="x">E-Wallet</label>
                                        <ReactSelect
                                            options={wallets}
                                            defaultValue={{ value: modal?.data?.ewallet || "dana", label: wallets?.find((v: any) => modal?.data?.ewallet == v?.value)?.label || "Dana" }}
                                            required
                                            name='ewallet'
                                            id='x'
                                            onChange={(e: any) => {
                                                setSelected({ ...selected, wallet: e?.value })
                                            }}
                                        />
                                    </div> : ""
                            }
                            {
                                selected?.type == "bank" ?
                                    <div className='w-full my-2'>
                                        <label className='text-gray-500' htmlFor="x">Bank</label>
                                        <ReactSelect
                                            options={banks}
                                            defaultValue={{ value: modal?.data?.name || "bca", label: banks?.find((v: any) => modal?.data?.name == v?.value)?.label || "Bank BCA" }}
                                            required
                                            name='name'
                                            id='x'
                                            onChange={(e: any) => {
                                                setSelected({ ...selected, bank: e?.value })
                                            }}
                                            maxMenuHeight={150}
                                        />
                                        {
                                            selected?.bank == "other" ?
                                                <Input label='Nama Bank' placeholder='Masukkan Nama Bank' name='name' defaultValue={modal?.data?.name || ""} required />
                                                : ""
                                        }
                                    </div> : ""
                            }
                            <Input label='No Rekening' placeholder='Masukkan No Rekening' name='account_number' type='number' defaultValue={modal?.data?.account_number || ""} required />
                            <Input label='Pemilik Rekening' placeholder='Masukkan Pemilik Rekening' name='account_holder' type='text' defaultValue={modal?.data?.account_holder || ""} required />
                            <Input label='QR Code' type='file' accept='image/*' onChange={handleUpload} />
                            {
                                image?.preview ?
                                    <div className='flex justify-center items-center'>
                                        {
                                            modal?.data?.qr_photo ?
                                                <Image loader={() => image?.preview} alt='qrcode' src={image?.preview} width={200} height={200} layout='relative' className='lg:w-[200px] lg:h-[200px]' />
                                                :
                                                <Image alt='qrcode' src={image?.preview} width={200} height={200} layout='relative' className='lg:w-[200px] lg:h-[200px]' />
                                        }
                                    </div> : ""
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
                        <h2 className='text-xl font-semibold text-center'>Hapus Pembayaran</h2>
                        <form>
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
                {
                    modal?.key == "view" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>QR CODE</h2>
                        <div className='flex justify-center items-center'>
                            <Image loader={() => modal?.data?.qr_photo} alt='qrcode' src={modal?.data?.qr_photo} width={300} height={300} layout='relative' className='lg:w-[300px] lg:h-[300px]' />
                        </div>
                        <div className='flex gap-2 lg:flex-row flex-col justify-end'>
                            <Button color='white' type='button' onClick={() => {
                                setModal({ open: false })
                            }}>
                                Tutup
                            </Button>
                        </div>
                    </Modal>
                        : ""
                }
            </div>
        </div>
    )
}
