import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";

export async function getServerSideProps(context: any) {
  try {
    const { page, size } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/ads?pagination=true&page=${+page - 1}&size=${size || 10}`,
      {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      }
    );
    return {
      props: {
        table: result?.data,
      },
    };
  } catch (error: any) {
    console.log(error);
    if (error?.response?.status == 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        error: error?.response?.data?.message,
      },
    };
  }
}

export default function User({ table }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);

  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const CustomerColumn: any = [
    {
      name: "Judul",
      sortable: true,
      selector: (row: any) => row?.title,
    },
    {
      name: "Pengiklan",
      selector: (row: any) => row?.user_name,
    },
    {
      name: "Harga",
      sortable: true,
      selector: (row: any) => toMoney(row?.price) || "-",
    },
    {
      name: "Kategori",
      sortable: true,
      selector: (row: any) => row?.category_name,
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) =>
        row?.status == "0"
          ? "Menunggu"
          : row?.status == "1"
          ? "Aktif"
          : "Ditolak",
    },
    {
      name: "Aksi",
      selector: (row: any) => (
        <div className="flex gap-2">
          <Button
            title="Verifikasi"
            color="warning"
            onClick={() => {
              router.push(`/main/ads/${row?.id}`);
            }}
          >
            <EyeIcon className="text-white w-5 h-5" />
          </Button>
          {/* <Button title='Verifikasi' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "approved" })
                }}>
                    <CheckIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Tolak' color='danger' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "rejected" })
                }}>
                    <XIcon className='text-white w-5 h-5' />
                </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Iklan</h2>

      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) => {
                setFilter({ ...filter, page: pageData });
              }}
              onChangeRowsPerPage={(currentRow, currentPage) => {
                setFilter({ ...filter, page: currentPage, size: currentRow });
              }}
              responsive={true}
              paginationTotalRows={table?.items?.count}
              paginationDefaultPage={1}
              paginationServer={true}
              striped
              columns={CustomerColumn}
              data={table?.items?.rows}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
