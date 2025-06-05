"use client";

import Modal from "@/components/modal";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido!"),
  password: z
    .string()
    .min(6, "Senha mutio curta! Ela deve ser maior que 6 caracteres!"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido!"),
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [credentialError, setCredentialError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: {
      errors: errorsForgotPassword,
      isLoading: isLoadingForgotPassword,
    },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas");
        setCredentialError(true);
        return;
      }

      router.push("/admin");
      toast.success("Login realizado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForgotPasswordEmail = async (data: ForgotPasswordForm) => {
    try {
      await api.post("/forgot-password", data);
      toast.success("Instruções de redefinição de senha enviadas");
      setForgotPassword(false);
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Erro inesperado");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-lime-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-green font-sans">
            Já tem uma conta?
          </h2>

          <p className="mt-2 text-center text-sm lg:text-base text-gray-400">
            Faça login para compartilhar seu depoimento de forma personalizada.
            Sua voz é essencial para aprimorarmos cada passo da jornada!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-t-md focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm lg:text-base"
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

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                href="/register"
                className="font-medium text-sm lg:text-base text-primary-green hover:text-lime-600 underline"
              >
                Ainda não tenho uma conta!
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm lg:text-base rounded-md bg-primary-green text-primary-gray cursor-pointer font-bold hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {credentialError && (
            <div className="flex items-center justify-center">
              <button
                onClick={() => setForgotPassword(true)}
                className="font-medium text-sm lg:text-base text-primary-green  hover:text-lime-600"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </form>
        <Modal
          title="Recuperar senha"
          isOpen={forgotPassword}
          onClose={() => setForgotPassword(false)}
        >
          <form
            onSubmit={handleSubmitForgotPassword(
              handleSubmitForgotPasswordEmail
            )}
          >
            <p>
              Informe seu e-mail para receber um link para recuperar sua senha
            </p>

            <div className="mt-4">
              <input
                id="forgot-password-email"
                type="email"
                placeholder="E-mail"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-primary-green focus:border-primary-green focus:z-10 sm:text-sm"
                {...registerForgotPassword("email", { required: true })}
              />
              {errorsForgotPassword.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsForgotPassword.email.message}
                </p>
              )}
            </div>
            <button
              disabled={isLoadingForgotPassword}
              type="submit"
              className="group relative w-full mt-4 flex justify-center py-2 px-4 border border-transparent text-sm rounded-md bg-primary-green text-primary-gray cursor-pointer font-bold hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              {isLoadingForgotPassword ? "Enviando..." : "Recuperar senha"}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
