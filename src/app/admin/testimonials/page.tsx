"use client";

import { ResponseTestimonial } from "@/app/api/auth/testimonials/route";
import AdminHeader from "@/components/adminHeader";
import Modal from "@/components/modal";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const validation = z.object({
  content: z
    .string({ message: "Informe seu depoimento" })
    .min(10, { message: "Depoimento muito curto!" })
    .max(150, { message: "Depoimento muito longo!" }),
});

type FormData = z.infer<typeof validation>;

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ResponseTestimonial[]>([]);
  const [filtered, setFiltered] = useState<ResponseTestimonial[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<ResponseTestimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(validation),
  });

  const fetchTestimonials = async () => {
    try {
      const response = await api.get<ResponseTestimonial[]>(
        "/auth/testimonials"
      );
      setTestimonials(response.data);
      setIsLoading(false);
      toast.success("Depoimentos carregados com sucesso");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Erro ao carregar os depoimentos 😭 ");
    }
  };
  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    let result = [...testimonials];
    if (search.trim()) {
      result = result.filter(
        (t) =>
          t.user.name.toLowerCase().includes(search.toLowerCase()) ||
          t.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    result.sort((a, b) => {
      const aVal =
        sortBy === "name"
          ? a.user.name
          : sortBy === "createdAt"
          ? a.createdAt
          : a.content;
      const bVal =
        sortBy === "name"
          ? b.user.name
          : sortBy === "createdAt"
          ? b.createdAt
          : b.content;
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    setFiltered(result);
  }, [testimonials, search, sortBy, sortOrder]);

  const exportToCSV = () => {
    const header = ["Usuário", "Depoimento", "Data do depoimento"];
    const rows = filtered.map((t) => [t.user.name, t.content, t.createdAt]);
    const csv = [header, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "depoimentos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("/auth/testimonials", { data: { id } });
      toast.success("Depoimento excluído");
      setIsDeleting(false);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error("Erro ao excluir depoimento");
    }
  };

  const handleSubmitForm = async (data: Omit<FormData, "userId">) => {
    if (!session?.user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      // Edicao de depoimento
      if (editingTestimonial) {
        await api.put("/auth/testimonials", {
          id: editingTestimonial.id,
          content: data.content,
          userId: session.user.id,
        });
        toast.success("Depoimento editado com sucesso");
        setEditingTestimonial(null);
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingTestimonial.id ? { ...t, content: data.content } : t
          )
        );
        setIsModalOpen(false);
      } else {
        await api.post("/auth/testimonials", {
          ...data,
          userId: session.user.id,
        });

        toast.success("Depoimento criado com sucesso");
        fetchTestimonials();
        setValue("content", "");
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error("Erro ao criar depoimento");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <AdminHeader />
      <main className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Depoimentos</h1>
        <div className="max-w-4xl w-full">
          <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isLoading}
                title="Clique para criar um depoimento"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 cursor-pointer bg-primary-green text-primary-gray rounded font-semibold hover:bg-lime-600"
              >
                Criar depoimento
              </button>
              <button
                type="button"
                disabled={isLoading}
                title="Clique para exportar para CSV"
                onClick={exportToCSV}
                className="px-4 py-2 cursor-pointer bg-primary-green text-primary-gray rounded font-semibold hover:bg-lime-600"
              >
                Exportar para CSV
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por nome ou conteúdo..."
                className="bg-forth-gray w-80 text-sm px-3 py-1 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-forth-gray rounded px-2 py-1 text-sm"
              >
                <option value="createdAt">Data</option>
                <option value="name">Nome</option>
                <option value="content">Conteúdo</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Depoimento
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Ações
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
                      Nenhum depoimento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="bg-tertiary-gray">
                      <td
                        title={t.user.name}
                        className="px-6 py-4 text-sm text-gray-100"
                      >
                        {t.user.name}
                      </td>
                      <td
                        title={t.content}
                        className="px-6 py-4 text-sm max-w-96 truncate text-gray-100"
                      >
                        {t.content}
                      </td>
                      <td
                        title={new Date(t.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                        className="px-6 py-4 text-sm w-32 text-center text-gray-100"
                      >
                        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 w-16 text-sm text-gray-100">
                        <div className="flex gap-4">
                          <button
                            type="button"
                            title="Editar depoimento"
                            onClick={() => {
                              setEditingTestimonial(t);
                              setValue("content", t.content);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-400 hover:underline text-xs cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            title="Deletar depoimento"
                            onClick={() => {
                              setIsDeleting(true);
                              setIsDeletingId(t.id);
                            }}
                            className="text-red-400 hover:underline text-xs cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        title={editingTestimonial ? "Editar depoimento" : "Criar depoimento"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTestimonial(null);
        }}
      >
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <input
            {...register("content")}
            type="text"
            placeholder="Depoimento"
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full mt-4 flex justify-center py-2 px-4 border border-transparent text-sm rounded-md bg-primary-green text-primary-gray cursor-pointer font-bold hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            {isSubmitting
              ? editingTestimonial
                ? "Salvando..."
                : "Criando..."
              : editingTestimonial
              ? "Salvar alterações"
              : "Criar"}
          </button>
        </form>
      </Modal>
      <Modal
        title="Excluir depoimento"
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setIsDeletingId(null);
        }}
      >
        <p className="text-gray-100">
          Tem certeza que deseja excluir o depoimento?
        </p>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleDelete(isDeletingId!)}
            className="px-4 py-2 rounded bg-red-600 text-red-100 font-semibold hover:bg-red-700 hover:text-red-500"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
