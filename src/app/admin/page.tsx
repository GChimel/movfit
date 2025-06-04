"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#10151a] text-white flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-[#181f26] border-b border-[#232b33]">
        <span className="text-lime-400 font-bold text-lg">movefit admin</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="hover:text-lime-400">
            Depoimentos
          </Link>
          <Link href="/admin/leads" className="hover:text-lime-400">
            Leads
          </Link>
          <Link href="/admin/usuarios" className="hover:text-lime-400">
            Usuários
          </Link>
          <Link href="/" className="hover:text-lime-400">
            Voltar ao site
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Gestão Administrativa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-[#181f26] rounded-lg p-6 border border-[#232b33] flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <h2 className="font-semibold text-lg mb-2">Depoimentos</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Cadastre, edite, exclua e gerencie depoimentos exibidos na landing
              page.
            </p>
            <Link
              href="/admin"
              className="px-4 py-2 rounded bg-lime-400 text-[#181f26] font-semibold hover:bg-lime-300 transition"
            >
              Acessar
            </Link>
          </div>
          <div className="bg-[#181f26] rounded-lg p-6 border border-[#232b33] flex flex-col items-center">
            <span className="text-3xl mb-2">📋</span>
            <h2 className="font-semibold text-lg mb-2">Leads</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os leads cadastrados no site.
            </p>
            <Link
              href="/admin/leads"
              className="px-4 py-2 rounded bg-lime-400 text-[#181f26] font-semibold hover:bg-lime-300 transition"
            >
              Acessar
            </Link>
          </div>
          <div className="bg-[#181f26] rounded-lg p-6 border border-[#232b33] flex flex-col items-center">
            <span className="text-3xl mb-2">👤</span>
            <h2 className="font-semibold text-lg mb-2">Usuários</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os usuários cadastrados.
            </p>
            <Link
              href="/admin/usuarios"
              className="px-4 py-2 rounded bg-lime-400 text-[#181f26] font-semibold hover:bg-lime-300 transition"
            >
              Acessar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
