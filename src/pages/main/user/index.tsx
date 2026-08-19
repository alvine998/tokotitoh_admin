import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { queryToUrlSearchParams } from "@/utils";
import axios from "axios";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Search,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";


export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/users?pagination=true&role=super_admin,admin&page=${+page - 1}&size=${
          size || 10
        }&search=${search || ""}`,
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
  const CustomerColumn: any = [
    {
      name: "Nama",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "No Telepon",
      selector: (row: any) => row?.phone,
    },
    {
      name: "Email",
      sortable: true,
      selector: (row: any) => row?.email || "-",
    },
    {
      name: "Peran",
      sortable: true,
      cell: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row?.role == "super_admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
          {row?.role == "super_admin" ? "SUPER ADMIN" : "ADMIN"}
        </span>
      ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row?.status == "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row?.status == "1" ? "Aktif" : "Non Aktif"}
        </span>
      ),
    },
    {
      name: "Aksi",
      right: true,
      cell: (row: any) => (
        <div className="flex gap-1">
          <button
            type="button"
            title="Edit"
            onClick={() => setModal({ ...modal, open: true, data: row, key: "update" })}
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
        ...formData,
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/user`,
          payload,
          {
            headers: {
              "bearer-token": "tokotitohapi",
              "x-partner-code": "id.marketplace.tokotitoh",
            },
          }
        );
      } else {
        const result = await axios.post(
          CONFIG.base_url_api + `/user`,
          payload,
          {
            headers: {
              "bearer-token": "tokotitohapi",
              "x-partner-code": "id.marketplace.tokotitoh",
            },
          }
        );
      }
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`?${params}`);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message,
      });
    }
  };
  const onRemove = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/user?id=${formData?.id}`,
        {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Dihapus",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`?${params}`);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message,
      });
    }
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Akses Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola akses admin dan super admin.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari admin..."
              defaultValue={filter?.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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
            Tambah Admin
          </Button>
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
              columns={CustomerColumn}
              data={table?.items?.rows}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
      </div>

      {(modal?.key == "create" || modal?.key == "update") && (
        <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
          <h2 className="text-xl font-semibold text-center">
            {modal.key == "create" ? "Tambah" : "Ubah"} Akses Admin
          </h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            {modal.key == "update" && (
              <input type="hidden" name="id" value={modal?.data?.id || null} />
            )}
            <Input label="Nama" placeholder="Masukkan Nama" name="name" defaultValue={modal?.data?.name || ""} required />
            <Input label="No Telepon" placeholder="Masukkan No Telepon" name="phone" type="number" defaultValue={modal?.data?.phone || ""} required />
            <Input label="Email" placeholder="Masukkan Email" name="email" type="email" defaultValue={modal?.data?.email || ""} />
            <Input label="Password" placeholder="Masukkan Password" name="password" isPassword defaultValue="" required={modal.key == "create"} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peran</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="super_admin" defaultChecked={modal?.data?.role == "super_admin"} className="focus:ring-blue-500" />
                  <span className="text-sm">Super Admin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="admin" defaultChecked={modal?.data?.role == "admin"} className="focus:ring-blue-500" />
                  <span className="text-sm">Admin</span>
                </label>
              </div>
            </div>
            {modal.key == "update" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="1" defaultChecked={modal?.data?.status == 1} className="focus:ring-blue-500" />
                    <span className="text-sm">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="0" defaultChecked={modal?.data?.status == 0} className="focus:ring-blue-500" />
                    <span className="text-sm">Non Aktif</span>
                  </label>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button color="white" type="button" onClick={() => setModal({ open: false })}>
                Kembali
              </Button>
              <Button disabled={loading} color="info" className="flex gap-2 px-4 py-2 items-center">
                <SaveAllIcon className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.key == "delete" && (
        <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
          <h2 className="text-xl font-semibold text-center">Hapus Akses Admin</h2>
          <form onSubmit={onRemove} className="mt-4">
            <input type="hidden" name="id" value={modal?.data?.id} />
            <p className="text-center my-4 text-gray-600">
              Apakah anda yakin ingin menghapus data <strong>{modal?.data?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button color="white" type="button" onClick={() => setModal({ open: false })}>
                Kembali
              </Button>
              <Button disabled={loading} color="danger" className="flex gap-2 px-4 py-2 items-center">
                <Trash2Icon className="w-4 h-4" />
                {loading ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
