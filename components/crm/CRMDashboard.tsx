"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  createProjectFromLead,
  updateLeadStatus,
  type LeadRow,
} from "@/lib/supabase";
import type { AiActivityLog } from "@/lib/aiActivityLogs";
import type { QueueStatus } from "@/lib/agentQueue";
import { useToast } from "@/components/os/useToast";
import { BatchActionBar } from "./BatchActionBar";
import { LeadFilters } from "./LeadFilters";
import { LeadTable } from "./LeadTable";
import { LeadToolbar } from "./LeadToolbar";
import {
  getLeadQueueButtonItem,
  isQueueItemActive,
} from "./queueHelpers";
import { useCrmQueue } from "./useCrmQueue";

type CRMDashboardProps = {
  leads: LeadRow[];
  activityLogsByLeadId: Record<string, AiActivityLog[]>;
};

export function CRMDashboard({
  leads: initialLeads,
  activityLogsByLeadId: initialActivityLogsByLeadId,
}: CRMDashboardProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [activityLogsByLeadId, setActivityLogsByLeadId] = useState(
    initialActivityLogsByLeadId
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [showPipelineWarnings, setShowPipelineWarnings] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
    errors?: string[];
  } | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const handleQueueActionMessage = useCallback(
    (message: {
      type: "success" | "warning" | "error";
      text: string;
      errors?: string[];
    }) => {
      setActionMessage(message);
    },
    []
  );
  const { queueStatus, markLeadQueued } = useCrmQueue({
    router,
    onActionMessage: handleQueueActionMessage,
  });

  useEffect(() => {
    setLeads(initialLeads);
    setActivityLogsByLeadId(initialActivityLogsByLeadId);
  }, [initialLeads, initialActivityLogsByLeadId]);

  async function handleMarkWon(lead: LeadRow) {
    if (lead.status === "Won" || markingId === lead.id) return;

    setMarkingId(lead.id);
    setActionMessage(null);

    const response = await updateLeadStatus({
      leadId: lead.id,
      companyName: lead.company ?? "",
      websiteUrl: lead.website ?? "",
      status: "Won",
    });

    if (!response.success) {
      setMarkingId(null);
      setActionMessage({
        type: "error",
        text: response.error ?? "Failed to update lead status.",
      });
      return;
    }

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, status: "Won" } : item
      )
    );

    const projectResponse = await createProjectFromLead({
      leadId: lead.id,
      company: lead.company,
      website: lead.website,
      industry: lead.industry,
      proposalPackage: lead.proposal_package,
    });

    setMarkingId(null);

    if (projectResponse.success && projectResponse.created) {
      setActionMessage({
        type: "success",
        text: "Lead marked Won and project created.",
      });
    } else if (!projectResponse.success) {
      setActionMessage({
        type: "error",
        text: projectResponse.error ?? "Failed to create project.",
      });
    }

    router.refresh();
  }

  async function handleRunAI(lead: LeadRow) {
    if (!lead.website?.trim()) {
      return;
    }

    const currentItem = getLeadQueueButtonItem(
      queueStatus?.items ?? [],
      lead.id
    );

    if (isQueueItemActive(currentItem)) {
      return;
    }

    setActionMessage(null);
    setShowPipelineWarnings(false);

    try {
      const response = await fetch("/api/agent/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId: lead.id }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        status?: QueueStatus;
        error?: string;
      };

      if (!response.ok) {
        setActionMessage({
          type: "error",
          text: data.error ?? "Failed to queue AI pipeline.",
        });
        return;
      }

      if (data.status) {
        markLeadQueued(lead.id, data.status);
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Failed to queue AI pipeline.",
      });
    }
  }

  const stats = useMemo(() => {
    const meetings = leads.filter(
      (lead) => lead.status === "Meeting Booked"
    ).length;
    const clients = leads.filter((lead) => lead.status === "Won").length;

    return {
      totalLeads: leads.length,
      meetings,
      clients,
      revenue: 0,
    };
  }, [leads]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      const matchesIndustry =
        industryFilter === "All" || lead.industry === industryFilter;
      const matchesSearch =
        !query ||
        (lead.company ?? "").toLowerCase().includes(query) ||
        (lead.industry ?? "").toLowerCase().includes(query) ||
        (lead.website ?? "").toLowerCase().includes(query) ||
        (lead.status ?? "").toLowerCase().includes(query) ||
        (lead.priority ?? "").toLowerCase().includes(query) ||
        String(lead.overall_score ?? "").includes(query);

      return matchesStatus && matchesIndustry && matchesSearch;
    });
  }, [leads, search, statusFilter, industryFilter]);

  const selectedLeads = useMemo(
    () => leads.filter((lead) => selectedLeadIds.has(lead.id)),
    [leads, selectedLeadIds]
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((lead) => selectedLeadIds.has(lead.id));
  const someFilteredSelected = filtered.some((lead) =>
    selectedLeadIds.has(lead.id)
  );

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        someFilteredSelected && !allFilteredSelected;
    }
  }, [allFilteredSelected, someFilteredSelected]);

  function clearSelection() {
    setSelectedLeadIds(new Set());
  }

  function toggleLeadSelection(leadId: string) {
    setSelectedLeadIds((current) => {
      const next = new Set(current);

      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }

      return next;
    });
  }

  function toggleSelectAllFiltered() {
    setSelectedLeadIds((current) => {
      const next = new Set(current);

      if (allFilteredSelected) {
        for (const lead of filtered) {
          next.delete(lead.id);
        }
      } else {
        for (const lead of filtered) {
          next.add(lead.id);
        }
      }

      return next;
    });
  }

  function showComingSoonToast() {
    showToast({
      title: "Coming soon",
      description: "This batch action is not connected yet.",
      type: "info",
    });
  }

  async function completeBatchAction(
    successCount: number,
    failureCount: number,
    actionLabel: string
  ) {
    if (failureCount === 0 && successCount > 0) {
      showToast({
        title: "Batch action completed",
        description: `${successCount} lead${successCount === 1 ? "" : "s"} updated for ${actionLabel}.`,
        type: "success",
      });
      clearSelection();
      router.refresh();
      return;
    }

    if (successCount > 0) {
      showToast({
        title: "Batch completed with warnings",
        description: `${successCount} succeeded and ${failureCount} failed for ${actionLabel}.`,
        type: "warning",
      });
      clearSelection();
      router.refresh();
      return;
    }

    showToast({
      title: "Batch action failed",
      description: `No leads were processed for ${actionLabel}.`,
      type: "error",
    });
  }

  async function handleBatchRunAI() {
    if (selectedLeads.length === 0) {
      return;
    }

    setIsBatchProcessing(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      for (const lead of selectedLeads) {
        if (!lead.website?.trim()) {
          failureCount += 1;
          continue;
        }

        try {
          const response = await fetch("/api/agent/pipeline", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ leadId: lead.id }),
          });

          const data = (await response.json()) as {
            status?: QueueStatus;
            error?: string;
          };

          if (!response.ok) {
            failureCount += 1;
            continue;
          }

          if (data.status) {
            markLeadQueued(lead.id, data.status);
          }

          successCount += 1;
        } catch {
          failureCount += 1;
        }
      }

      await completeBatchAction(successCount, failureCount, "Run AI");
    } finally {
      setIsBatchProcessing(false);
    }
  }

  async function handleBatchGenerateOutreach() {
    if (selectedLeads.length === 0) {
      return;
    }

    setIsBatchProcessing(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      for (const lead of selectedLeads) {
        if (!lead.company?.trim()) {
          failureCount += 1;
          continue;
        }

        try {
          const response = await fetch("/api/outreach", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: lead.company,
              website: lead.website,
              industry: lead.industry,
            }),
          });

          if (!response.ok) {
            failureCount += 1;
            continue;
          }

          successCount += 1;
        } catch {
          failureCount += 1;
        }
      }

      await completeBatchAction(successCount, failureCount, "Generate Outreach");
    } finally {
      setIsBatchProcessing(false);
    }
  }

  async function handleBatchMarkContacted() {
    if (selectedLeads.length === 0) {
      return;
    }

    setIsBatchProcessing(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      const updatedIds = new Set<string>();

      for (const lead of selectedLeads) {
        const response = await updateLeadStatus({
          leadId: lead.id,
          companyName: lead.company ?? "",
          websiteUrl: lead.website ?? "",
          status: "Contacted",
        });

        if (response.success) {
          updatedIds.add(lead.id);
          successCount += 1;
        } else {
          failureCount += 1;
        }
      }

      if (updatedIds.size > 0) {
        setLeads((current) =>
          current.map((lead) =>
            updatedIds.has(lead.id) ? { ...lead, status: "Contacted" } : lead
          )
        );
      }

      await completeBatchAction(successCount, failureCount, "Mark Contacted");
    } finally {
      setIsBatchProcessing(false);
    }
  }

  async function handleBatchMarkWon() {
    if (selectedLeads.length === 0) {
      return;
    }

    setIsBatchProcessing(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      const updatedIds = new Set<string>();

      for (const lead of selectedLeads) {
        if (lead.status === "Won") {
          successCount += 1;
          continue;
        }

        const statusResponse = await updateLeadStatus({
          leadId: lead.id,
          companyName: lead.company ?? "",
          websiteUrl: lead.website ?? "",
          status: "Won",
        });

        if (!statusResponse.success) {
          failureCount += 1;
          continue;
        }

        const projectResponse = await createProjectFromLead({
          leadId: lead.id,
          company: lead.company,
          website: lead.website,
          industry: lead.industry,
          proposalPackage: lead.proposal_package,
        });

        if (!projectResponse.success) {
          failureCount += 1;
          continue;
        }

        updatedIds.add(lead.id);
        successCount += 1;
      }

      if (updatedIds.size > 0) {
        setLeads((current) =>
          current.map((lead) =>
            updatedIds.has(lead.id) ? { ...lead, status: "Won" } : lead
          )
        );
      }

      await completeBatchAction(successCount, failureCount, "Mark Won");
    } finally {
      setIsBatchProcessing(false);
    }
  }

  const emptyMessage =
    leads.length === 0
      ? "No leads yet."
      : "No leads match your search or filters.";

  return (
    <Container className="py-8 md:py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Invictus CRM
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Lead Pipeline
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Internal use only — not visible to clients.
        </p>
      </div>

      <LeadToolbar
        stats={stats}
        actionMessage={actionMessage}
        showPipelineWarnings={showPipelineWarnings}
        onTogglePipelineWarnings={() =>
          setShowPipelineWarnings((current) => !current)
        }
      />

      <Card className="mb-6 p-4 md:p-5">
        <LeadFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          industryFilter={industryFilter}
          onIndustryFilterChange={setIndustryFilter}
          filteredCount={filtered.length}
          totalCount={leads.length}
        />
      </Card>

      <LeadTable
        filtered={filtered}
        emptyMessage={emptyMessage}
        selectedLeadIds={selectedLeadIds}
        selectAllRef={selectAllRef}
        allFilteredSelected={allFilteredSelected}
        onToggleSelectAll={toggleSelectAllFiltered}
        onToggleLeadSelection={toggleLeadSelection}
        queueStatus={queueStatus}
        markingId={markingId}
        activityLogsByLeadId={activityLogsByLeadId}
        onRunAI={handleRunAI}
        onMarkWon={handleMarkWon}
      />

      <BatchActionBar
        selectedCount={selectedLeadIds.size}
        isProcessing={isBatchProcessing}
        onClear={clearSelection}
        onRunAI={handleBatchRunAI}
        onGenerateOutreach={handleBatchGenerateOutreach}
        onGenerateProposal={showComingSoonToast}
        onMarkContacted={handleBatchMarkContacted}
        onMarkWon={handleBatchMarkWon}
        onArchive={showComingSoonToast}
        onDelete={showComingSoonToast}
      />
    </Container>
  );
}
