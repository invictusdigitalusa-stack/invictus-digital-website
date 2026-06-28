import { UserMenu } from "./UserMenu";

type InternalNavbarMetaProps = {
  label: string;
};

export function InternalNavbarMeta({ label }: InternalNavbarMetaProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <p className="text-xs text-zinc-500 md:text-sm">{label}</p>
      <UserMenu />
    </div>
  );
}
