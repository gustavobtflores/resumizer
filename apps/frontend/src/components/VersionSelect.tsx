import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

export function VersionSelect({
  currentVersion,
  versions,
  onChange,
  className,
  name = "version",
  disabled,
}: {
  currentVersion?: number;
  versions: number[];
  onChange: (version: number) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}) {
  return (
    <Select
      name={name}
      defaultValue={currentVersion?.toString()}
      disabled={disabled}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger
        className={clsx("w-full disabled:cursor-not-allowed!", className)}
      >
        <SelectValue placeholder="Selecione uma versão" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {versions.map((version) => (
            <SelectItem key={version} value={version.toString()}>
              v{version}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
