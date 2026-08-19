import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { queryToUrlSearchParams } from "@/utils";
import axios from "axios";
import {
  ReplyIcon,
  Search,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/reports?pagination=true&page=${+page - 1}&size=${size || 10}&search=${
          search || ""
        }`,
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

export default function Category({ table }: any) {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [filter, setFilter] = useState<any>(router.query);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const Column: any = [
    {
      name: "Iklan",
      sortable: true,
      selector: (row: any) => (
        <Link
          className="text-blue-500 hover:underline"
          href={`/main/ads/${row?.ads_id}`}
          target="_blank"
        >
          {row?.ads_id + " - " + row?.ads_name}
        </Link>
      ),
    },
    {
      name: "Nama Pengguna",
      sortable: true,
      selector: (row: any) => row?.user_name,
    },
    {
      name: "Judul Laporan",
      sortable: true,
      selector: (row: any) => row?.title,
    },
    {
      name: "Deskripsi",
      sortable: true,
      cell: (row: any) => (
        <button
          className="text-blue-500 hover:underline"
          type="button"
          onClick={() => setModal({ ...modal, open: true, data: row, key: "desc" })}
        >
          Lihat
        </button>
      ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row?.status == 1 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {row?.status == 1 ? "Sudah Dibalas" : "Menunggu Tanggapan"}
        </span>
      ),
    },
    {
      name: "Aksi",
      right: true,
      cell: (row: any) => (
        <div className="flex gap-1">
          {row?.status == 0 && (
            <button
              type="button"
              title="Balas"
              onClick={() => setModal({ ...modal, open: true, data: row, key: "update" })}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ReplyIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];
  const params = queryToUrlSearchParams(router?.query)?.toString();
  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        title: formData?.title,
        content: formData?.content,
        user_id: formData?.user_id,
      };
      const payload2 = {
        id: formData?.id,
        status: formData?.status,
      };
      const result = await axios.post(
        CONFIG.base_url_api + `/notification`,
        payload,
        {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        }
      );

      if (result) {
        await axios.patch(CONFIG.base_url_api + `/report`, payload2, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      }

      Swal.fire({
        icon: "success",
        text: "Data Berhasil Dikirim",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`?${params}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: "Gagal Data Berhasil Dikirim",
      });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola laporan dari pengguna.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari laporan..."
              defaultValue={filter?.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="p-4">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) => setFilter({ ...filter, page: pageData })}
              onChangeRowsPerPage={(currentRow, currentPage) => setFilter({ ...filter, page: currentPage, size: currentRow })}
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
          <h2 className="text-xl font-semibold text-center">Balas Laporan</h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <Input label="Judul" name="title" placeholder="Masukkan judul balasan" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="content"
                placeholder="Ketik pesan balasan..."
                rows={4}
                required
              />
            </div>
            <input type="hidden" name="status" value={1} />
            <input type="hidden" name="user_id" value={modal.data.user_id} />
            <input type="hidden" name="id" value={modal.data.id} />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button color="white" type="button" onClick={() => setModal({ open: false })}>
                Kembali
              </Button>
              <Button disabled={loading} color="info" className="flex gap-2 px-4 py-2 items-center">
                <SendIcon className="w-4 h-4" />
                {loading ? "Mengirim..." : "Kirim"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.key == "desc" && (
        <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
          <h2 className="text-xl font-semibold text-center">Deskripsi Laporan</h2>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{modal?.data?.description}</p>
          </div>
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button color="white" type="button" onClick={() => setModal({ open: false })}>
              Tutup
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
