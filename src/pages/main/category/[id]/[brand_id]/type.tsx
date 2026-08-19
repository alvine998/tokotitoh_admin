import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import BrandTabs from "@/components/tabs/BrandTabs";
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
    const { brand_id, id } = context.params;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/types?pagination=true&brand_id=${brand_id}&page=${
          +page - 1
        }&size=${size || 10}&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      }
    );
    const detail = await axios.get(
      CONFIG.base_url_api + `/brands?id=${brand_id}`,
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
        detail: detail?.data?.items?.rows[0],
        id,
        brand_id,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function PropertyRoom({ id, detail, table, brand_id }: any) {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(router.query);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);

  const Column: any = [
    {
      name: "Nama",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Brand",
      sortable: true,
      selector: (row: any) => row?.brand_name,
    },
    {
      name: "Aksi",
      right: true,
      cell: (row: any) => (
        <div className="flex gap-1">
          <button
            type="button"
            title="Edit"
            onClick={() =>
              setModal({ ...modal, open: true, data: row, key: "update" })
            }
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Hapus"
            onClick={() =>
              setModal({ ...modal, open: true, data: row, key: "delete" })
            }
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);

  const params = queryToUrlSearchParams(router?.query)?.toString();

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        brand_id: brand_id,
        ...formData,
      };
      if (formData?.id) {
        await axios.patch(CONFIG.base_url_api + `/type`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      } else {
        await axios.post(CONFIG.base_url_api + `/type`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      }
      Swal.fire({ icon: "success", text: "Data Berhasil Disimpan" });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`/main/category/${id}/${brand_id}/type?${params}`);
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: "error", text: error?.response?.data?.message });
    }
  };

  const onRemove = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const formData = Object.fromEntries(new FormData(e.target));
      await axios.delete(CONFIG.base_url_api + `/type?id=${formData?.id}`, {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      });
      Swal.fire({ icon: "success", text: "Data Berhasil Dihapus" });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`/main/category/${id}/${brand_id}/type?${params}`);
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: "error", text: error?.response?.data?.message });
    }
  };

  return (
    <BrandTabs id={id} detail={detail}>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari tipe..."
              defaultValue={filter?.search}
              onChange={(e) =>
                setFilter({ ...filter, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            type="button"
            color="info"
            size="auto"
            className="flex gap-2 px-4 py-2 items-center"
            onClick={() =>
              setModal({ ...modal, open: true, data: null, key: "create" })
            }
          >
            <PlusIcon className="w-4 h-4" />
            Tambah Tipe
          </Button>
        </div>
        <div className="p-4">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) =>
                setFilter({ ...filter, page: pageData })
              }
              onChangeRowsPerPage={(currentRow, currentPage) =>
                setFilter({ ...filter, page: currentPage, size: currentRow })
              }
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
        <Modal
          open={modal.open}
          setOpen={() => setModal({ ...modal, open: false })}
        >
          <h2 className="text-xl font-semibold text-center">
            {modal.key == "create" ? "Tambah" : "Ubah"} Tipe
          </h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <Input
              label="Nama Tipe"
              placeholder="Masukkan Nama Tipe"
              name="name"
              defaultValue={modal?.data?.name || ""}
              required
            />
            {modal.key == "update" && (
              <input type="hidden" name="id" value={modal?.data?.id || null} />
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                color="white"
                type="button"
                onClick={() => setModal({ open: false })}
              >
                Kembali
              </Button>
              <Button
                disabled={loading}
                color="info"
                className="flex gap-2 px-4 py-2 items-center"
              >
                <SaveAllIcon className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.key == "delete" && (
        <Modal
          open={modal.open}
          setOpen={() => setModal({ ...modal, open: false })}
        >
          <h2 className="text-xl font-semibold text-center">Hapus Tipe</h2>
          <form onSubmit={onRemove} className="mt-4">
            <input type="hidden" name="id" value={modal?.data?.id} />
            <p className="text-center my-4 text-gray-600">
              Apakah anda yakin ingin menghapus data{" "}
              <strong>{modal?.data?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                color="white"
                type="button"
                onClick={() => setModal({ open: false })}
              >
                Kembali
              </Button>
              <Button
                disabled={loading}
                color="danger"
                className="flex gap-2 px-4 py-2 items-center"
              >
                <Trash2Icon className="w-4 h-4" />
                {loading ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </BrandTabs>
  );
}
