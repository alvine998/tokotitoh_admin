import { CONFIG } from "@/config";
import { queryToUrlSearchParams } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  Loader2,
  PencilIcon,
  Search,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { req, res } = context;
    const { page, size, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/users?pagination=true&role=customer&page=${+page - 1}&size=${
          size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      }
    );
    const session: any = getCookie("session", { req, res });
    return {
      props: {
        table: result?.data,
        session: JSON.parse(session),
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

export default function Customer({ table, session }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<{ open: boolean; data?: any; key?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = queryToUrlSearchParams(router?.query)?.toString();

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
      name: "Status",
      sortable: true,
      cell: (row: any) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            row?.status == "1"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row?.status == "1" ? "Aktif" : "Non Aktif"}
        </span>
      ),
    },
    session?.role !== "admin" && {
      name: "Aksi",
      right: true,
      cell: (row: any) => (
        <button
          type="button"
          title="Edit"
          onClick={() => setModal({ open: true, data: row, key: "update" })}
          className="p-2 rounded-lg text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      ),
    },
  ]?.filter((v: any) => v !== false);

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        id: +formData?.id || null,
        email: formData?.email,
        status: +formData?.status,
      };
      if (payload?.id) {
        await axios.patch(CONFIG.base_url_api + `/user`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      } else {
        await axios.post(CONFIG.base_url_api + `/user`, payload, {
          headers: {
            "bearer-token": "tokotitohapi",
            "x-partner-code": "id.marketplace.tokotitoh",
          },
        });
      }
      Swal.fire({ icon: "success", text: "Data Berhasil Disimpan" });
      setLoading(false);
      setModal({ open: false });
      router.push(`?${params}`);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengguna</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola data pengguna platform Anda.</p>
      </div>

      {/* Content card */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari pengguna..."
              defaultValue={filter?.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="[&_.rdt_Table]:!border-0">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) => setFilter({ ...filter, page: pageData })}
              onChangeRowsPerPage={(currentRow, currentPage) =>
                setFilter({ ...filter, page: currentPage, size: currentRow })
              }
              responsive={true}
              paginationTotalRows={table?.items?.count}
              paginationDefaultPage={1}
              paginationServer={true}
              columns={CustomerColumn}
              data={table?.items?.rows}
              customStyles={{
                headCells: {
                  style: {
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#6b7280",
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.025em",
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    fontSize: "14px",
                    color: "#374151",
                  },
                },
                rows: {
                  style: {
                    borderBottom: "1px solid #f3f4f6",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  },
                },
                pagination: {
                  style: {
                    borderTop: "1px solid #e5e7eb",
                    fontSize: "14px",
                    color: "#6b7280",
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Edit modal */}
      {modal?.key === "update" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModal({ open: false })} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Ubah Status Pengguna</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input type="hidden" name="id" value={modal?.data?.id || ""} />
              <input type="hidden" name="email" value={modal?.data?.email || ""} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="1"
                      defaultChecked={modal?.data?.status == 1}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-600"
                    />
                    <span className="text-sm text-gray-700">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="0"
                      defaultChecked={modal?.data?.status == 0}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-600"
                    />
                    <span className="text-sm text-gray-700">Non Aktif</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
