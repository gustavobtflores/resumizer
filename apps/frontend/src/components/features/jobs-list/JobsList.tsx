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
    };
  }[];
};

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
          <Card key={evaluation.company}>
            <CardHeader>
              <CardTitle className="overflow-hidden overflow-ellipsis min-w-0">
                <strong className="font-semibold whitespace-nowrap">
                  {evaluation.job_title}
                </strong>
              </CardTitle>
              <span className="text-muted-foreground">
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
