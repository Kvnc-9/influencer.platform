"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Instagram, Info, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Supabase Bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Para Formatı Fonksiyonu (Örn: $10,500)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Dashboard() {
  const [niche, setNiche] = useState("Spor");
  const [budget, setBudget] = useState(10000); // Varsayılan $10,000
  const [productPrice, setProductPrice] = useState(50); // Ürün $50
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const fetchInfluencers = async () => {
    setLoading(true);
    const { data } = await supabase.from("influencers").select("*").eq("niche", niche);
    
    if (data && data.length > 0) {
      calculateMetrics(data);
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  const calculateMetrics = (data) => {
    // 1. Toplam Niche İzlenmesini Bul
    const totalNicheViews = data.reduce((sum, inf) => sum + Number(inf.avg_views || 0), 0);

    const calculatedData = data.map((inf) => {
      const avgViews = Number(inf.avg_views || 0);

      // --- GERÇEKÇİLİK KATMANI ---
      // Her influencer'ın dönüşüm oranı farklıdır. 
      // Bunu simüle etmek için %1.5 ile %3.5 arası rastgele bir oran belirliyoruz.
      // Gerçek hayatta bu veri API'den "Engagement Rate" olarak gelir.
      // Sabit bir seed olmadığı için sayfa yenilendiğinde değişir, bu da analizi canlı hissettirir.
      const randomConversionRate = 0.015 + (Math.random() * 0.020); 

      // --- FORMÜLLER ---
      
      // 1. Maliyet Dağılımı (Cost of Campaign)
      // Bütçeyi izlenme payına (Share of Voice) göre dağıtıyoruz.
      const shareOfVoice = totalNicheViews > 0 ? avgViews / totalNicheViews : 0;
      const cost = budget * shareOfVoice;

      // 2. Tahmini Kazanç (Estimated Earnings)
      // Satış Adedi = İzlenme * Dönüşüm Oranı
      const estimatedSales = avgViews * randomConversionRate;
      const earnings = estimatedSales * productPrice;

      // 3. CPM (Cost Per Mille) -> (Cost / Impressions) * 1000
      // Impressions = avgViews varsayıyoruz.
      const cpm = avgViews > 0 ? (cost / avgViews) * 1000 : 0;

      // 4. RPM (Revenue Per Mille) -> (Earnings / Page Views) * 1000
      const rpm = avgViews > 0 ? (earnings / avgViews) * 1000 : 0;

      // 5. ROI (Return on Investment) -> ((Earnings - Cost) / Cost) * 100
      const profit = earnings - cost;
      const roiPercentage = cost > 0 ? ((profit / cost) * 100) : 0;

      return {
        username: inf.username,
        avg_views: avgViews,
        conversionRate: (randomConversionRate * 100).toFixed(2), // Şeffaflık için
        cost: cost,
        earnings: earnings,
        profit: profit,
        roi: roiPercentage.toFixed(1), // % olarak ROI
        cpm: cpm.toFixed(2),
        rpm: rpm.toFixed(2)
      };
    });

    // Kâra göre sırala
    setResults(calculatedData.sort((a, b) => b.profit - a.profit));
  };

  useEffect(() => {
    fetchInfluencers();
  }, [niche, budget, productPrice]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Üst Başlık */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <TrendingUp className="text-indigo-600"/> Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kampanya Simülasyonu ve ROI Analizi</p>
          </div>
          <button 
            onClick={() => setShowFormula(!showFormula)}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            <Info size={18} /> Hesaplama Mantığı
          </button>
        </header>

        {/* Formül Açıklaması (Popup) */}
        {showFormula && (
          <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg animate-in slide-in-from-top-2">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">Kullanılan Formüller</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">RPM (Revenue Per Mille)</span>
                    <code>(Tahmini Kazanç / İzlenme) * 1000</code>
                    <p className="text-slate-400 text-xs mt-2">1000 gösterim başına elde edilen tahmini gelir.</p>
                </div>
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">CPM (Cost Per Mille)</span>
                    <code>(Maliyet / Toplam Gösterim) * 1000</code>
                    <p className="text-slate-400 text-xs mt-2">1000 gösterim için influencer'a ödenen maliyet.</p>
                </div>
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">ROI (Yatırım Getirisi)</span>
                    <code>((Gelir - Maliyet) / Maliyet) * 100</code>
                    <p className="text-slate-400 text-xs mt-2">Yatırımın kârlılık yüzdesi.</p>
                </div>
            </div>
          </div>
        )}

        {/* GİRDİ ALANLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Niche)</label>
                <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700">
                    <option value="Spor">Spor & Fitness</option>
                    <option value="Güzellik">Güzellik & Bakım</option>
                    <option value="Teknoloji">Teknoloji</option>
                    <option value="Yemek">Yemek & Gurme</option>
                </select>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kampanya Bütçesi</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-slate-800" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ürün Satış Fiyatı</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-green-700" />
                </div>
            </div>
        </div>

        {/* GRAFİKLER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Kâr Grafiği */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2 h-80">
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <ArrowUpRight className="text-green-500" size={20}/> Tahmini Net Kâr
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="username" hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Net Kâr" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Maliyet Pastası */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <ArrowDownRight className="text-indigo-500" size={20}/> Bütçe Dağılımı
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={results} 
                            dataKey="cost" 
                            nameKey="username" 
                            cx="50%" cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5}
                            fill="#8884d8"
                        >
                            {results.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899', '#3b82f6'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-[-110px]">
                    <span className="block text-3xl font-bold text-slate-800">{results.length}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold">Influencer</span>
                </div>
            </div>
        </div>

        {/* DETAYLI TABLO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="p-5 font-bold">Influencer</th>
                        <th className="p-5 font-bold">Maliyet (Cost)</th>
                        <th className="p-5 font-bold">Gelir (Revenue)</th>
                        <th className="p-5 font-bold">Net Kâr</th>
                        <th className="p-5 font-bold">ROI (%)</th>
                        <th className="p-5 font-bold">Metrikler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {results.map((row) => (
                        <tr key={row.username} className="hover:bg-indigo-50/30 transition duration-200">
                            <td className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] rounded-full">
                                        <div className="bg-white p-1 rounded-full">
                                            <Instagram size={16} className="text-slate-800"/> 
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-700 text-sm">@{row.username}</span>
                                        <span className="text-xs text-slate-400">{row.avg_views.toLocaleString()} izlenme</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5 text-sm font-semibold text-slate-600">
                                {formatCurrency(row.cost)}
                            </td>
                            <td className="p-5 text-sm font-semibold text-slate-600">
                                {formatCurrency(row.earnings)}
                            </td>
                            <td className="p-5">
                                <span className={`text-sm font-bold ${row.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {row.profit > 0 ? '+' : ''}{formatCurrency(row.profit)}
                                </span>
                            </td>
                            <td className="p-5">
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                    Number(row.roi) > 0 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {Number(row.roi) > 0 ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                                    %{row.roi}
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="flex flex-col gap-1 text-xs">
                                    <div className="flex justify-between w-24">
                                        <span className="text-slate-400 font-medium">CPM:</span>
                                        <span className="font-bold text-slate-700">${row.cpm}</span>
                                    </div>
                                    <div className="flex justify-between w-24">
                                        <span className="text-slate-400 font-medium">RPM:</span>
                                        <span className="font-bold text-indigo-600">${row.rpm}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {results.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-400">
                    Bu kategoride henüz veri yok.
                </div>
            )}
        </div>

      </div>
    </div>
  );
}