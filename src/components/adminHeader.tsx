import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-background border-b border-secoundary-gray">
      <Link
        title="Página de administração"
        href="/admin"
        className="text-primary-green cursor-pointer font-bold text-lg font-sans"
      >
        movefit admin
      </Link>

      <div className="flex gap-2">
        <button
          type="button"
          title="Sair"
          onClick={handleLogout}
          className="flex cursor-pointer gap-2 items-center px-4 py-1 rounded bg-transparent hover:text-primary-gray transition hover:bg-white"
        >
          Sair
          <LogOutIcon size={20} />
        </button>

        <Link
          href="/"
          title="Voltar ao site"
          className="px-4 py-1 cursor-pointer  rounded bg-primary-green text-primary-gray font-semibold hover:bg-lime-300 transition"
        >
          Voltar ao site
        </Link>
      </div>
    </header>
  );
}
