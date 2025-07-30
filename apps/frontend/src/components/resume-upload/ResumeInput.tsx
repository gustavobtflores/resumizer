"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ResumeInput() {
  const [file, setFile] = useState<File | null>(null);

  async function handleFileSubmit() {
    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    await fetch("http://localhost:8080/resume", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar o arquivo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Currículo enviado com sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao enviar o currículo:", error);
      });
  }

  return (
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
          Arquivo selecionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </p>
      )}
      <Button className="self-end cursor-pointer" onClick={handleFileSubmit}>
        Continuar
      </Button>
    </div>
  );
}
