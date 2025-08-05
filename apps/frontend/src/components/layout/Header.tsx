import Link from "next/link";

export function Header() {
  return (
    <header className="text-foreground p-4 flex items-center justify-between h-20 border-b border-b-border">
      <h1 className="text-2xl font-bold">Resumizer</h1>
      <nav className="mt-2">
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/resumes" className="hover:underline">
              Currículos
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="hover:underline">
              Vagas
            </Link>
          </li>
        </ul>
      </nav>
      <div></div>
    </header>
  );
}
