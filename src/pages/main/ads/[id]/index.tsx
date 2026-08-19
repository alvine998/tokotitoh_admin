import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
  X,
  Check,
  ZoomIn,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { id } = context.params;
    const detail = await axios.get(CONFIG.base_url_api + `/ads?id=${id}`, {
      headers: {
        "bearer-token": "tokotitohapi",
        "x-partner-code": "id.marketplace.tokotitoh",
      },
    });
    return {
      props: {
        detail: detail?.data?.items?.rows[0],
        id,
      },
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}

const statusConfig: Record<number, { label: string; cls: string; icon: any }> = {
  0: { label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  1: { label: "Disetujui", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  2: { label: "Ditolak", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function Detail({ detail }: any) {
  const router = useRouter();
  const [modal, setModal] = useState<{ open: boolean; data?: any; key?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const status = statusConfig[detail?.status] || statusConfig[0];
  const StatusIcon = status.icon;

  const fields = [
    { title: "Judul Iklan", value: detail?.title },
    { title: "Nama Pengiklan", value: detail?.user_name },
    { title: "Lokasi", value: `${detail?.district_name}, ${detail?.city_name}, ${detail?.province_name}` },
    { title: "Harga", value: `Rp ${toMoney(detail?.price)}` },
    { title: "Kategori", value: detail?.category_name },
    { title: "Sub Kategori", value: detail?.subcategory_name },
    { title: "Brand", value: detail?.brand_name || "-" },
    { title: "Tipe", value: detail?.type_name || "-" },
    { title: "Tahun", value: detail?.year || "-" },
    { title: "Transmisi", value: detail?.transmission || "-" },
    { title: "Trip KM", value: toMoney(detail?.km) || "-" },
    { title: "Aktif Sampai", value: moment(detail?.expired_on).format("DD MMMM YYYY") },
    { title: "Jenis Kepemilikan", value: detail?.ownership || "-" },
    { title: "Warna", value: detail?.color || "-" },
  ];

  let images: string[] = [];
  try {
    images = JSON.parse(detail?.images || "[]");
  } catch {
    images = [];
  }

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const prevImage = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((prev) => (prev! - 1 + images.length) % images.length);
  }, [lightbox, images.length]);

  const nextImage = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((prev) => (prev! + 1) % images.length);
  }, [lightbox, images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightbox, prevImage, nextImage]);

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        id: detail?.id,
        status: modal?.key === "approved" ? 1 : 2,
        ...formData,
      };
      const payload2 = {
        title: modal?.key === "approved" ? "Iklan Telah Tayang" : "Iklan Ditolak",
        content:
          `Iklan ${modal?.data?.title} telah ` +
          (modal?.key === "approved" ? "ditanyangkan" : "ditolak"),
        user_id: formData?.user_id,
      };
      await axios.patch(CONFIG.base_url_api + `/ads`, payload, {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      });
      await axios.post(CONFIG.base_url_api + `/notification`, payload2, {
        headers: {
          "bearer-token": "tokotitohapi",
          "x-partner-code": "id.marketplace.tokotitoh",
        },
      });
      Swal.fire({ icon: "success", text: "Data Berhasil Disimpan" });
      setLoading(false);
      setModal({ open: false });
      router.push(`/main/ads/${detail?.id}`);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      Swal.fire({ icon: "error", text: error?.response?.data?.message });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/main/ads/waiting")}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Iklan</h1>
            <p className="mt-0.5 text-sm text-gray-500">{detail?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.cls}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>

          {detail?.status === 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModal({ open: true, data: detail, key: "approved" })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Check className="w-4 h-4" />
                Terima
              </button>
              <button
                type="button"
                onClick={() => setModal({ open: true, data: detail, key: "rejected" })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
                Tolak
              </button>
            </div>
          )}

          {detail?.status === 1 && (
            <button
              type="button"
              onClick={() => setModal({ open: true, data: detail, key: "rejected" })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
              Non Aktifkan
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Foto Iklan</h2>

          {/* Main image */}
          <div
            className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden bg-gray-100 group cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              alt="Foto utama"
              src={images[0]}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2.5">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-3">
              {images.map((url: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    index === 0 ? "border-green-600" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    alt={`Thumbnail ${index + 1}`}
                    src={url}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox modal */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/90" onClick={closeLightbox} />

          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div className="relative z-10 w-full max-w-4xl max-h-[85vh] mx-4 flex items-center justify-center">
            <Image
              alt={`Foto ${lightbox + 1}`}
              src={images[lightbox]}
              width={1200}
              height={900}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Description */}
      {detail?.description && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Deskripsi</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detail?.description}</p>
        </div>
      )}

      {/* Info grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Informasi Iklan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {fields.map((v) => (
            <div key={v.title} className="border-b border-gray-100 pb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{v.title}</p>
              <p className="text-sm text-gray-900 mt-1">{v.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approve/Reject modal */}
      {modal?.open && (modal?.key === "approved" || modal?.key === "rejected") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModal({ open: false })} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {modal.key === "approved" ? "Verifikasi Iklan" : "Tolak Iklan"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input type="hidden" name="id" value={modal?.data?.id} />
              <input type="hidden" name="user_id" value={modal?.data?.user_id} />
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin{" "}
                {modal.key === "approved" ? "memverifikasi" : "menolak"} iklan{" "}
                <span className="font-medium text-gray-900">{modal?.data?.title}</span>?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                {modal.key === "approved" ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Verifikasi
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Tolak Iklan
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
