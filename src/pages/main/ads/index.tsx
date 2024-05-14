import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { toMoney } from '@/utils'
import { CheckIcon, PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'

const data: any = [
    {
        id: 1,
        user_id: 1,
        user_name: "alfa",
        title: "Toyota Avanza 2012 Q",
        brand_id: 1,
        brand_name: "Toyota",
        type_id: 1,
        type_name: "Avanza",
        category_id: 1,
        category_name: "Mobil",
        subcategory_id: 1,
        subcategory_name: "Mobil Dijual",
        price: 87000000,
        description: "-",
        province_id: 1,
        province_name: "Jakarta",
        city_id: 1,
        city_name: "Jakarta Selatan",
        district_id: 1,
        district_name: "Menteng",
        images: [
            'image1.jpg',
            'image2.jpg'
        ],
        km: 90000,
        transmission: 'AT',
        year: 2012,
        plat_no: 'B-2345-UKC',
        color: "Hitam",
        ownership: "individual",
        status: 1
    }
]

export default function User() {
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const CustomerColumn: any = [
        {
            name: "Judul",
            sortable: true,
            selector: (row: any) => row?.title
        },
        {
            name: "Pengiklan",
            selector: (row: any) => row?.user_name
        },
        {
            name: "Harga",
            sortable: true,
            selector: (row: any) => toMoney(row?.price) || "-"
        },
        {
            name: "Kategori",
            sortable: true,
            selector: (row: any) => row?.category_name
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == '1' ? 'Aktif' : 'Non Aktif'
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                <Button title='Verifikasi' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "approved" })
                }}>
                    <CheckIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Tolak' color='danger' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "rejected" })
                }}>
                    <XIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]

    const ComponentExpand: React.FC<ExpanderComponentProps<any>> = ({ data }: any) => {
        const descdata = [
            { title: "Sub Kategori", value: data?.subcategory_name },
            { title: "Brand", value: data?.brand_name },
            { title: "Tipe", value: data?.type_name },
            { title: "Deskripsi", value: data?.description },
            { title: "Tahun", value: data?.year },
            { title: "Transmisi", value: data?.transmission },
            { title: "Trip KM", value: toMoney(data?.km) },
            { title: "Plat Nomor", value: data?.plat_no?.replaceAll("-", " ") },
            { title: "Jenis Kepemilikan", value: data?.ownership },
            { title: "Warna", value: data?.color },
            { title: "Lokasi", value: `${data?.district_name}, ${data?.city_name}, ${data?.province_name}` }
        ]
        return (
            <div>
                <div className='flex gap-2 justify-start items-center flex-wrap my-4'>
                    {
                        descdata?.map((v: any) => (
                            <div key={v?.title} className='w-[380px] border-b border-b-gray-300 lg:mt-0 mt-2'>
                                <label htmlFor={v?.title} className='font-semibold'>{v?.title}</label>
                                <p className='text-sm mt-2' id={v?.title}>{v?.value}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Iklan</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' />
                    </div>
                </div>
                <div className='mt-5'>
                    {
                        show &&
                        <DataTable
                            columns={CustomerColumn}
                            data={data}
                            // selectableRows
                            expandableRows
                            expandableRowsComponent={ComponentExpand}
                            customStyles={CustomTableStyle}
                        />
                    }
                </div>
                {
                    modal?.key == "approved" || modal?.key == "rejected" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'approved' ? `Verifikasi` : `Tolak Pengajuan`} Iklan</h2>
                        <form>
                            <input type="hidden" name="id" value={modal?.data?.id} />
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
                                            <Button className={'flex gap-2 px-2 items-center justify-center'}>
                                                <CheckIcon className='w-4 h-4' />
                                                Verifikasi
                                            </Button> :
                                            <Button color="danger" className={'flex gap-2 px-2 items-center justify-center'}>
                                                <XIcon className='w-4 h-4' />
                                                Tolak Iklan
                                            </Button>
                                    }
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
