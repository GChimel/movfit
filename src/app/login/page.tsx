"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Modal from "@/components/modal";
import { Redirect } from "@/components/redirect";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
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
    setValue: setValueForgotPassword,
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
      setCredentialError(false);
      setValueForgotPassword("email", "");
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
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="E-mail"
              error={errors.email?.message}
              className="rounded-md-t-md"
              label="E-mail"
            />
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Senha"
              error={errors.password?.message}
              label="Senha"
              className="rounded-md-b-md"
            />
          </div>

          <div className="flex items-center justify-center ">
            <Redirect
              title="Criar conta"
              content="Ainda não tenho uma conta!"
              link="/register"
            />
          </div>

          <Button
            type="submit"
            title={isLoading ? "Entrando..." : "Entrar"}
            disabled={isLoading}
            className="w-full font-semibold"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          {credentialError && (
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setForgotPassword(true)}
              >
                Redefinir senha
              </Button>
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
            className="flex flex-col gap-2"
          >
            <p>
              Informe seu e-mail para receber um link para recuperar sua senha
            </p>

            <Input
              {...register("email")}
              id="forgot-password-email"
              type="email"
              placeholder="E-mail"
              error={errorsForgotPassword.email?.message}
              label="E-mail"
            />

            <Button
              className="w-full font-semibold mt-2"
              type="submit"
              title={
                isLoadingForgotPassword ? "Enviando..." : "Recuperar senha"
              }
            >
              {isLoadingForgotPassword ? "Enviando..." : "Recuperar senha"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
