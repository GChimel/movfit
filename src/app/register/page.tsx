"use client";

import { Button } from "@/components/button";
import { Redirect } from "@/components/redirect";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const registerSchema = z.object({
  name: z
    .string({ message: "Informe seu nome!" })
    .min(4, { message: "Nome muito curto!" }),
  email: z.string().email("E-mail inválido!"),
  password: z
    .string()
    .min(6, "Senha mutio curta! Ela deve ser maior que 6 caracteres!"),
});

type registerForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: registerForm) => {
    try {
      setIsLoading(true);

      await api.post("/register", data);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas");
        return;
      }

      router.push("/admin");
      toast.success("Registro e login realizado com sucesso");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          toast.error("Email já cadastrado!");
        }
      } else {
        toast.error("Erro inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-lime-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-green font-sans">
            Criar nova conta
          </h2>

          <p className="mt-2 text-center text-sm lg:text-base text-gray-400">
            Junte-se a nós e comece sua jornada fitness com o suporte que você
            merece!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-t-md focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm lg:text-base"
                placeholder="Nome"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm lg:text-base"
                placeholder="E-mail"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-b-md focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm lg:text-base"
                placeholder="Senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center ">
            <Redirect
              title="Já tenho uma conta"
              content="Já tenho uma conta"
              link="/login"
            />
          </div>

          <Button
            type="submit"
            title={isLoading ? "Criando sua conta..." : "Criar conta"}
            disabled={isLoading}
            className="w-full font-semibold"
          >
            {isLoading ? "Criando sua conta..." : "Criar conta"}
          </Button>
        </form>
      </div>
    </div>
  );
}
