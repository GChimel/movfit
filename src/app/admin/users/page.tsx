"use client";

import AdminHeader from "@/components/adminHeader";
import api from "@/lib/api";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/auth/users");
        setUsers(response.data);
        setIsLoading(false);
        toast.success("Usuários carregados com sucesso");
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.error("Erro ao carregar usuários 😭 ");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filteredUsers = [...users];
    if (roleFilter) {
      filteredUsers = filteredUsers.filter((u) => u.role === roleFilter);
    }
    filteredUsers.sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    setFiltered(filteredUsers);
  }, [users, roleFilter, sort]);

  const exportToCSV = () => {
    const header = ["Nome", "Email", "Perfil"];
    const rows = filtered.map((user) => [user.name, user.email, user.role]);
    const csv = [header, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <AdminHeader />
      <main className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Usuários cadastrados
        </h1>
        <div className="max-w-4xl w-full  max-h-10/12 overflow-auto">
          <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
            <button
              title="Exportar para CSV"
              type="button"
              onClick={exportToCSV}
              className="px-4 py-2 bg-primary-green text-primary-gray rounded font-semibold hover:bg-lime-600"
            >
              Exportar para CSV
            </button>

            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-forth-gray rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                className="bg-forth-gray rounded px-2 py-1 text-sm"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-900">
              <thead className="bg-forth-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3  text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3  text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Perfil
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="bg-tertiary-gray ">
                      <td
                        title={user.name}
                        className="px-6 py-4 w-60 truncate whitespace-nowrap text-sm text-gray-100"
                      >
                        {user.name}
                      </td>
                      <td
                        title={user.email}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
                      >
                        {user.email}
                      </td>
                      <td
                        title={user.role}
                        className="px-6 py-4 w-20 whitespace-nowrap"
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
