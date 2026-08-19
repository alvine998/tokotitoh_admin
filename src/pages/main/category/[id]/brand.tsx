import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import PropertyTabs from "@/components/tabs/PropertyTabs";
import { CONFIG } from "@/config";
import { storage } from "@/config/firebase";
import { queryToUrlSearchParams } from "@/utils";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Search,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const { id } = context.params;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/brands?pagination=true&category_id=${id}&page=${
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
      CONFIG.base_url_api + `/categories?id=${id}`,
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
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function PropertyRoom({ id, detail, table }: any) {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [filter, setFilter] = useState<any>(router.query);
  const [image, setImage] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

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
      name: "Logo",
      sortable: true,
      cell: (row: any) =>
        row?.image ? (
          <Image
            alt="logo"
            src={row?.image}
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg object-cover m-1"
          />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      name: "Tipe",
      button: true,
      cell: (row: any) => (
        <button
          type="button"
          onClick={() =>
            router.push(`/main/category/${id}/${row?.id}/type`)
          }
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          Lihat Tipe
        </button>
      ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row?.status == 1
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row?.status == 1 ? "Ditampilkan" : "Tidak ditampilkan"}
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
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "update" });
              setImage(row?.image);
            }}
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

  const handleImage = async (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file?.size <= 500000) {
        setProgress(0);
        setImage(null);
        const storageRef = ref(storage, `images/brand/${file?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
          },
          (error) => {
            console.log(error);
            setProgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImage(downloadURL);
              setProgress(null);
            });
          }
        );
      } else {
        return Swal.fire({
          icon: "error",
          text: "Ukuran Gambar Tidak Boleh Lebih Dari 500Kb",
        });
      }
    }
  };

  const params = queryToUrlSearchParams(router?.query)?.toString();

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        image: image,
        category_id: id,
        ...formData,
      };
      if (formData?.id) {
        await axios.patch(CONFIG.base_url_api + `/brand`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      } else {
        await axios.post(CONFIG.base_url_api + `/brand`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      }
      Swal.fire({ icon: "success", text: "Data Berhasil Disimpan" });
      setLoading(false);
      setImage(null);
      setProgress(null);
      setModal({ ...modal, open: false });
      router.push(`/main/category/${id}/brand?${params}`);
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
      await axios.delete(CONFIG.base_url_api + `/brand?id=${formData?.id}`, {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      });
      Swal.fire({ icon: "success", text: "Data Berhasil Dihapus" });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`/main/category/${id}/brand?${params}`);
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: "error", text: error?.response?.data?.message });
    }
  };

  return (
    <PropertyTabs id={id} detail={detail}>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari brand..."
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
            Tambah Brand
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
            {modal.key == "create" ? "Tambah" : "Ubah"} Brand
          </h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <Input
              label="Nama Brand"
              placeholder="Masukkan Nama Brand"
              name="name"
              defaultValue={modal?.data?.name || ""}
              required
            />
            <div>
              <Input
                label="Logo"
                type="file"
                onChange={handleImage}
                accept="image/*"
              />
              {progress !== null && progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {progress !== null && progress !== undefined && (
                <p className="text-sm text-gray-600 mt-1">{progress}%</p>
              )}
              {image && (
                <a
                  href={image}
                  target="_blank"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Lihat gambar
                </a>
              )}
            </div>
            {modal.key == "update" && (
              <div>
                <label className="text-sm text-gray-500">
                  Tampilkan Logo Brand
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="1"
                      defaultChecked={modal?.data?.status == 1}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="0"
                      defaultChecked={modal?.data?.status == 0}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>
            )}
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
          <h2 className="text-xl font-semibold text-center">Hapus Brand</h2>
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
    </PropertyTabs>
  );
}
