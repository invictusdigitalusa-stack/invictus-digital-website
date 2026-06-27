import { createSupabaseClient } from "./client";
import { projectStorageBuckets } from "./constants";
import type { ProjectStorageBucket } from "./constants";
import type {
  DeleteProjectFileResult,
  DownloadProjectFileResult,
  ListProjectFilesResult,
  ProjectFileInput,
  ProjectFileItem,
  UploadProjectFileInput,
  UploadProjectFileResult,
} from "./types";

function normalizeProjectFilename(filename: string) {
  const trimmed = filename.trim().replace(/^\/+/, "");
  const basename = trimmed.split("/").pop() ?? "";

  return basename;
}

function resolveProjectFilePath({
  projectId,
  bucket,
  filename,
}: ProjectFileInput):
  | { error: string }
  | { bucket: ProjectStorageBucket; path: string } {
  if (!projectId.trim()) {
    return { error: "Project ID is required." };
  }

  if (!projectStorageBuckets.includes(bucket)) {
    return { error: "Invalid storage bucket." };
  }

  const safeFilename = normalizeProjectFilename(filename);

  if (!safeFilename) {
    return { error: "Filename is required." };
  }

  return {
    bucket,
    path: `${projectId.trim()}/${safeFilename}`,
  };
}

function mapStorageFile(file: {
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  metadata?: Record<string, unknown> | null;
}): ProjectFileItem {
  const metadata = file.metadata ?? {};
  const sizeValue = metadata.size;
  const contentTypeValue = metadata.mimetype;

  return {
    name: file.name.split("/").pop() ?? file.name,
    path: file.name,
    createdAt: file.created_at ?? null,
    updatedAt: file.updated_at ?? null,
    size: typeof sizeValue === "number" ? sizeValue : null,
    contentType: typeof contentTypeValue === "string" ? contentTypeValue : null,
  };
}

function normalizeUploadBody(
  file: UploadProjectFileInput["file"]
): Blob | ArrayBuffer | Uint8Array {
  if (file instanceof File || file instanceof Blob) {
    return file;
  }

  return file;
}

function normalizeUploadContentType(
  file: UploadProjectFileInput["file"],
  contentType?: string
) {
  if (contentType?.trim()) {
    return contentType.trim();
  }

  if (file instanceof File && file.type) {
    return file.type;
  }

  return undefined;
}

export async function uploadProjectFile({
  projectId,
  bucket,
  filename,
  file,
  contentType,
}: UploadProjectFileInput): Promise<UploadProjectFileResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const resolved = resolveProjectFilePath({ projectId, bucket, filename });

  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  try {
    const { error } = await supabase.storage
      .from(resolved.bucket)
      .upload(resolved.path, normalizeUploadBody(file), {
        upsert: true,
        contentType: normalizeUploadContentType(file, contentType),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, path: resolved.path };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload project file.",
    };
  }
}

export async function deleteProjectFile({
  projectId,
  bucket,
  filename,
}: ProjectFileInput): Promise<DeleteProjectFileResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const resolved = resolveProjectFilePath({ projectId, bucket, filename });

  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  try {
    const { error } = await supabase.storage
      .from(resolved.bucket)
      .remove([resolved.path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, path: resolved.path };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project file.",
    };
  }
}

export async function listProjectFiles({
  projectId,
  bucket,
  filename,
}: ProjectFileInput): Promise<ListProjectFilesResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  if (!projectId.trim()) {
    return { success: false, error: "Project ID is required." };
  }

  if (!projectStorageBuckets.includes(bucket)) {
    return { success: false, error: "Invalid storage bucket." };
  }

  const safeFilename = normalizeProjectFilename(filename);
  const folder = projectId.trim();

  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    let files = (data ?? [])
      .filter((item) => item.id !== null)
      .map((item) =>
        mapStorageFile({
          name: `${folder}/${item.name}`,
          created_at: item.created_at,
          updated_at: item.updated_at,
          metadata: item.metadata,
        })
      );

    if (safeFilename) {
      files = files.filter((file) => file.name === safeFilename);
    }

    return { success: true, files };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to list project files.",
    };
  }
}

export async function downloadProjectFile({
  projectId,
  bucket,
  filename,
}: ProjectFileInput): Promise<DownloadProjectFileResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const resolved = resolveProjectFilePath({ projectId, bucket, filename });

  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  try {
    const { data, error } = await supabase.storage
      .from(resolved.bucket)
      .download(resolved.path);

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Project file not found." };
    }

    return { success: true, data, path: resolved.path };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to download project file.",
    };
  }
}
