"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Modal from "@/components/modal";
import Spinner from "@/components/spinner";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Testimonial } from "@prisma/client";
import { LogOutIcon, Pencil, Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

export default function TestimonialsPage() {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const router = useRouter();
  const [filtered, setFiltered] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(validation),
  });

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Sessão finalizada com sucesso!");
    router.push("/");
  };

  const fetchTestimonials = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await api.get<Testimonial[]>(
        `/testimonials/user/${session.user.id}`
      );
      setTestimonials(response.data);
      setFiltered(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar os depoimentos");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTestimonials();
    }
  }, [session?.user?.id, fetchTestimonials]);

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
        setValue("content", "");
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

  useEffect(() => {
    let result = [...testimonials];
    if (search.trim()) {
      result = result.filter((t) =>
        t.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    result.sort((a, b) => {
      const aVal = sortBy === "createdAt" ? a.createdAt : a.content;
      const bVal = sortBy === "createdAt" ? b.createdAt : b.content;
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    setFiltered(result);
  }, [testimonials, search, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-background border-b border-secoundary-gray">
        <span className="text-primary-green cursor-pointer font-bold text-xl font-sans">
          movefit
        </span>

        <div className="flex gap-2">
          <Button
            title="Sair"
            variant="ghost"
            onClick={handleLogout}
            className="gap-2"
          >
            Sair
            <LogOutIcon size={20} />
          </Button>
          <Button
            title="Página inicial"
            className="font-bold w-32 text-sm md:w-36"
            variant="default"
            href="/"
          >
            Página inicial
          </Button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 sm:px-8 py-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
          Seus depoimentos
        </h1>

        <div className="w-full max-w-4xl">
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Button
              type="button"
              disabled={isLoading}
              variant="default"
              title="Clique para criar um depoimento"
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-44"
            >
              {isLoading ? "Carregando..." : "Novo depoimento"}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                type="text"
                variant="dark"
                placeholder="Buscar por nome ou conteúdo..."
                className="min-w-0 w-full sm:min-w-60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-forth-gray rounded-md px-2 py-1 h-9 text-sm text-white w-full sm:w-auto sm:h-auto"
              >
                <option value="createdAt">Data</option>
                <option value="content">Conteúdo</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="bg-forth-gray rounded-md px-2 py-1 h-9 text-sm text-white w-full sm:w-auto sm:h-auto"
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
                      Nenhum depoimento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="bg-tertiary-gray">
                      <td
                        className="px-4 py-3 text-sm text-gray-100 max-w-[300px] truncate"
                        title={t.content}
                      >
                        {t.content}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-100 text-center w-[120px]"
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
          className="gap-2 flex flex-col"
        >
          <Input
            {...register("content")}
            type="text"
            placeholder="Depoimento"
            error={errors.content?.message}
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
