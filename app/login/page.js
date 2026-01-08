"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Supabase İstemcisi
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Giriş mi Kayıt mı?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      // --- GİRİŞ YAPMA KODU ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message); // Örn: "Şifre yanlış"
      } else {
        router.push("/dashboard"); // Başarılıysa panele git
      }
    } else {
      // --- KAYIT OLMA KODU ---
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Otomatik giriş yapıp yönlendir
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {isLogin ? "Tekrar Hoşgeldin" : "Hesap Oluştur"}
            </h2>
            <p className="text-gray-500 font-medium">
                {isLogin ? "Hesabına giriş yap ve analize başla." : "30 saniyede ücretsiz kayıt ol."}
            </p>
        </div>

        {/* Hata Mesajı Kutusu */}
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                ⚠️ {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">E-posta Adresi</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                    placeholder="ornek@sirket.com"
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                    placeholder="En az 6 karakter"
                    required 
                />
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "İşlem yapılıyor..." : (isLogin ? "Giriş Yap" : "Kayıt Ol")}
            </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
                {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    className="ml-2 text-indigo-600 font-bold hover:underline"
                >
                    {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}