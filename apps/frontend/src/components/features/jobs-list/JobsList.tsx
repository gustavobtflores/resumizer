"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type JobsListProps = {
  jobs: {
    id: string;
    evaluation: {
      company: string;
      job_title: string;
      match_score: number;
      seniority_estimate: "junior" | "mid" | "senior" | "staff+" | "unknown";
    };
  }[];
};

const SENIORITY_LEVEL = {
  junior: {
    label: "Júnior",
    color: "text-green-500",
    background: "bg-green-500/10",
  },
  mid: {
    label: "Pleno",
    color: "text-yellow-500",
    background: "bg-yellow-500/10",
  },
  senior: {
    label: "Sênior",
    color: "text-red-500",
    background: "bg-red-500/10",
  },
  "staff+": {
    label: "Staff+",
    color: "text-purple-500",
    background: "bg-purple-500/10",
  },
  unknown: {
    label: "Desconhecido",
    color: "text-gray-500",
    background: "bg-gray-500/10",
  },
} as const;

export function JobsList({ jobs }: JobsListProps) {
  const router = useRouter();

  async function handleJobDelete(id: string) {
    try {
      await fetch(`http://localhost:8080/jobs/${id}`, {
        method: "DELETE",
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-10">
      {jobs
        .map((job) => ({ ...job.evaluation, id: job.id }))
        .map((evaluation) => (
          <Card key={evaluation.id}>
            <CardHeader>
              <div>
                <span
                  className={`${
                    SENIORITY_LEVEL[evaluation.seniority_estimate].color
                  } ${
                    SENIORITY_LEVEL[evaluation.seniority_estimate].background
                  } font-semibold text-xs rounded-full px-2 mb-1 inline-block`}
                >
                  {SENIORITY_LEVEL[evaluation.seniority_estimate].label}
                </span>
              </div>
              <CardTitle className="overflow-hidden overflow-ellipsis min-w-0">
                <strong className="font-semibold whitespace-nowrap">
                  {evaluation.job_title}
                </strong>
              </CardTitle>
              <span className="text-muted-foreground text-sm">
                {evaluation.company}
              </span>
              <div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Match</span>
                  <span className="text-sm">{evaluation.match_score}%</span>
                </div>
                <div className="rounded-full bg-chart-5/30 w-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${evaluation.match_score}%`,
                      backgroundColor: `hsl(${
                        (evaluation.match_score * 120) / 100
                      }, 90%, 45%)`,
                    }}
                  ></div>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex gap-4 justify-end">
              <Button
                variant={"ghost"}
                className="text-red-500 flex-1 hover:text-red-500 hover:bg-red-500/10"
                onClick={() => handleJobDelete(evaluation.id)}
              >
                <Trash />
                Deletar
              </Button>
              <Link className="flex-1" href={`/jobs/${evaluation.id}`}>
                <Button className="w-full" variant={"outline"}>
                  Ver detalhes
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
