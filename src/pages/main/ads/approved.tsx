import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import AdsTabs from "@/components/tabs/AdsTabs";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { EyeIcon, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/ads?pagination=true&page=${+page - 1}&size=${size || 10}&search=${
          search || ""
        }&status=1`,
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
      return { redirect: { destination: "/", permanent: false } };
    }
    return { props: { error: error?.response?.data?.message } };
  }
}

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    "0": { label: "Menunggu", cls: "bg-amber-100 text-amber-700" },
    "1": { label: "Aktif", cls: "bg-green-100 text-green-700" },
    "2": { label: "Ditolak", cls: "bg-red-100 text-red-700" },
  };
  const s = map[status] || map["0"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
};

export default function ApprovedAds({ table }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShow(true);
  }, []);

  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);

  const columns: any = [
    { name: "Judul", sortable: true, selector: (row: any) => row?.title },
    { name: "Pengiklan", selector: (row: any) => row?.user_name },
    { name: "Harga", sortable: true, selector: (row: any) => toMoney(row?.price) || "-" },
    { name: "Kategori", sortable: true, selector: (row: any) => row?.category_name },
    { name: "Status", sortable: true, cell: (row: any) => statusBadge(row?.status) },
    {
      name: "Aksi",
      right: true,
      cell: (row: any) => (
        <Link
          href={`/main/ads/${row?.id}`}
          target="_blank"
          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors inline-flex"
          title="Lihat Detail"
        >
          <EyeIcon className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <AdsTabs>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cari iklan..."
              defaultValue={filter?.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition"
            />
          </div>
        </div>
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
              columns={columns}
              data={table?.items?.rows}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
      </div>
    </AdsTabs>
  );
}
