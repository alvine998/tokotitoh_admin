import { PencilIcon, TrashIcon } from "lucide-react";
import Button from "../Button";

export const CustomerColumn: any = [
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
            <Button color='primary'>
                <PencilIcon className='text-white w-5 h-5' />
            </Button>
            <Button color='danger'>
                <TrashIcon className='text-white w-5 h-5' />
            </Button>
        </div>
    },
]