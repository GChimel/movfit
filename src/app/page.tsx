"use client";

import assets from "@/app/assets/images";
import Image from "next/image";
import Link from "next/link";
import graphIcon from "../../public/icons/bar-chart.svg";
import infoIcon from "../../public/icons/info-circle.svg";
import lockIcon from "../../public/icons/lock.svg";
import DashboardExample from "./components/dashboard";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role?: string;
  image?: string;
}

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
  assets.gallery1,
  assets.gallery2,
  assets.gallery3,
  assets.gallery4,
];

export default function Home() {
  // const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // console.log(testimonials);
  // console.log(isLoading);

  // useEffect(() => {
  //   fetchTestimonials();
  // }, []);

  // const fetchTestimonials = async () => {
  //   try {
  //     const response = await fetch("/api/testimonials");
  //     const data = await response.json();
  //     setTestimonials(data);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Falha ao buscar depoimentos");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#080F17] text-white flex flex-col scroll-smooth">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full px-4 py-3 scroll-mt-24 flex items-center justify-between bg-[#080F17] border-b border-[#232b33]">
        <div className="flex items-center gap-14">
          <span className="text-lime-400 font-bold  text-xl">movefit</span>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="#inicio" className="hover:text-lime-400">
              Início
            </Link>
            <Link href="#beneficios" className="hover:text-lime-400">
              Benefícios
            </Link>
            <Link href="#depoimentos" className="hover:text-lime-400">
              Depoimentos
            </Link>
            <Link href="#galeria" className="hover:text-lime-400">
              Galeria
            </Link>
          </nav>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="px-4 py-1 rounded bg-transparent  hover:text-[#181f26] transition hover:bg-white"
          >
            Login
          </Link>

          <Link
            href="#"
            className="px-4 py-1 rounded bg-lime-400 text-[#181f26] font-semibold hover:bg-lime-300 transition"
          >
            Teste grátis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col min-h-screen">
        <section
          id="inicio"
          className="pt-24 flex flex-col items-center justify-center text-center py-12 px-4 min-h-screen relative"
          style={{
            background:
              "radial-gradient(circle, rgba(162, 210, 96, 0.06) 0%, #080F17 100%)",
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
            <Link
              href="#"
              title="Teste grátis"
              className="px-6 py-2 rounded bg-lime-400 text-[#181f26] font-semibold hover:bg-lime-300 transition"
            >
              Teste grátis
            </Link>
            <Link
              href="#"
              title="Fale conosco"
              className="px-6 py-2 rounded border border-white text-white hover:bg-white hover:text-[#181f26] transition"
            >
              Fale conosco
            </Link>
          </div>
        </section>

        {/* Dashboard flutuando entre seções */}
        <div className="relative z-30 flex justify-center -mt-40">
          <div className="w-full max-w-[90vw] md:max-w-5xl">
            <DashboardExample />
          </div>
        </div>

        {/* Benefícios */}
        <section id="beneficios" className="py-16 px-4 bg-[#080F17]">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-[#121820] rounded-lg p-6 flex flex-col gap-2 border border-[#232b33]"
              >
                <span className="text-3xl mb-2" aria-hidden>
                  {b.icon}
                </span>
                <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
                <p className="text-gray-400 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Galeria de imagens */}
        <section id="galeria" className="py-16 px-4 bg-[#080F17]">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Galeria de imagens
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {gallery.map((src, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden border-2 border-[#232b33] hover:border-lime-400 transition"
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
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 bg-[#080F17] border-t border-[#232b33] flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lime-400  font-bold font-sans text-3xl">
          movefit
        </span>
        <Link
          href="#"
          title="Fale conosco"
          className="px-6 py-2 rounded border border-white text-white hover:bg-white hover:text-[#181f26] transition"
        >
          Fale conosco
        </Link>
      </footer>
    </div>
  );
}
