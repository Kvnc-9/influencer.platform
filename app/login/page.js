"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Burada normalde Supabase Auth işlemi olur
    // Şimdilik demo olduğu için direkt panele atıyoruz
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Giriş Yap</h2>
        <p className="text-slate-400 text-center mb-8">ROI Master hesabınıza erişin</p>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                <input type="email" placeholder="ornek@sirket.com" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                Giriş Yap
            </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-slate-400">
            Hesabın yok mu? <Link href="#" className="text-indigo-600 font-medium">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}