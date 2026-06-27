import { createSupabaseClient } from "./client";
import { projectStageProgress } from "./constants";
import type { ProjectStage } from "./constants";
import type {
  CreateProjectFromLeadInput,
  CreateProjectResult,
  ProjectRow,
  SaveLeadResult,
  UpdateProjectProgressInput,
} from "./types";

export async function fetchProjects(): Promise<ProjectRow[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, lead_id, company, website, industry, package, status, progress, start_date, launch_goal, assigned_to, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createProjectFromLead({
  leadId,
  company,
  website,
  industry,
  proposalPackage,
}: CreateProjectFromLeadInput): Promise<CreateProjectResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const { data: existingProject, error: lookupError } = await supabase
      .from("projects")
      .select("id")
      .eq("lead_id", leadId)
      .maybeSingle();

    if (lookupError) {
      return { success: false, error: lookupError.message };
    }

    if (existingProject) {
      return { success: true, created: false };
    }

    const { error: insertError } = await supabase.from("projects").insert({
      lead_id: leadId,
      company,
      website,
      industry,
      package: proposalPackage?.trim() || "Growth",
      status: "Lead Won",
      progress: 0,
      assigned_to: "Douglas",
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true, created: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project.",
    };
  }
}

export async function updateProjectProgress({
  projectId,
  progress,
  status,
}: UpdateProjectProgressInput): Promise<SaveLeadResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const { error } = await supabase
      .from("projects")
      .update({ progress, status })
      .eq("id", projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update project progress.",
    };
  }
}

export async function updateProjectStage(
  projectId: string,
  stage: ProjectStage
): Promise<SaveLeadResult> {
  if (!projectId.trim()) {
    return { success: false, error: "Project ID is required." };
  }

  if (!(stage in projectStageProgress)) {
    return { success: false, error: "Invalid project stage." };
  }

  return updateProjectProgress({
    projectId,
    status: stage,
    progress: projectStageProgress[stage],
  });
}

export function getProjectStageProgress(stage: ProjectStage) {
  return projectStageProgress[stage];
}
