"use client";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
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
        <form
          onSubmit={handleSubmit(resetPassword)}
          className="flex flex-col gap-2"
        >
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Senha"
            error={errors.password?.message}
            label="Senha"
          />

          <Button
            type="submit"
            className="w-full font-semibold mt-2"
            title="Alterar sua senha"
          >
            Alterar senha
          </Button>
        </form>
      </div>
    </div>
  );
}
