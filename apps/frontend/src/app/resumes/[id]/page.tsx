"use client";

import Container from "@/components/layout/Container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StructuredResume } from "@/types/StructuredResume";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Experiences({
  experiences,
}: {
  experiences: StructuredResume["work_experience"];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base border-b border-b-border pb-2 mb-4">
        Experiências
      </h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{exp.position}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(exp.start_date)} -{" "}
              {exp.is_current ? "Atual" : formatDate(exp.end_date)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{exp.company}</p>
          <ul className="mt-4">
            {exp.achievements.map((achievement, idx) => (
              <li className="list-disc pl-5 text-sm mt-2" key={idx}>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function Education({
  education,
}: {
  education: StructuredResume["education"];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base border-b border-b-border pb-2 mb-4">
        Formação acadêmica
      </h2>
      {education.map((edu, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {edu.degree || edu.field_of_study}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(edu.start_date)} - {formatDate(edu.graduation_date)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{edu.institution}</p>
          <p className="text-sm mt-4">{edu.relevant_coursework.join(", ")}</p>
        </div>
      ))}
    </section>
  );
}

export default function Resume() {
  const { id } = useParams();

  const [resume, setResume] = useState<{
    id: string;
    original_json: StructuredResume;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`http://localhost:8080/resumes/${id}`);
      const resume = await data.json();
      setResume(resume);
    };
    fetchData();
  }, [id]);

  const form = useForm();
  const formValues = form.watch();

  if (!resume) return null;

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <Container className="mt-20 max-w-full">
      <div className="grid grid-cols-3">
        <div className="p-4 flex flex-col border-border border rounded-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <div>
                  <strong className="mb-2 block">Informações pessoais</strong>
                  <FormField
                    defaultValue={resume.original_json.personal_info.full_name}
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </form>
          </Form>
        </div>
        <div className="p-4 col-span-2">
          <div className="bg-secondary rounded-sm col-span-2 max-w-full w-[21cm] h-[29.7cm] p-[2cm]">
            <h1 className="text-5xl font-semibold">
              {formValues.full_name ||
                resume.original_json.personal_info.full_name}
            </h1>
            <Experiences experiences={resume.original_json.work_experience} />
            <Education education={resume.original_json.education} />
          </div>
        </div>
      </div>
    </Container>
  );
}
