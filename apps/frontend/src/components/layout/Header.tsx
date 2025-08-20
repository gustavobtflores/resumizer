"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <header className="h-20 border-b border-b-border fixed top-0 left-0 right-0 bg-background z-10">
      <Container className="text-foreground p-4 flex items-center h-full gap-20">
        <h1 className="text-2xl font-bold">Resumizer</h1>
        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/resumes"
                className={`pb-1 border-b-2 transition-colors font-medium ${
                  isActive("/resumes")
                    ? "border-b-primary text-primary"
                    : "border-b-transparent"
                }`}
              >
                Currículos
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className={`pb-1 border-b-2 transition-colors font-medium ${
                  isActive("/jobs")
                    ? "border-b-primary text-primary"
                    : "border-b-transparent"
                }`}
              >
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
