"use client";

import AdminHeader from "@/components/adminHeader";
import { Button } from "@/components/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <AdminHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Gestão Administrativa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <div className="bg-primary-gray rounded-md p-6 border border-secoundary-gray flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <h2 className="font-semibold text-lg mb-2">Depoimentos</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os depoimentos .
            </p>
            <Button
              title="Acessar depoimentos"
              href="/admin/testimonials"
              className="font-semibold"
            >
              Acessar
            </Button>
          </div>
          <div className="bg-primary-gray rounded-md p-6 border border-secoundary-gray flex flex-col items-center">
            <span className="text-3xl mb-2">👤</span>
            <h2 className="font-semibold text-lg mb-2">Usuários</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Exporte e gerencie os usuários cadastrados.
            </p>
            <Button
              title="Acessar usuário"
              href="/admin/users"
              className="font-semibold"
            >
              Acessar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
