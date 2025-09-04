import { VersionSelect } from "@/components/VersionSelect";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ResumeVersionChange({
  currentVersion,
  versions,
}: {
  currentVersion: number;
  versions: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleVersionChange(version: number) {
    const url = new URL(`${origin}/${pathname}`);
    const params = new URLSearchParams(searchParams);
    params.set("version", version.toString());
    url.search = params.toString();
    router.push(url.toString());
  }

  return (
    <>
      <Label>Versão</Label>
      <VersionSelect
        className="mt-2"
        currentVersion={currentVersion}
        versions={versions}
        onChange={handleVersionChange}
      />
    </>
  );
}
