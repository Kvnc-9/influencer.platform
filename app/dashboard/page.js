"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Instagram, Info, DollarSign, TrendingUp, Users } from "lucide-react"; // İkonlar

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [niche, setNiche] = useState("Spor");
  const [budget, setBudget] = useState(50000);
  const [productPrice, setProductPrice] = useState(500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormula, setShowFormula] = useState(false); // Formül popup kontrolü

  const fetchInfluencers = async () => {
    setLoading(true);
    const { data } = await supabase.from("influencers").select("*").eq("niche", niche);
    if (data) calculateROI(data);
    setLoading(false);
  };

  const calculateROI = (data) => {
    const totalNicheViews = data.reduce((sum, inf) => sum + Number(inf.avg_views || 0), 0);

    const calculatedData = data.map((inf) => {
      const avgViews = Number(inf.avg_views || 0);
      
      // 1. GERÇEKÇİLİK VARYASYONU:
      // Her influencer'ın dönüşüm oranı aynı olmaz.
      // Mikro influencerlar (%1.5 - %3.5 arası) genellikle daha sadık kitleye sahiptir.
      // Bunu simüle etmek için rastgele bir "Engagement Factor" ekliyoruz.
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 ile 1.2 arası rastgele sayı
      const baseConversionRate = 0.02; // %2 Standart
      const personalizedConversion = baseConversionRate * randomFactor; 

      // 2. BÜTÇE DAĞILIMI (Cost)
      // İzlenme payına göre bütçe veriyoruz.
      const shareOfVoice = totalNicheViews > 0 ? avgViews / totalNicheViews : 0;
      const cost = budget * shareOfVoice;

      // 3. GELİR TAHMİNİ (Earnings)
      const estimatedSales = avgViews * personalizedConversion;
      const earnings = estimatedSales * productPrice;

      // 4. METRİKLER
      const profit = earnings - cost;
      const roi = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;
      const cpm = avgViews > 0 ? ((cost / avgViews) * 1000).toFixed(2) : 0;
      const rpm = avgViews > 0 ? ((earnings / avgViews) * 1000).toFixed(2) : 0;

      return {
        username: inf.username,
        avg_views: avgViews,
        conversionRate: (personalizedConversion * 100).toFixed(2), // Şeffaflık için gösterelim
        cost: Math.round(cost),
        earnings: Math.round(earnings),
        profit: Math.round(profit),
        roi: Number(roi),
        cpm: cpm,
        rpm: rpm,
      };
    });

    setResults(calculatedData.sort((a, b) => b.profit - a.profit));
  };

  useEffect(() => { fetchInfluencers(); }, [niche, budget, productPrice]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><TrendingUp size={24} /></div>
            <h1 className="text-2xl font-bold text-slate-800">Panel</h1>
          </div>
          <button onClick={() => setShowFormula(!showFormula)} className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-2 rounded-lg transition">
            <Info size={18} /> Hesaplama Mantığını Göster
          </button>
        </header>

        {/* ŞEFFAFLIK ALANI (FORMÜLLER) */}
        {showFormula && (
          <div className="bg-indigo-900 text-white p-6 rounded-xl mb-8 shadow-lg animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Info /> Şeffaf Hesaplama Algoritması</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div>
                <strong className="block text-indigo-300 mb-1">CPM (Maliyet):</strong>
                (Maliyet / Toplam Gösterim) * 1000
                <p className="text-xs text-gray-400 mt-1">Bütçe, influencer'ın izlenme payına göre otomatik dağıtılır.</p>
              </div>
              <div>
                <strong className="block text-indigo-300 mb-1">RPM (Gelir):</strong>
                (Tahmini Kazanç / Toplam Gösterim) * 1000
                <p className="text-xs text-gray-400 mt-1">Kazanç, influencer'ın dönüşüm oranına (Conversion Rate) göre değişir.</p>
              </div>
              <div>
                <strong className="block text-indigo-300 mb-1">ROI (Yatırım Getirisi):</strong>
                ((Gelir - Maliyet) / Maliyet) * 100
                <p className="text-xs text-gray-400 mt-1">Pozitif değer kârı, negatif değer zararı gösterir.</p>
              </div>
            </div>
          </div>
        )}

        {/* INPUT ALANI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Kategori */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
                <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full mt-2 p-3 bg-slate-50 rounded-lg outline-none font-medium">
                    <option value="Spor">Spor & Fitness</option>
                    <option value="Güzellik">Güzellik & Moda</option>
                    <option value="Teknoloji">Teknoloji</option>
                    <option value="Yemek">Yemek</option>
                </select>
            </div>
            {/* Bütçe */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Toplam Bütçe</label>
                <div className="flex items-center mt-2 bg-slate-50 rounded-lg p-3">
                    <DollarSign size={18} className="text-slate-400 mr-2"/>
                    <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-indigo-900" />
                </div>
            </div>
            {/* Ürün Fiyatı */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Ürün Fiyatı</label>
                <div className="flex items-center mt-2 bg-slate-50 rounded-lg p-3">
                    <DollarSign size={18} className="text-slate-400 mr-2"/>
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-green-700" />
                </div>
            </div>
        </div>

        {/* GRAFİKLER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2 h-80">
                <h4 className="font-semibold text-slate-700 mb-4">Tahmini Net Kâr Dağılımı</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="username" hide />
                        <Tooltip />
                        <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h4 className="font-semibold text-slate-700 mb-4">Bütçe Pastası</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={results} dataKey="cost" cx="50%" cy="50%" outerRadius={70} fill="#8884d8">
                            {results.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* TABLO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-4">Influencer</th>
                        <th className="p-4">Dönüşüm Oranı</th>
                        <th className="p-4">Ödenmesi Gereken</th>
                        <th className="p-4">Tahmini Kâr</th>
                        <th className="p-4">ROI</th>
                        <th className="p-4">RPM / CPM</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {results.map((row) => (
                        <tr key={row.username} className="hover:bg-slate-50 transition text-sm">
                            <td className="p-4 flex items-center gap-3 font-medium text-slate-700">
                                <div className="bg-gradient-to-tr from-yellow-400 to-pink-600 text-white p-1.5 rounded-full">
                                    <Instagram size={16} />
                                </div>
                                {row.username}
                            </td>
                            <td className="p-4 text-slate-500">%{row.conversionRate}</td>
                            <td className="p-4 font-bold text-slate-700">{row.cost.toLocaleString()} ₺</td>
                            <td className="p-4 font-bold text-green-600">{row.profit.toLocaleString()} ₺</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${row.roi > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    %{row.roi}
                                </span>
                            </td>
                            <td className="p-4 text-xs text-slate-400">
                                <div className="flex gap-2">
                                    <span className="text-green-600">RPM: {row.rpm}</span>
                                    <span className="text-red-400">CPM: {row.cpm}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}