import { type RefObject } from "react";
import { Card } from "@/components/ui/Card";
import type { ProjectRow } from "@/lib/supabase";
import { projectAssetTypes, statusColor } from "./data";
import type { AssetFileState } from "./helpers";

type ProjectAssetsProps = {
  activeProject: ProjectRow | null;
  assetFiles: Record<string, AssetFileState>;
  isLoadingAssets: boolean;
  isUpdating: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileMessage: { type: "success" | "error"; text: string } | null;
  onUploadClick: (asset: (typeof projectAssetTypes)[number]) => void;
  onFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ProjectAssets({
  activeProject,
  assetFiles,
  isLoadingAssets,
  isUpdating,
  fileInputRef,
  fileMessage,
  onUploadClick,
  onFileSelected,
}: ProjectAssetsProps) {
  return (
    <Card className="p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Files
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">Project Assets</h2>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileSelected}
      />
      <ul className="mt-6 space-y-3">
        {projectAssetTypes.map((asset) => {
          const assetState = assetFiles[asset.id];
          const status = assetState?.status ?? "Missing";
          const count = assetState?.count ?? 0;
          const isUploading = assetState?.isUploading ?? false;

          return (
            <li
              key={asset.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white">
                    {asset.name}
                  </span>
                  {count > 0 ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      {count} file{count === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(status)}`}
                >
                  {isLoadingAssets && !assetState ? "..." : status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUploadClick(asset)}
                disabled={!activeProject || isUploading || isUpdating}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </li>
          );
        })}
      </ul>
      {fileMessage ? (
        <p
          className={`mt-4 text-sm ${
            fileMessage.type === "success" ? "text-[#22C55E]" : "text-red-400"
          }`}
        >
          {fileMessage.text}
        </p>
      ) : null}
    </Card>
  );
}