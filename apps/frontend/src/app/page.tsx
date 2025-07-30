import { ResumeInput } from "@/components/resume-upload/ResumeInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container max-w-lg mx-auto h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Faça o upload do seu currículo</CardTitle>
          <CardDescription>
            Selecione o arquivo do seu currículo para começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeInput />
        </CardContent>
      </Card>
    </div>
  );
}
