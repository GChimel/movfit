import Link from "next/link";

interface redirect {
  title?: string;
  content: string;
  link: string;
}

export function Redirect({ link, content, title }: redirect) {
  return (
    <Link
      href={link}
      title={title ? title : content}
      className="font-medium text-sm lg:text-base text-primary-green hover:text-lime-600 underline"
    >
      {content}
    </Link>
  );
}
