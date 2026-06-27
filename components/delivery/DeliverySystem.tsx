"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  getProjectStageProgress,
  listProjectFiles,
  uploadProjectFile,
  updateProjectProgress,
  updateProjectStage,
  type ProjectRow,
  type ProjectStorageBucket,
} from "@/lib/supabase";
import { initialTasks, projectAssetTypes } from "./data";
import {
  getNextProgressStep,
  taskStageMap,
  uploadStageMap,
  type AssetFileState,
} from "./helpers";
import { LaunchChecklist } from "./LaunchChecklist";
import { PipelineBoard } from "./PipelineBoard";
import { ProjectAssets } from "./ProjectAssets";
import { ProjectOverview } from "./ProjectOverview";
import { TaskChecklist } from "./TaskChecklist";

type DeliverySystemProps = {
  projects: ProjectRow[];
};

export function DeliverySystem({ projects }: DeliverySystemProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeProject, setActiveProject] = useState<ProjectRow | null>(
    projects[0] ?? null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fileMessage, setFileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [assetFiles, setAssetFiles] = useState<Record<string, AssetFileState>>(
    {}
  );
  const [uploadTarget, setUploadTarget] = useState<{
    bucket: ProjectStorageBucket;
    id: string;
  } | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const progress = activeProject?.progress ?? 0;

  useEffect(() => {
    setActiveProject(projects[0] ?? null);
  }, [projects]);

  async function loadProjectAssets(projectId: string) {
    setIsLoadingAssets(true);

    const entries = await Promise.all(
      projectAssetTypes.map(async (asset) => {
        const response = await listProjectFiles({
          projectId,
          bucket: asset.bucket,
          filename: "",
        });

        const count = response.success ? response.files?.length ?? 0 : 0;

        return [
          asset.id,
          {
            count,
            status: count > 0 ? ("Uploaded" as const) : ("Missing" as const),
            isUploading: false,
          },
        ] as const;
      })
    );

    setAssetFiles(Object.fromEntries(entries));
    setIsLoadingAssets(false);
  }

  useEffect(() => {
    if (!activeProject) {
      setAssetFiles({});
      return;
    }

    void loadProjectAssets(activeProject.id);
  }, [activeProject?.id]);

  const [tasks, setTasks] = useState<Set<string>>(
    new Set(initialTasks.filter((t) => t.done).map((t) => t.id))
  );
  const [launch, setLaunch] = useState<Set<string>>(new Set());

  function toggleTask(id: string) {
    const isChecking = !tasks.has(id);

    setTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!isChecking) {
      return;
    }

    void handleTaskStageUpdate(id);
  }

  async function handleTaskStageUpdate(taskId: string) {
    if (!activeProject || isUpdating) {
      return;
    }

    const stage = taskStageMap[taskId];

    if (!stage) {
      return;
    }

    setIsUpdating(true);
    setActionMessage(null);

    const response = await updateProjectStage(activeProject.id, stage);

    setIsUpdating(false);

    if (!response.success) {
      setTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      setActionMessage({
        type: "error",
        text: response.error ?? "Failed to update project stage.",
      });
      return;
    }

    const nextProgress = getProjectStageProgress(stage);

    setActiveProject((current) =>
      current
        ? {
            ...current,
            status: stage,
            progress: nextProgress,
          }
        : current
    );
    setActionMessage({ type: "success", text: "Project stage updated." });
    router.refresh();
  }

  function toggleLaunch(id: string) {
    setLaunch((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleUpdateProgress() {
    if (!activeProject || isUpdating) return;

    const nextStep = getNextProgressStep(activeProject.progress ?? 0);

    if (!nextStep) {
      return;
    }

    setIsUpdating(true);
    setActionMessage(null);

    const response = await updateProjectProgress({
      projectId: activeProject.id,
      progress: nextStep.progress,
      status: nextStep.status,
    });

    setIsUpdating(false);

    if (!response.success) {
      setActionMessage({
        type: "error",
        text: response.error ?? "Failed to update project.",
      });
      return;
    }

    setActiveProject((current) =>
      current
        ? {
            ...current,
            progress: nextStep.progress,
            status: nextStep.status,
          }
        : current
    );
    setActionMessage({ type: "success", text: "Project updated." });
    router.refresh();
  }

  function handleUploadClick(asset: (typeof projectAssetTypes)[number]) {
    if (!activeProject) {
      return;
    }

    setUploadTarget({ bucket: asset.bucket, id: asset.id });
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !activeProject || !uploadTarget) {
      return;
    }

    setAssetFiles((current) => ({
      ...current,
      [uploadTarget.id]: {
        count: current[uploadTarget.id]?.count ?? 0,
        status: current[uploadTarget.id]?.status ?? "Missing",
        isUploading: true,
      },
    }));
    setFileMessage(null);

    const response = await uploadProjectFile({
      projectId: activeProject.id,
      bucket: uploadTarget.bucket,
      filename: file.name,
      file,
      contentType: file.type,
    });

    if (!response.success) {
      setAssetFiles((current) => ({
        ...current,
        [uploadTarget.id]: {
          count: current[uploadTarget.id]?.count ?? 0,
          status: current[uploadTarget.id]?.status ?? "Missing",
          isUploading: false,
        },
      }));
      setFileMessage({
        type: "error",
        text: response.error ?? "Failed to upload file.",
      });
      setUploadTarget(null);
      return;
    }

    const stage = uploadStageMap[uploadTarget.id];

    if (!stage) {
      await loadProjectAssets(activeProject.id);
      setFileMessage({ type: "success", text: "File uploaded." });
      setUploadTarget(null);
      return;
    }

    const stageResponse = await updateProjectStage(activeProject.id, stage);

    await loadProjectAssets(activeProject.id);

    if (!stageResponse.success) {
      setFileMessage({
        type: "error",
        text: "File uploaded, but project stage update failed.",
      });
      setUploadTarget(null);
      return;
    }

    const nextProgress = getProjectStageProgress(stage);

    setActiveProject((current) =>
      current
        ? {
            ...current,
            status: stage,
            progress: nextProgress,
          }
        : current
    );
    setFileMessage({
      type: "success",
      text: "File uploaded and project stage updated.",
    });
    router.refresh();
    setUploadTarget(null);
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Delivery
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Client Delivery Pipeline
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Track every project from signed agreement to launch.
        </p>
      </div>

      <PipelineBoard />

      <div className="mb-12 grid gap-6 lg:grid-cols-3">
        <ProjectOverview
          activeProject={activeProject}
          progress={progress}
          isUpdating={isUpdating}
          actionMessage={actionMessage}
          onUpdateProgress={handleUpdateProgress}
        />

        <TaskChecklist tasks={tasks} onToggleTask={toggleTask} />

        <ProjectAssets
          activeProject={activeProject}
          assetFiles={assetFiles}
          isLoadingAssets={isLoadingAssets}
          isUpdating={isUpdating}
          fileInputRef={fileInputRef}
          fileMessage={fileMessage}
          onUploadClick={handleUploadClick}
          onFileSelected={handleFileSelected}
        />
      </div>

      <LaunchChecklist launch={launch} onToggleLaunch={toggleLaunch} />
    </Container>
  );
}
