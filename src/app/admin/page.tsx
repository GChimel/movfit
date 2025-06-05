"use client";

import AdminHeader from "@/components/adminHeader";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <AdminHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Gestão Administrativa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <div className="bg-primary-gray rounded-lg p-6 border border-secoundary-gray flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <h2 className="font-semibold text-lg mb-2">Depoimentos</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os depoimentos .
            </p>
            <Link
              title="Acessar depoimentos"
              href="/admin/testimonials"
              className="px-4 py-2 rounded bg-primary-green text-primary-gray font-semibold hover:bg-lime-300 transition"
            >
              Acessar
            </Link>
          </div>
          <div className="bg-primary-gray rounded-lg p-6 border border-secoundary-gray flex flex-col items-center">
            <span className="text-3xl mb-2">👤</span>
            <h2 className="font-semibold text-lg mb-2">Usuários</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os usuários cadastrados.
            </p>
            <Link
              title="Acessar usuários"
              href="/admin/users"
              className="px-4 py-2 rounded bg-primary-green text-primary-gray font-semibold hover:bg-lime-300 transition"
            >
              Acessar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
