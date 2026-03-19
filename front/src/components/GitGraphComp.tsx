"use client"
import React, { useEffect, useMemo, useState } from "react"
import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react"
import { motion, AnimatePresence } from "framer-motion"

const THEME = {
    main: "#3b82f6",
    merged: "#10b981",
    open: "#f59e0b",
    pending: "#a855f7",
    closed: "#ef4444",
    draft: "#64748b",
    text: "#9ca3af",
}

export type PullRequestItem = {
    id: number
    branch_name: string
    description: string
    status: "merged" | "open" | "pending" | "closed" | "draft" | string
    date: string
    activity?: number
    author?: string
    title?: string
    hash?: string
    type?: string
}

interface GitGraphProps {
    prs?: PullRequestItem[]
    onSelectPR?: (id: number) => void
}

type StatusKey = "merged" | "open" | "pending" | "closed" | "draft" | "unknown"

function getStatusKey(status: string): StatusKey {
    switch (status) {
        case "merged":
        case "open":
        case "pending":
        case "closed":
        case "draft":
            return status
        default:
            return "unknown"
    }
}

function getStatusConfig(status: string) {
    const key = getStatusKey(status)

    switch (key) {
        case "merged":
            return {
                color: THEME.merged,
                label: "Merged",
                badge: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
            }
        case "open":
            return {
                color: THEME.open,
                label: "Open",
                badge: "border-amber-500/30 bg-amber-500/15 text-amber-300",
            }
        case "pending":
            return {
                color: THEME.pending,
                label: "Pending",
                badge: "border-purple-500/30 bg-purple-500/15 text-purple-300",
            }
        case "closed":
            return {
                color: THEME.closed,
                label: "Closed",
                badge: "border-rose-500/30 bg-rose-500/15 text-rose-300",
            }
        case "draft":
            return {
                color: THEME.draft,
                label: "Draft",
                badge: "border-slate-500/30 bg-slate-500/15 text-slate-300",
            }
        default:
            return {
                color: THEME.draft,
                label: "Unknown",
                badge: "border-slate-500/30 bg-slate-500/15 text-slate-300",
            }
    }
}

function getShortBranch(branchName: string) {
    return branchName.length > 13 ? `${branchName.slice(0, 13)}…` : branchName
}

function getShortTitle(title?: string, description?: string) {
    const value = title ?? description ?? "Untitled PR"
    return value.length > 18 ? `${value.slice(0, 18)}…` : value
}

function getPrLabel(pr: PullRequestItem) {
    return `#${pr.id}`
}

function getLifecycleSteps(status: string) {
    switch (getStatusKey(status)) {
        case "draft":
            return ["Draft"]
        case "pending":
            return ["Draft", "Review"]
        case "open":
            return ["Draft", "Review", "Ready"]
        case "closed":
            return ["Draft", "Review", "Closed"]
        case "merged":
            return ["Draft", "Review", "Approved"]
        default:
            return ["Draft"]
    }
}

function getStepColor(step: string) {
    switch (step) {
        case "Draft":
            return THEME.draft
        case "Review":
            return THEME.pending
        case "Ready":
            return THEME.open
        case "Closed":
            return THEME.closed
        case "Approved":
            return THEME.pending
        default:
            return THEME.text
    }
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
            <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {label} <span className="ml-1 text-white">{value}</span>
        </div>
    )
}

function InfoRow({
                     label,
                     value,
                     mono = false,
                 }: {
    label: string
    value: string
    mono?: boolean
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className={`mt-1 text-sm text-white ${mono ? "font-mono" : ""}`}>{value}</p>
        </div>
    )
}

export default function GitGraphComp({ prs = [], onSelectPR }: GitGraphProps) {
    const [activePrId, setActivePrId] = useState<number | null>(null)

    const sortedPrs = useMemo(() => {
        return [...prs].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
    }, [prs])

    const activePr = useMemo(() => {
        return sortedPrs.find((pr) => pr.id === activePrId) ?? null
    }, [sortedPrs, activePrId])

    const stats = useMemo(() => {
        return {
            total: sortedPrs.length,
            merged: sortedPrs.filter((pr) => pr.status === "merged").length,
            open: sortedPrs.filter((pr) => pr.status === "open").length,
            pending: sortedPrs.filter((pr) => pr.status === "pending").length,
            closed: sortedPrs.filter((pr) => pr.status === "closed").length,
            draft: sortedPrs.filter((pr) => pr.status === "draft").length,
        }
    }, [sortedPrs])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setIsReady(true)
        })

        return () => cancelAnimationFrame(id)
    }, [])
    const customTemplate = useMemo(
        () =>
            templateExtend(TemplateName.Metro, {
                colors: [
                    THEME.main,
                    THEME.merged,
                    THEME.open,
                    THEME.pending,
                    THEME.closed,
                    THEME.draft,
                ],
                branch: {
                    lineWidth: 4,
                    spacing: 54,
                    label: {
                        font: "600 7pt ui-sans-serif",
                        borderRadius: 8,
                    },
                },
                commit: {
                    spacing: 36,
                    dot: { size: 9 },
                    message: {
                        font: "600 7.5pt ui-sans-serif",
                        color: "#cbd5e1",
                        displayHash: false,
                        displayAuthor: false,
                    },
                },
            }),
        [],
    )

    const graphSignature = useMemo(() => {
        return sortedPrs
            .map((pr) => `${pr.id}-${pr.status}-${pr.date}`)
            .join("|")
    }, [sortedPrs])
    return (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/5 px-4 py-4 md:px-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Git PR Lifecycle Flow</h3>
                            <p className="text-sm text-slate-400">
                                Chaque branche montre un vrai cycle de vie avant fusion ou fermeture.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <StatPill label="Total" value={stats.total} color={THEME.main} />
                            <StatPill label="Merged" value={stats.merged} color={THEME.merged} />
                            <StatPill label="Open" value={stats.open} color={THEME.open} />
                            <StatPill label="Pending" value={stats.pending} color={THEME.pending} />
                            <StatPill label="Closed" value={stats.closed} color={THEME.closed} />
                            <StatPill label="Draft" value={stats.draft} color={THEME.draft} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-300">
                        <span className="text-slate-500">Lifecycle</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Main</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-500" />Draft</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500" />Review</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Ready/Open</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Closed</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Merged</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,1.5fr)_320px]">
                <div className="min-w-0 rounded-2xl border border-white/5 bg-[#0d1117] p-4 min-h-140">
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-black/10 p-2">
                        {isReady ? (
                            <Gitgraph key={graphSignature} options={{ template: customTemplate }}>
                                {(gitgraph) => {
                                    const main = gitgraph.branch({
                                        name: "main",
                                        style: {
                                            color: THEME.main,
                                            label: { bgColor: THEME.main, color: "white" },
                                        },
                                    })

                                    main.commit({
                                        subject: "Init",
                                        body: "",
                                        style: { dot: { color: THEME.main } },
                                    })

                                    sortedPrs.forEach((pr) => {
                                        const status = getStatusConfig(pr.status)
                                        const shortBranch = getShortBranch(pr.branch_name)
                                        const shortTitle = getShortTitle(pr.title, pr.description)
                                        const steps = getLifecycleSteps(pr.status)

                                        const branch = gitgraph.branch({
                                            name: shortBranch,
                                            from: main,
                                            style: {
                                                color: status.color,
                                                label: {
                                                    bgColor: status.color,
                                                    color: "white",
                                                },
                                            },
                                        })

                                        branch.commit({
                                            subject: `${getPrLabel(pr)} ${shortTitle}`,
                                            body: "",
                                            style: {
                                                dot: { color: status.color },
                                                message: { color: THEME.text },
                                            },
                                            onClick: () => {
                                                setActivePrId(pr.id)
                                                onSelectPR?.(pr.id)
                                            },
                                            onMouseOver: () => {
                                                setActivePrId(pr.id)
                                                document.body.style.cursor = "pointer"
                                            },
                                            onMouseOut: () => {
                                                document.body.style.cursor = "default"
                                            },
                                        })

                                        steps.forEach((step) => {
                                            branch.commit({
                                                subject: step,
                                                body: "",
                                                style: {
                                                    dot: { color: getStepColor(step) },
                                                    message: { color: THEME.text },
                                                },
                                                onClick: () => {
                                                    setActivePrId(pr.id)
                                                    onSelectPR?.(pr.id)
                                                },
                                                onMouseOver: () => {
                                                    setActivePrId(pr.id)
                                                    document.body.style.cursor = "pointer"
                                                },
                                                onMouseOut: () => {
                                                    document.body.style.cursor = "default"
                                                },
                                            })
                                        })

                                        if (pr.status === "merged") {
                                            main.merge({
                                                branch,
                                                fastForward: false,
                                                commitOptions: {
                                                    subject: `${getPrLabel(pr)} Merge`,
                                                    body: "",
                                                    style: {
                                                        dot: { color: THEME.merged },
                                                        message: { color: THEME.text },
                                                    },
                                                },
                                            })
                                        }
                                    })
                                }}
                            </Gitgraph>
                        ) : (
                            <div className="flex h-130 items-center justify-center text-sm text-slate-500">
                                Loading graph…
                            </div>
                        )}
                    </div>
                </div>

                <div className="min-w-0">
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Live state preview
                    </h4>

                    <AnimatePresence mode="wait">
                        {activePr ? (
                            <motion.div
                                key={activePr.id}
                                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            PR #{activePr.id}
                                        </p>
                                        <h5 className="mt-1 text-lg font-semibold text-white">
                                            {activePr.title ?? activePr.description}
                                        </h5>
                                    </div>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusConfig(activePr.status).badge}`}
                                    >
                                        {getStatusConfig(activePr.status).label}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <InfoRow label="Branch" value={activePr.branch_name} mono />
                                    <InfoRow label="Date" value={activePr.date} />
                                    <InfoRow label="Author" value={activePr.author ?? "Unknown"} />
                                    <InfoRow label="Activity" value={String(activePr.activity ?? 0)} />
                                    {activePr.hash ? <InfoRow label="Hash" value={activePr.hash} mono /> : null}
                                    {activePr.type ? <InfoRow label="Type" value={activePr.type} /> : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onSelectPR?.(activePr.id)}
                                    className="mt-4 w-full rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                                >
                                    Select this PR
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-5 text-sm text-slate-400"
                            >
                                Survole ou clique une PR dans le graphe pour voir ses détails.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}