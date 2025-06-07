"use client";

import AdminHeader from "@/components/adminHeader";
import { Button } from "@/components/button";
import Spinner from "@/components/spinner";
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
        const response = await api.get("/users");
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.error("Erro ao carregar usuários ");
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
      <main className="flex flex-col items-center justify-center px-4 sm:px-8 py-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
          Usuários cadastrados
        </h1>
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Button
              disabled={isLoading}
              type="button"
              variant="default"
              title="Clique para exportar para CSV"
              onClick={exportToCSV}
              className="w-full sm:w-auto"
            >
              Exportar para CSV
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-forth-gray rounded-md px-2 h-9 text-sm text-white w-full sm:w-auto "
              >
                <option value="">Todos</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                className="bg-forth-gray rounded-md px-2 h-9 text-sm text-white w-full sm:w-auto "
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md shadow-sm">
            <table className="min-w-full divide-y divide-gray-900">
              <thead className="bg-forth-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    E-mail
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Perfil
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-sm text-gray-500 text-center"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="bg-tertiary-gray">
                      <td
                        className="px-4 py-3 text-sm text-gray-100 max-w-[240px] truncate"
                        title={user.name}
                      >
                        {user.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-100 whitespace-nowrap"
                        title={user.email}
                      >
                        {user.email}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-center"
                        title={user.role}
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
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
