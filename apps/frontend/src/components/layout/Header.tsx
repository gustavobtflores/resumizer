import Link from "next/link";
import Container from "./Container";

export function Header() {
  return (
    <header className="h-20 border-b border-b-border fixed top-0 left-0 right-0 bg-background z-10">
      <Container className="text-foreground p-4 flex items-center justify-between h-full">
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
      </Container>
    </header>
  );
}
