import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
        DB
      </div>
       <span className="font-bold text-lg text-foreground">Dulus BS Manager</span>
    </div>
  );
}
