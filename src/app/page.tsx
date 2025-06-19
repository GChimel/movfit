"use client";

import { images } from "@/app/assets/images";
import { Button } from "@/components/button";
import Spinner from "@/components/spinner";
import api from "@/lib/api";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import graphIcon from "../../public/icons/bar-chart.svg";
import infoIcon from "../../public/icons/info-circle.svg";
import lockIcon from "../../public/icons/lock.svg";
import DashboardExample from "../components/dashboard";
import { ResponseTestimonial } from "./api/testimonials/route";

const whatsLink = "https://wa.me/5542999231737?text=Olá, vim pela movfit!";

const desc =
  "Uma ferramenta notável com suporte excepcional. Não poderia pedir mais.";

const benefits = [
  {
    icon: (
      <Image src={lockIcon} alt="Icone de cadeado" width={32} height={32} />
    ),
    title: "Transações rápidas e seguras",
    desc: desc,
  },
  {
    icon: (
      <Image src={infoIcon} alt="Icone de informacao" width={32} height={32} />
    ),
    title: "Interface amigável ao usuário",
    desc: desc,
  },
  {
    icon: (
      <Image src={infoIcon} alt="Icone de informacao" width={32} height={32} />
    ),
    title: "Suporte 24 horas",
    desc: desc,
  },
  {
    icon: (
      <Image src={infoIcon} alt="Icone de informacao" width={32} height={32} />
    ),
    title: "Planos de preços flexíveis",
    desc: desc,
  },
  {
    icon: (
      <Image src={infoIcon} alt="Icone de informacao" width={32} height={32} />
    ),
    title: "Integração sem costura",
    desc: desc,
  },
  {
    icon: (
      <Image src={graphIcon} alt="Icone de grafico" width={32} height={32} />
    ),
    title: "Análises abrangentes",
    desc: desc,
  },
];

const gallery = [
  images.gallery1,
  images.gallery2,
  images.gallery3,
  images.gallery4,
];

export default function Home() {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<ResponseTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Sessão finalizada com sucesso!");
    router.push("/");
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api("/testimonials");

        setTestimonials(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Falha ao buscar depoimentos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col scroll-smooth">
      <header className="fixed top-0 z-50 w-full px-4 py-3 scroll-mt-24 flex items-center justify-between bg-background border-b border-secoundary-gray">
        <div className="flex items-center gap-14">
          <span className="text-primary-green font-bold  text-xl">movefit</span>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link
              title="Ir para o início"
              href="#inicio"
              className="hover:text-primary-green"
            >
              Início
            </Link>
            <Link
              title="Ir para a sessão de beneficios"
              href="#beneficios"
              className="hover:text-primary-green"
            >
              Benefícios
            </Link>
            <Link
              title="Ir para a sessão de depoimentos"
              href="#depoimentos"
              className="hover:text-primary-green"
            >
              Depoimentos
            </Link>
            <Link
              title="Ir para a sessão de galeria"
              href="#galeria"
              className="hover:text-primary-green"
            >
              Galeria
            </Link>
          </nav>
        </div>
        <div className="flex gap-2">
          {session ? (
            <>
              <Button
                type="button"
                title="Sair"
                variant="ghost"
                onClick={handleLogout}
                className="gap-2"
              >
                Sair
                <LogOutIcon size={20} />
              </Button>
              <Button
                type="button"
                title="Minha conta"
                variant="default"
                className="font-bold"
                href={
                  session.user.role === "ADMIN" ? "/admin" : "/testimonials"
                }
              >
                {session.user.role === "ADMIN" ? "Gerencial" : "Depoimentos"}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" title="Login" variant="ghost" href="/login">
                Entrar
              </Button>
              <Button
                type="button"
                title="Teste grátis"
                variant="default"
                href="/register"
                className="font-bold"
              >
                Teste grátis
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-col min-h-screen">
        <section
          id="inicio"
          className="pt-24 flex flex-col items-center justify-center text-center py-12 px-4 min-h-screen"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, #080F17 0%, #080F17 70%, #132417 100%)
            `,
          }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Transforme sua jornada fitness
          </h1>
          <p className="max-w-4xl text-lg text-gray-300 mb-6">
            Descubra nossos planos personalizados, elaborados especialmente para
            se adequar ao seu estilo de vida. Esses planos são projetados não
            apenas para atender às suas necessidades, mas também para te
            capacitar em sua jornada rumo à realização de seus objetivos com
            facilidade e eficiência.
          </p>
          <div className="flex gap-4 justify-center mb-40">
            <Button
              className="font-semibold px-6 py-2 h-12"
              variant="default"
              href={
                !session
                  ? "/register"
                  : session.user.role === "ADMIN"
                  ? "/admin"
                  : "/testimonials"
              }
              title={
                !session
                  ? "Crie sua conta gratuitamente"
                  : session.user.role === "ADMIN"
                  ? "Área de gestão"
                  : "Depoimentos"
              }
            >
              {!session
                ? "Teste grátis"
                : session.user.role === "ADMIN"
                ? "Área de gestão"
                : "Depoimentos"}
            </Button>
            <Button
              title="Fale conosco"
              className="px-6 py-2 h-12"
              variant="outline"
              href={whatsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale conosco
            </Button>
          </div>
        </section>

        <div className="relative z-30 flex justify-center -mt-40">
          <div className="w-full max-w-[90vw] md:max-w-5xl">
            <DashboardExample />
          </div>
        </div>

        <section id="beneficios" className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Benefícios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-secoundary-background rounded-md p-6 flex flex-col gap-2 border border-secoundary-gray"
                >
                  <span className="text-3xl mb-2" aria-hidden>
                    {b.icon}
                  </span>
                  <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
                  <p className="text-gray-400 text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8  text-white">
              O que dizem nossos usuários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="md:col-span-3 grid place-items-center">
                  <Spinner />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="bg-secoundary-background rounded-md p-6 flex flex-col gap-2 border border-secoundary-gray text-white">
                  <span className="text-xl mb-2 text-primary-green">
                    Sem depoimentos
                  </span>
                  <p className="text-gray-400 text-sm">
                    &quot;Registre-se para deixar um depoimento&quot;
                  </p>
                </div>
              ) : (
                testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="bg-secoundary-background rounded-md p-6 gap-2 flex flex-col border border-secoundary-gray text-white"
                  >
                    <span className="text-xl text-primary-green">
                      {t.user.name}
                    </span>
                    <div className="break-words">
                      <p
                        title={t.content}
                        className="text-gray-400 text-sm"
                        style={{ overflowWrap: "break-word" }}
                      >
                        &quot;{t.content}&quot;
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="galeria" className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Galeria de imagens
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((src, i) => (
                <div
                  key={i}
                  className="rounded-md overflow-hidden border-2 border-secoundary-gray hover:border-primary-green transition"
                >
                  <Image
                    src={src}
                    alt={`Imagem de trineo ${i + 1}`}
                    width={300}
                    height={200}
                    className="object-cover w-full h-40"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 bg-background border-t border-secoundary-gray flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-primary-green  font-bold font-sans text-3xl">
          movefit
        </span>
        <Button
          title="Fale conosco"
          className="px-6 py-2 h-12"
          variant="outline"
          href={whatsLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fale conosco
        </Button>
      </footer>
    </div>
  );
}
