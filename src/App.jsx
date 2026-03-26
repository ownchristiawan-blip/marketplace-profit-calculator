import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  const [tab, setTab] = useState("price");
  const [error, setError] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [modal, setModal] = useState("");
  const [fee, setFee] = useState("");
  const [affiliate, setAffiliate] = useState("");
  const [voucher, setVoucher] = useState("");
  const [target, setTarget] = useState("");
  const [ongkir, setOngkir] = useState("");
  const [packing, setPacking] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [result, setResult] = useState(null);
  
  const calculatePrice = () => {
    const m = Number(modal || 0);
    const f = Number(fee || 0);
    const a = Number(affiliate || 0);
    const v = Number(voucher || 0);
    const t = Number(target || 0);
    const o = Number(ongkir || 0);
    const p = Number(packing || 0);

    const totalCut = (f + a + v + t) / 100;
    if (totalCut >= 1) {
      setError("Total potongan tidak boleh 100% atau lebih!");
      setResult(null);
      setBreakdown(null);
      return;
    }
    setError("");

    const harga = (m + o + p) / (1 - totalCut);

    const feeShopee = harga * (f / 100);
    const feeAffiliate = harga * (a / 100);
    const feeVoucher = harga * (v / 100);

    const totalPotongan = feeShopee + feeAffiliate + feeVoucher;

    const profit = harga - totalPotongan - m - o - p;

    setResult(Math.ceil(harga));

    setBreakdown({
      feeShopee,
      feeAffiliate,
      feeVoucher,
      totalPotongan,
      profit,
    });
  };

  const calculateProfit = () => {
    const hj = Number(hargaJual || 0);
    const f = Number(fee || 0);
    const a = Number(affiliate || 0);
    const v = Number(voucher || 0);
    const m = Number(modal || 0);
    const o = Number(ongkir || 0);
    const p = Number(packing || 0);

    const feeShopee = hj * (f / 100);
    const feeAffiliate = hj * (a / 100);
    const feeVoucher = hj * (v / 100);

    const totalPotongan = feeShopee + feeAffiliate + feeVoucher;

    const profit = hj - totalPotongan - m - o - p;

    setResult(profit);

    setBreakdown({
      feeShopee,
      feeAffiliate,
      feeVoucher,
      totalPotongan,
      profit,
    });
  };

  const getDecision = (profit) => {
    if (profit <= 0) {
      return {
        label: "Tidak Disarankan",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    }

    if (profit < 8000) {
      return {
        label: "Margin Tipis",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    }

    return {
      label: "Layak Jual",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    };
  };

  const decision = breakdown ? getDecision(breakdown.profit) : null;

  const simulate = () => {
    const hj = Number(hargaJual || 0);
    const f = Number(fee || 0);
    const a = Number(affiliate || 0);
    const v = Number(voucher || 0);
    const m = Number(modal || 0);
    const o = Number(ongkir || 0);
    const p = Number(packing || 0);

    const potongan =
      hj * (f / 100) +
      hj * (a / 100) +
      hj * (v / 100);

    const profitPerOrder = hj - potongan - m - o - p;

    setResult(profitPerOrder * 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-8 space-y-6">

          <h1 className="text-2xl font-bold text-center">
            Shopee Calculator Pro
          </h1>

          {/* TAB BUTTONS */}
          <div className="grid grid-cols-3 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setTab("price")}
              className={`py-2 rounded-md ${
                tab === "price" ? "bg-white shadow font-semibold" : ""
              }`}
            >
              Harga
            </button>
            <button
              onClick={() => setTab("profit")}
              className={`py-2 rounded-md ${
                tab === "profit" ? "bg-white shadow font-semibold" : ""
              }`}
            >
              Profit
            </button>
            <button
              onClick={() => setTab("simulasi")}
              className={`py-2 rounded-md ${
                tab === "simulasi" ? "bg-white shadow font-semibold" : ""
              }`}
            >
              Simulasi
            </button>
          </div>

          {/* ================= PRICE ================= */}
          {tab === "price" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm text-gray-600 col-span-2 text-center">
                  Masukkan biaya dan target profit untuk menentukan harga jual ideal
                </div>
                <div className="text-xs text-gray-500 text-center col-span-2 -mt-1 mb-2">
                  Semakin tinggi biaya, semakin tinggi harga jual yang dibutuhkan
                </div>

                <div className="text-xs font-semibold text-gray-500 mt-2 col-span-2 text-center tracking-wide">
                  BIAYA
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Modal</div>
                  <Input 
                    value={modal} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setModal(value);
                      } 
                    }}
                    placeholder="Contoh: 50000" 
                    type="text"
                    inputMode="numeric"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Biaya Marketplace (%)</div>
                  <Input 
                    value={fee} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setFee(value);
                      }
                    }} 
                    placeholder="Contoh: 2.5" 
                    type="text"
                    inputMode="numeric"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Biaya Afiliasi (%)</div>
                  <Input 
                    value={affiliate} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setAffiliate(value);
                      }
                    }} 
                    placeholder="Contoh: 3"
                    type="text"
                    inputMode="numeric"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Biaya Voucher (%)</div>
                  <Input 
                    value={voucher} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setVoucher(value);
                      }
                    }} 
                    placeholder="Contoh: 5" 
                    type="text"
                    inputMode="numeric"
                    step="0.1"
                    min="0"
                    max="100"  
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Ongkos Kirim</div>
                  <Input 
                    value={ongkir} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setOngkir(value);
                      }
                    }} 
                    placeholder="Contoh: 10000" 
                    type="text"
                    inputMode="numeric"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Biaya Packing</div>    
                  <Input 
                    value={packing} 
                    onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setPacking(value);
                      }
                    }} 
                    placeholder="Contoh: 5000" 
                    type="text"
                    inputMode="numeric"
                  />
                </div>
              </div>
              
              <div className="text-xs font-semibold text-gray-500 mt-2 col-span-2 text-center tracking-wide">TARGET</div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Target Profit (%)</div>
                <Input value={target} onChange={(e) => {
                  const value = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                      setTarget(value);
                    }
                  }} 
                  placeholder="Contoh: 20" 
                  type="text"
                  inputMode="numeric"
                />
              </div>

              <Button onClick={calculatePrice} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Hitung Harga Jual
              </Button>
            </div>
          )}

          {/* ================= PROFIT ================= */}
          {tab === "profit" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 text-center">
                  Masukkan harga kompetitor untuk mengetahui profit yang bisa Anda dapatkan
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center tracking-wide">
                  Menggunakan biaya yang telah Anda masukkan sebelumnya
                </div>
                <div className="text-xs text-gray-500">Harga Kompetitor</div>
                <Input value={hargaJual} onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setHargaJual(value);
                      }
                    }} 
                    placeholder="Contoh: 50000" 
                    type="text"
                    inputMode="numeric"
                  />
              </div>

              <Button onClick={calculateProfit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Cek Profit
              </Button>
            </div>
          )}

          {/* ================= SIMULASI ================= */}
          {tab === "simulasi" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 text-center">
                  Simulasikan total keuntungan dari penjualan dalam jumlah besar
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center tracking-wide">
                  Menggunakan biaya yang telah Anda masukkan sebelumnya
                </div>
                <div className="text-xs text-gray-500">Harga Jual per Produk (Rp)</div>
                <Input value={hargaJual} onChange={(e) => {
                      const value = e.target.value;

                      // hanya angka + titik
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        setHargaJual(value);
                      }
                    }} 
                    placeholder="Contoh: 50000" 
                    type="text"
                    inputMode="numeric"
                  />
              </div>

              <Button onClick={simulate} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Hitung Profit untuk 100 Order
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-2 bg-red-100 text-red-600 border border-red-300 text-sm text-center p-2 rounded-md">
              {error}
            </div>
          )}

          {/* RESULT */}
          {result !== null && (
            <div className={`text-center text-xl font-semibold ${
              result > 0 ? "text-green-600" : "text-red-500"
            }`}>
              Hasil: Rp {Math.round(result).toLocaleString("id-ID")}
            </div>
          )}

          {breakdown && tab !== "simulasi" && (
            <div className="text-sm bg-gray-50 p-3 rounded-lg space-y-1 mt-3">
              <div className="text-xs text-gray-500">Rincian Biaya</div>
              <div>Fee Shopee: Rp {Math.round(breakdown.feeShopee).toLocaleString("id-ID")}</div>
              <div>Affiliate: Rp {Math.round(breakdown.feeAffiliate).toLocaleString("id-ID")}</div>
              <div>Voucher: Rp {Math.round(breakdown.feeVoucher).toLocaleString("id-ID")}</div>
              <div className="font-semibold border-t pt-1">
                Total Potongan: Rp {Math.round(breakdown.totalPotongan).toLocaleString("id-ID")}
              </div>
              <div className={`font-semibold ${breakdown.profit > 0 ? "text-green-600" : "text-red-500"}`}>
                Profit: Rp {Math.round(breakdown.profit).toLocaleString("id-ID")}
              </div>

              {decision && (
                <div className={`mt-3 p-2 rounded-md border ${decision.bg} ${decision.border}`}>
                  <div className={`font-semibold text-center ${decision.color}`}>
                    {decision.label}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}