"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeUploadLoading } from "./ResumeUploadLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResumeUploadInput() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();

  async function handleFileSubmit() {
    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    await fetch("http://localhost:8080/resumes", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar o arquivo");
        }
      })
      .then((data) => {
        console.log("Currículo enviado com sucesso:", data);
        setIsDone(true);
        router.push("/resumes");
      })
      .catch((error) => {
        console.error("Erro ao enviar o currículo:", error);
        setIsLoading(false);
      });
  }

  return (
    <Card className="w-lg">
      {isLoading ? (
        <CardContent>
          <ResumeUploadLoading isDone={isDone} />
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Faça o upload do seu currículo</CardTitle>
            <CardDescription>
              Selecione o arquivo do seu currículo para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="resume">Currículo</Label>
                <Input
                  id="resume"
                  type="file"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                />
              </div>
              {file && (
                <p>
                  Arquivo selecionado: {file.name} (
                  {(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              <Button
                className="self-end cursor-pointer"
                onClick={handleFileSubmit}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
