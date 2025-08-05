import Container from "@/components/layout/Container";
import { ResumeUploadInput } from "@/components/features/resume-upload/ResumeUploadInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <Container className="h-screen flex items-center justify-center">
      <ResumeUploadInput />
    </Container>
  );
}
