import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "./button";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Sessão finalizada com sucesso!");
    router.push("/");
  };

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-background border-b border-secoundary-gray">
      <Link
        title="Página de administração"
        href="/admin"
        className="text-primary-green cursor-pointer font-bold text-xl font-sans"
      >
        movefit admin
      </Link>

      <div className="flex gap-2">
        <Button
          title="Sair"
          type="button"
          variant="ghost"
          onClick={handleLogout}
          className="gap-2"
        >
          Sair
          <LogOutIcon size={20} />
        </Button>
        <Button
          type="button"
          title="Página inícial"
          variant="default"
          href="/"
          className="font-bold w-32 text-sm md:w-36"
        >
          Página inícial
        </Button>
      </div>
    </header>
  );
}
