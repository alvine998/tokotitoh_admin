import Button from '@/components/Button'
import Input from '@/components/Input'
import { CustomerColumn } from '@/components/columns/CustomerColumn'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
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
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Pelanggan</h2>

            <div className='mt-5'>
                <div className='flex justify-between items-center'>
                    <div>
                        <Input label='' type='search' placeholder='Cari disini...' />
                    </div>
                    <div>
                        <Button type='button' color='info' className={'flex gap-2 px-2'}>
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
            </div>
        </div>
    )
}
