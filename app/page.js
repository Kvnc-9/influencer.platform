"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Supabase Bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [niche, setNiche] = useState("Spor");
  const [budget, setBudget] = useState(50000);
  const [productPrice, setProductPrice] = useState(500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verileri Çek ve Hesapla
  const fetchInfluencers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .eq("niche", niche); // Niche filtresi

    if (data && data.length > 0) {
      calculateROI(data);
    } else {
      setResults([]); // Veri yoksa tabloyu temizle
    }
    setLoading(false);
  };

  // Hesaplama Motoru
  const calculateROI = (data) => {
    // 1. Toplam Niche İzlenmesini Bul
    // (ParseInt kullanıyoruz çünkü veritabanından bazen string gelebilir)
    const totalNicheViews = data.reduce((sum, inf) => sum + Number(inf.avg_views || 0), 0);
    const conversionRate = 0.02; // %2 Dönüşüm oranı

    const calculatedData = data.map((inf) => {
      const avgViews = Number(inf.avg_views || 0);
      
      // Bütçe Payı (Share of Voice)
      const shareOfVoice = totalNicheViews > 0 ? avgViews / totalNicheViews : 0;
      const cost = budget * shareOfVoice;

      // Gelir Tahmini
      const sales = avgViews * conversionRate;
      const earnings = sales * productPrice;

      // Metrikler
      const profit = earnings - cost;
      const roi = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;
      const cpm = avgViews > 0 ? ((cost / avgViews) * 1000).toFixed(2) : 0;
      const rpm = avgViews > 0 ? ((earnings / avgViews) * 1000).toFixed(2) : 0;

      return {
        username: inf.username,
        avg_views: avgViews,
        cost: Math.round(cost),
        earnings: Math.round(earnings),
        profit: Math.round(profit),
        roi: roi,
        cpm: cpm,
        rpm: rpm,
      };
    });

    // Kâra göre sırala (En kârlı en üstte)
    setResults(calculatedData.sort((a, b) => b.profit - a.profit));
  };

  useEffect(() => {
    fetchInfluencers();
  }, [niche, budget, productPrice]);

  // Yeni Influencer Ekleme (Webhook)
  const handleAddInfluencer = () => {
    const user = prompt("Instagram kullanıcı adını girin (Örn: cristiano):");
    if (!user) return;

    // SENİN MAKE.COM WEBHOOK LİNKİN BURAYA GELECEK
    const webhookUrl = "https://hook.eu1.make.com/ixxd5cuuqkhhkpd8sqn5soiyol0a952x";

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user })
    })
    .then(() => alert("İşlem başlatıldı! 1-2 dakika içinde listeye eklenecek."))
    .catch(() => alert("Bir hata oluştu."));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-indigo-700">ROI Master 🚀</h1>
                <p className="text-gray-500">Influencer Bütçe Optimizasyon Aracı</p>
            </div>
            <button 
                onClick={handleAddInfluencer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
                + Yeni Influencer Ekle
            </button>
        </header>

        {/* Input Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategori (Niche)</label>
            <select 
              value={niche} 
              onChange={(e) => setNiche(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Spor">Spor</option>
              <option value="Güzellik">Güzellik</option>
              <option value="Teknoloji">Teknoloji</option>
              <option value="Yemek">Yemek</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Toplam Bütçe (TL)</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ürün Fiyatı (TL)</label>
            <input 
              type="number" 
              value={productPrice} 
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-400">Veriler yükleniyor...</div>
        ) : (
            <>
                {/* Grafikler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Sol: Kâr Grafiği */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="font-semibold mb-4 text-gray-700">Tahmini Net Kâr (TL)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results} margin={{ bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="username" hide />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Kâr" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Sağ: Bütçe Pastası */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                    <h3 className="font-semibold mb-4 text-gray-700">Bütçe Dağılımı</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie 
                            data={results} 
                            dataKey="cost" 
                            nameKey="username" 
                            cx="50%" cy="50%" 
                            outerRadius={80} 
                            fill="#6366f1" 
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {results.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'][index % 6]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Detaylı Tablo */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-semibold">Influencer</th>
                        <th className="p-4 font-semibold">İzlenme (Ort)</th>
                        <th className="p-4 font-semibold text-indigo-600">Bütçe Payı</th>
                        <th className="p-4 font-semibold text-green-600">Net Kâr</th>
                        <th className="p-4 font-semibold">ROI</th>
                        <th className="p-4 font-semibold">CPM / RPM</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {results.map((row) => (
                        <tr key={row.username} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-800">@{row.username}</td>
                        <td className="p-4 text-gray-500">{row.avg_views.toLocaleString()}</td>
                        <td className="p-4 font-bold text-indigo-600">{row.cost.toLocaleString()} ₺</td>
                        <td className="p-4 font-bold text-green-600">{row.profit.toLocaleString()} ₺</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${Number(row.roi) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                %{row.roi}
                            </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                            CPM: {row.cpm}<br/>RPM: {row.rpm}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {results.length === 0 && (
                    <div className="p-8 text-center text-gray-400">Bu kategoride henüz veri yok.</div>
                )}
                </div>
            </>
        )}
      </div>
    </div>
  );
}