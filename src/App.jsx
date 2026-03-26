import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  const [tab, setTab] = useState("price");

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
    const m = Number(modal);
    const f = Number(fee);
    const a = Number(affiliate);
    const v = Number(voucher);
    const t = Number(target);
    const o = Number(ongkir);
    const p = Number(packing);

    const totalCut = (f + a + v + t) / 100;
    if (totalCut >= 1) return alert("Potongan terlalu besar");

    const harga = (m + o + p) / (1 - totalCut);
    setResult(Math.ceil(harga));
  };

  const calculateProfit = () => {
    const hj = Number(hargaJual);
    const f = Number(fee);
    const a = Number(affiliate);
    const v = Number(voucher);
    const m = Number(modal);
    const o = Number(ongkir);
    const p = Number(packing);

    const potongan =
      hj * (f / 100) +
      hj * (a / 100) +
      hj * (v / 100);

    const profit = hj - potongan - m - o - p;
    setResult(profit);
  };

  const simulate = () => {
    const potongan =
      hargaJual * (fee / 100) +
      hargaJual * (affiliate / 100) +
      hargaJual * (voucher / 100);

    const profitPerOrder = hargaJual - potongan - modal - ongkir - packing;
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
                <Input 
                  value={modal} 
                  onChange={(e) => setModal(Number(e.target.value))} 
                  placeholder="Modal" 
                />

                <Input 
                  value={fee} 
                  onChange={(e) => setFee(e.target.value)} 
                  placeholder="Fee (%)" 
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                />

                <Input 
                  value={affiliate} 
                  onChange={(e) => setAffiliate(e.target.value)} 
                  placeholder="Affiliate (%)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                />
                
                <Input 
                  value={voucher} 
                  onChange={(e) => setVoucher(e.target.value)} 
                  placeholder="Voucher (%)" 
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"  
                />

                <Input 
                  value={ongkir} 
                  onChange={(e) => setOngkir(Number(e.target.value))} 
                  placeholder="Ongkir" 
                />

                <Input 
                  value={packing} 
                  onChange={(e) => setPacking(Number(e.target.value))} 
                  placeholder="Packing" 
                />
              </div>

              <Input value={target} onChange={(e) => setTarget(Number(e.target.value))} placeholder="Target Profit (%)" />

              <Button onClick={calculatePrice} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Hitung Harga Jual
              </Button>
            </div>
          )}

          {/* ================= PROFIT ================= */}
          {tab === "profit" && (
            <div className="space-y-4">
              <Input value={hargaJual} onChange={(e) => setHargaJual(Number(e.target.value))} placeholder="Harga Jual Kompetitor" />

              <Button onClick={calculateProfit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Hitung Profit
              </Button>
            </div>
          )}

          {/* ================= SIMULASI ================= */}
          {tab === "simulasi" && (
            <div className="space-y-4">
              <Input value={hargaJual} onChange={(e) => setHargaJual(Number(e.target.value))} placeholder="Harga Jual" />

              <Button onClick={simulate} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Simulasi 100 Order
              </Button>
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

        </CardContent>
      </Card>
    </div>
  );
}