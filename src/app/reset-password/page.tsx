"use client";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const validation = z.object({
  password: z
    .string({ message: "Informe sua senha!" })
    .min(6, "Senha mutio curta! Ela deve ser maior que 6 caracteres!"),
  token: z.string(),
});

type FormData = z.infer<typeof validation>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validation),
    defaultValues: {
      password: "",
    },
  });

  setValue("token", token as string);

  const resetPassword = async (data: FormData) => {
    try {
      await api.put("/forgot-password", data);
      toast.success("Senha alterada com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao alterar senha!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-lime-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-green font-sans">
          Recuperação de senha
        </h2>
        <p className="mt-2 text-center text-sm lg:text-base text-gray-400">
          Defina sua nova senha de acesso
        </p>
        <form onSubmit={handleSubmit(resetPassword)}>
          <input
            type="password"
            placeholder="Nova senha"
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            title="Alterar senha"
            className="group relative w-full mt-4 flex justify-center py-2 px-4 border border-transparent text-sm rounded-md bg-primary-green text-primary-gray cursor-pointer font-bold hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  );
}
