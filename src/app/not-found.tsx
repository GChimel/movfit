import { Button } from "@/components/button";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-green font-sans">
        Página não encontrada
      </h2>

      <p className="mt-2 text-center text-sm lg:text-base text-gray-400">
        Clique no botão abaixo para ser redirecionado para a home
      </p>

      <Button title="Voltar para a página inicial" href="/" className="mt-4">
        Página inicial
      </Button>
    </div>
  );
}
