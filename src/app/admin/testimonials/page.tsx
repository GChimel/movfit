"use client";

import { ResponseTestimonial } from "@/app/api/testimonials/route";
import AdminHeader from "@/components/adminHeader";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Modal from "@/components/modal";
import Spinner from "@/components/spinner";
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
      const response = await api.get<ResponseTestimonial[]>("/testimonials");
      setTestimonials(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Erro ao carregar os depoimentos");
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
      await api.delete("/testimonials", { data: { id } });
      toast.success("Depoimento excluído");
      setIsDeleting(false);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir depoimento");
    }
  };

  const handleSubmitForm = async (data: Omit<FormData, "userId">) => {
    if (!session?.user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      if (editingTestimonial) {
        await api.put("/testimonials", {
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
        await api.post("/testimonials", {
          ...data,
          userId: session.user.id,
        });

        toast.success("Depoimento criado com sucesso");
        fetchTestimonials();
        setValue("content", "");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar depoimento");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <AdminHeader />
      <main className="flex flex-col items-center justify-center px-4 sm:px-8 py-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
          Depoimentos
        </h1>
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button
                type="button"
                disabled={isLoading}
                variant="default"
                className="md:min-w-44"
                title="Clique para criar um depoimento"
                onClick={() => setIsModalOpen(true)}
              >
                {isLoading ? "Carregando..." : "Novo depoimento"}
              </Button>
              <Button
                disabled={isLoading}
                type="button"
                variant="default"
                title="Clique para exportar para CSV"
                className="md:min-w-44"
                onClick={exportToCSV}
              >
                Exportar para CSV
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                type="text"
                variant="dark"
                placeholder="Buscar por nome ou depoimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 w-full sm:min-w-60"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-forth-gray rounded-md px-2 py-1 text-sm h-9 sm:w-auto sm:h-auto text-white"
              >
                <option value="createdAt">Data</option>
                <option value="name">Nome</option>
                <option value="content">Depoimento</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="bg-forth-gray rounded-md px-2 py-1 text-sm h-9 sm:w-auto sm:h-auto text-white"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-900">
              <thead className="bg-forth-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Depoimento
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Data
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-100 uppercase whitespace-nowrap">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-sm text-gray-500 text-center"
                    >
                      Nenhum depoimento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="bg-tertiary-gray">
                      <td
                        className="px-4 py-3 text-sm text-gray-100 whitespace-nowrap max-w-[180px] truncate"
                        title={t.user.name}
                      >
                        {t.user.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-100 whitespace-nowrap max-w-[300px] truncate"
                        title={t.content}
                      >
                        {t.content}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-100 text-center w-[120px] whitespace-nowrap"
                        title={new Date(t.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      >
                        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-sm w-20 text-gray-100 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            type="button"
                            title="Editar depoimento"
                            onClick={() => {
                              setEditingTestimonial(t);
                              setValue("content", t.content);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            title="Deletar depoimento"
                            onClick={() => {
                              setIsDeleting(true);
                              setIsDeletingId(t.id);
                            }}
                            className="text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash size={18} />
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
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-2"
        >
          <Input
            {...register("content")}
            id="content"
            type="text"
            placeholder="Depoimento"
            error={errors.content?.message}
            label="content"
            className="rounded-md"
          />

          <Button
            type="submit"
            className="w-full font-semibold mt-2"
            title={""}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? editingTestimonial
                ? "Salvando..."
                : "Criando..."
              : editingTestimonial
              ? "Salvar alterações"
              : "Criar"}
          </Button>
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
            className="px-4 py-2 rounded-md bg-red-600 cursor-pointer text-red-100 font-semibold hover:bg-red-700 hover:text-red-500"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
