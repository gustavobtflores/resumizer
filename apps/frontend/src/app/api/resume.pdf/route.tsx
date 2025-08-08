// app/api/resume.pdf/route.ts
import "server-only";
import React from "react";
import { NextRequest } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { StructuredResume } from "@/types/StructuredResume";
import { formatDate } from "@/utils/formatDate";
import { normalizeURL } from "@/utils/normalizeURL";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: { paddingTop: 24, paddingBottom: 24, paddingHorizontal: 24 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  line: { fontSize: 10, lineHeight: 1.25 },
  sep: { fontSize: 10, marginHorizontal: 4 },
  socials: { fontSize: 10, marginTop: 4 },
  sectionTitle: {
    fontSize: 14,
    marginTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    borderStyle: "solid",
    marginBottom: 8,
    fontWeight: "medium",
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  expWrap: { marginBottom: 16 },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  h3: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  muted: { fontSize: 10, color: "#555555" },
  bulletItem: { flexDirection: "row", marginTop: 4 },
  bulletGlyph: {
    width: 9,
    fontSize: 10,
    textAlign: "center",
    marginRight: 10,
  },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.25 },
});

const sectionTitles = {
  "pt-BR": {
    experiences: "Experiências",
    education: "Formação acadêmica",
    professionalSummary: "Resumo Profissional",
  },
  "en-US": {
    experiences: "Experiences",
    education: "Education",
    professionalSummary: "Professional Summary",
  },
  "es-ES": {
    experiences: "Experiencias",
    education: "Educación",
    professionalSummary: "Resumen Profesional",
  },
};

function SocialLine({ resume }: { resume: StructuredResume }) {
  const socials = (
    [
      { key: "linkedin_url", label: "LinkedIn" },
      { key: "github_url", label: "GitHub" },
      { key: "portfolio_url", label: "Portfolio" },
    ] as const
  )
    .map((item) => {
      const raw = resume.personal_info[item.key];
      return raw
        ? { label: item.label, url: normalizeURL(raw) as string }
        : undefined;
    })
    .filter(Boolean) as { label: string; url: string }[];

  const parts: React.ReactNode[] = [];

  if (resume.personal_info.email)
    parts.push(
      <Text key="email" style={styles.socials}>
        {resume.personal_info.email}
      </Text>
    );
  if (resume.personal_info.phone) {
    if (parts.length)
      parts.push(
        <Text key="sep1" style={styles.sep}>
          •
        </Text>
      );
    parts.push(
      <Text key="phone" style={styles.socials}>
        {resume.personal_info.phone}
      </Text>
    );
  }

  socials.forEach((s, i) => {
    if (parts.length)
      parts.push(
        <Text key={`sep-${i}`} style={styles.sep}>
          •
        </Text>
      );
    parts.push(
      <Text key={`social-${i}`} style={styles.socials}>
        {s.label}: {s.url}
      </Text>
    );
  });

  return <View style={styles.rowWrap}>{parts}</View>;
}

function ExperiencesPDF({
  experiences,
}: {
  experiences: StructuredResume["work_experience"];
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.sectionTitle}>Experiências</Text>
      {experiences.map((exp, index) => (
        <View key={index} style={styles.expWrap}>
          <View style={styles.expHeader}>
            <Text style={styles.h3}>{exp.position}</Text>
            <Text style={styles.muted}>
              {formatDate(exp.start_date)} –{" "}
              {exp.is_current ? "Atual" : formatDate(exp.end_date)}
            </Text>
          </View>
          <Text style={styles.muted}>{exp.company}</Text>
          {exp.achievements?.length > 0 && (
            <View style={{ marginTop: 4, paddingLeft: 8 }}>
              {exp.achievements.map((a, i) => (
                <View key={i} style={styles.bulletItem}>
                  <Text style={styles.bulletGlyph}>•</Text>
                  <Text style={styles.bulletText}>{a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function EducationPDF({
  education,
}: {
  education: StructuredResume["education"];
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.sectionTitle}>Formação acadêmica</Text>
      {education.map((edu, index) => (
        <View key={index} style={{ marginBottom: 6 }}>
          <View style={styles.expHeader}>
            <Text style={styles.h3}>{edu.field_of_study}</Text>
            <Text style={styles.muted}>
              {formatDate(edu.start_date)} – {formatDate(edu.graduation_date)}
            </Text>
          </View>
          <Text style={styles.muted}>{edu.institution}</Text>
          {!!edu.relevant_coursework?.length && (
            <Text style={[styles.line, { marginTop: 4 }]}>
              {edu.relevant_coursework.join(", ")}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

function ResumePDF({ resume }: { resume: StructuredResume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.personal_info.full_name}</Text>

        <View style={{ marginTop: 4 }}>
          <SocialLine resume={resume} />
        </View>

        {resume.professional_summary ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Resumo Profissional</Text>
            <Text style={styles.line}>{resume.professional_summary}</Text>
          </View>
        ) : null}

        <ExperiencesPDF experiences={resume.work_experience} />
        <EducationPDF education={resume.education} />
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  let resume: StructuredResume;
  try {
    resume = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!resume?.personal_info?.full_name)
    return new Response("Missing personal_info.full_name", { status: 400 });
  if (!Array.isArray(resume?.work_experience))
    return new Response("Missing work_experience[]", { status: 400 });
  if (!Array.isArray(resume?.education))
    return new Response("Missing education[]", { status: 400 });

  const buffer = await renderToBuffer(<ResumePDF resume={resume} />);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
