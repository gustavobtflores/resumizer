import { CircularProgress } from "@/components/CircularProgress";
import Container from "@/components/layout/Container";
import clsx from "clsx";
import {
  CheckCheck,
  CheckCircle,
  CircleAlert,
  CircleFadingArrowUp,
  CircleQuestionMark,
  KeyRound,
  PencilLine,
} from "lucide-react";

const METRICS_LABELS = {
  skills_tech: "Habilidades técnicas",
  soft_process: "Competências comportamentais",
  impact_results: "Impacto e Resultados",
  domain_industry: "Conhecimento de Domínio/Setor",
  education_certs: "Formação e Certificações",
  experience_scope: "Escopo da Experiência",
  location_logistics: "Localização e Logística",
} as const;

const METRICS_TAGS = [
  {
    label: "Muito baixo",
    color: "bg-red-500/10 text-red-500",
  },
  {
    label: "Baixo",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    label: "Médio",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Alto",
    color: "bg-green-500/10 text-green-500",
  },
  {
    label: "Muito alto",
    color: "bg-purple-500/10 text-purple-500",
  },
];

type Job = {
  id: string;
  evaluation: {
    job_title: string;
    company: string;
    match_score: number;
    strengths: string[];
    risks_or_flags: string[];
    keyword_coverage: { keyword: string; present: boolean }[];
    interview_prep_questions: string[];
    tailoring_suggestions: {
      priority: number;
      rationale: string;
      suggestion: string;
      estimated_impact: "high" | "medium" | "low";
    }[];
    subscores: {
      skills_tech: number;
      soft_process: number;
      impact_results: number;
      domain_industry: number;
      education_certs: number;
      experience_scope: number;
      location_logistics: number;
    };
  };
};

export default async function JobView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`http://localhost:8080/jobs/${id}`);
  const data: Job = await response.json();

  return (
    <Container className="py-20">
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              {data.evaluation.job_title}
            </h1>
            <span className="text-lg text-muted-foreground">
              {data.evaluation.company}
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <CircularProgress
              value={data.evaluation.match_score}
              size={60}
              strokeWidth={4}
            />
            <span className="text-xs text-muted-foreground">Match</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-20 pb-10 border-b border-b-border">
          {Object.entries(data.evaluation.subscores).map(([metric, score]) => (
            <div
              key={metric}
              className="flex flex-col border border-border rounded-md px-4 py-3 gap-4 flex-1"
            >
              <span className="text-xs">
                {METRICS_LABELS[metric as keyof typeof METRICS_LABELS]}
              </span>
              <div className="flex items-center justify-between">
                <strong className="font-semibold text-2xl">{score}</strong>
                <span
                  className={`${
                    METRICS_TAGS[Math.floor(score / 22.5)]?.color
                  } text-xs rounded-full px-2 py-1 font-semibold`}
                >
                  {METRICS_TAGS[Math.floor(score / 22.5)]?.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-30">
        <div>
          <strong className="text-green-500 mb-4 block">Pontos fortes</strong>
          <div className="flex flex-col gap-2">
            {data.evaluation.strengths.map((strength: string) => (
              <div
                key={strength}
                className="px-4 py-2 bg-green-500/10 text-sm flex items-center gap-4 rounded-md"
              >
                <div className="size-[6px] bg-green-500 rounded-full shrink-0"></div>
                <span className="">{strength}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong className="text-red-500 mb-4 block">
            Riscos ou pontos de melhoria
          </strong>
          <div className="flex flex-col gap-2">
            {data.evaluation.risks_or_flags.map((risk: string) => (
              <div
                key={risk}
                className="px-4 py-2 bg-red-500/10 text-sm flex items-center gap-4 rounded-md"
              >
                <div className="size-[6px] bg-red-500 rounded-full shrink-0"></div>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-8">
        <div className="col-span-2 flex items-center">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-100 text-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-full size-10 flex items-center justify-center">
              <KeyRound className="size-6" />
            </div>
            <strong className="text-lg">Cobertura de palavras-chave</strong>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 col-span-2">
          {data.evaluation.keyword_coverage
            .sort((a, b) => (a.present === b.present ? 0 : a.present ? -1 : 1))
            .map(({ keyword, present }) => (
              <span
                key={keyword}
                className={clsx(
                  "px-3 py-1 text-sm rounded-full flex items-center gap-2",
                  present
                    ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-500/10 dark:text-zinc-400"
                )}
              >
                {present ? <CheckCheck size={14} /> : null} {keyword}
              </span>
            ))}
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center gap-4">
          <div className="size-10 flex items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-500/10 dark:text-green-400">
            <PencilLine />
          </div>
          <strong className="text-lg">
            Sugestões de personalização do currículo
          </strong>
        </div>
        <div className="mt-8">
          {data.evaluation.tailoring_suggestions.map((suggestion) => (
            <div key={suggestion.priority} className="mb-4">
              <div
                className={clsx(
                  "text-sm mb-1 bg-blue-50 text-blue-900 dark:text-blue-50 dark:bg-blue-500/10 p-4 rounded-md flex items-start gap-4",
                  suggestion.estimated_impact === "high"
                    ? "bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-50"
                    : suggestion.estimated_impact === "medium" &&
                        "bg-yellow-50 text-yellow-900 dark:bg-yellow-500/10 dark:text-yellow-50"
                )}
              >
                <div className="shrink-0">
                  <CircleAlert
                    className={clsx(
                      "text-blue-600",
                      suggestion.estimated_impact === "high"
                        ? "text-red-600"
                        : suggestion.estimated_impact === "medium" &&
                            "text-yellow-600"
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <p>{suggestion.suggestion}</p>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80 mt-2">
                    <CheckCircle size={14} />
                    <span className="text-xs">{suggestion.rationale}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center gap-4 text-sm">
          <div className="size-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400">
            <CircleQuestionMark />
          </div>
          <span className="text-lg font-semibold">
            Perguntas de preparação para entrevista
          </span>
        </div>
        <div className="mt-8">
          {data.evaluation.interview_prep_questions.map((question) => (
            <div
              key={question}
              className="px-4 py-4 bg-zinc-500/10 text-sm mt-2 rounded-md"
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
