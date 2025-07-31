import Container from "@/components/layout/Container";
import { ResumeUploadInput } from "@/components/resume-upload/ResumeUploadInput";
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
      <Card className="w-lg">
        <CardHeader>
          <CardTitle>Faça o upload do seu currículo</CardTitle>
          <CardDescription>
            Selecione o arquivo do seu currículo para começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploadInput />
        </CardContent>
      </Card>
    </Container>
  );
}
