"use client";

import { Progress } from "@/components/ui/progress";
import { File } from "lucide-react";
import { useEffect, useState } from "react";

export const loadingPhrases: string[] = [
  "Extraindo texto do arquivo...",
  "Identificando seções principais...",
  "Organizando experiências por data...",
  "Padronizando cargos e empresas...",
  "Coletando habilidades relevantes...",
  "Detectando palavras-chave do setor...",
  "Normalizando datas e formatos...",
  "Preparando o resumo profissional...",
  "Gerando pré-visualização...",
  "Lendo metadados e estrutura do PDF...",
  "Removendo ruído e caracteres invisíveis...",
  "Segmentando educação, experiência e skills...",
  "Corrigindo acentuação e quebras de linha...",
  "Unificando abreviações (Jr, Pleno, Sr)...",
  "Mapeando tecnologias por categoria...",
  "Validando consistência entre datas...",
  "Gerando JSON estruturado do currículo...",
  "Verificando campos obrigatórios...",
  "Separando o ouro do resto...",
  "Conversando com seus bullet points...",
  "Achando números que contam história...",
  "Checando links e contatos...",
  "Preparando um preview caprichado...",
];
const progress = [0, 13, 26, 39, 52, 65, 78, 91];

export function ResumeUploadLoading() {
  const [isDone, setIsDone] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < progress.length) {
        setIsDone(false);
        setProgressStep(progress[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <File size={40} className="mb-8" />
      <h2 className="text-2xl text-foreground/90 font-bold mb-4">
        Processando seu currículo
        <div className="inline-block ml-0.5">
          <span className="animate-bounce inline-block">.</span>
          <span className="animate-bounce inline-block delay-100">.</span>
          <span className="animate-bounce inline-block delay-200">.</span>
        </div>
      </h2>
      <Progress value={isDone ? 100 : progressStep} />
      <span className="text-secondary-foreground text-sm mt-4">
        Isso pode levar alguns segundos.
      </span>
    </div>
  );
}
