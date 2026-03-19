"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AreaChart, AreaChartEventProps } from "@/components/AreaChart"
import GitGraphComp from "@/components/GitGraphComp"
import type { AvailableChartColorsKeys } from "@/lib/chartUtils"

type PRStatus = "merged" | "open" | "pending" | "closed" | "draft"

type RawComment = {
    body: string
    created_at: string
}

type RawMetrics = {
    code_smells: number
    cognitive_complexity: number
    complexity: number
    development_cost: number
    duplicated_lines: number
    ncloc: number
    software_quality_maintainability_rating: number
}

type RawPullRequest = {
    organisation: string
    repo: string
    prId: number
    metadata: {
        title: string
        body: string
        state: "MERGED" | "OPEN" | "CLOSED"
        created_at: string
        closed_at: string | null
    }
    comments: RawComment[]
    head_metrics: RawMetrics
    base_metrics: RawMetrics
}

type PRItem = {
    id: number
    organisation: string
    repo: string
    branch: string
    branch_name: string
    hash: string
    subject: string
    author: string
    type: "feat" | "fix" | "docs" | "refactor" | "chore" | "test" | string
    status: PRStatus
    date: string
    activity: number
    description: string
    title?: string
    createdAt: string
    closedAt: string | null
    commentsCount: number
    coverageHint: string
    complexityDelta: number
    nclocDelta: number
}

const rawDataset: RawPullRequest[] = [
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 10,
        metadata: {
            title: "33 mb validate mission",
            body: "",
            state: "MERGED",
            created_at: "2026-02-17T15:12:38Z",
            closed_at: "2026-02-17T15:18:57Z",
        },
        comments: [
            {
                body: "Quality Gate passed - 98.6% Coverage on New Code",
                created_at: "2026-02-17T15:13:51Z",
            },
        ],
        head_metrics: {
            code_smells: 27,
            cognitive_complexity: 46,
            complexity: 238,
            development_cost: 51180,
            duplicated_lines: 82,
            ncloc: 1706,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 27,
            cognitive_complexity: 35,
            complexity: 208,
            development_cost: 44760,
            duplicated_lines: 82,
            ncloc: 1492,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 23,
        metadata: {
            title: "Allow host to change the state of mission",
            body: "",
            state: "MERGED",
            created_at: "2026-03-09T08:16:12Z",
            closed_at: "2026-03-11T07:38:13Z",
        },
        comments: [
            {
                body: "Quality Gate passed - 100.0% Coverage on New Code",
                created_at: "2026-03-11T07:37:48Z",
            },
        ],
        head_metrics: {
            code_smells: 28,
            cognitive_complexity: 71,
            complexity: 389,
            development_cost: 82380,
            duplicated_lines: 0,
            ncloc: 2746,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 29,
            cognitive_complexity: 69,
            complexity: 366,
            development_cost: 79050,
            duplicated_lines: 0,
            ncloc: 2635,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 16,
        metadata: {
            title: "50 mb error dictionnary",
            body: "",
            state: "MERGED",
            created_at: "2026-02-23T10:17:17Z",
            closed_at: "2026-02-23T13:05:55Z",
        },
        comments: [
            {
                body: "Tu saurais juste régler les issues sonar",
                created_at: "2026-02-23T12:52:46Z",
            },
            {
                body: "Quality Gate passed - 96.5% Coverage on New Code",
                created_at: "2026-02-23T13:04:40Z",
            },
        ],
        head_metrics: {
            code_smells: 29,
            cognitive_complexity: 43,
            complexity: 285,
            development_cost: 62700,
            duplicated_lines: 0,
            ncloc: 2090,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 21,
            cognitive_complexity: 48,
            complexity: 278,
            development_cost: 55620,
            duplicated_lines: 0,
            ncloc: 1854,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 3,
        metadata: {
            title: "Test pr",
            body: "",
            state: "CLOSED",
            created_at: "2026-02-10T10:58:21Z",
            closed_at: "2026-02-10T11:02:56Z",
        },
        comments: [
            {
                body: "Quality Gate passed - 0.0% Coverage on New Code",
                created_at: "2026-02-10T11:03:48Z",
            },
        ],
        head_metrics: {
            code_smells: 1,
            cognitive_complexity: 4,
            complexity: 38,
            development_cost: 11970,
            duplicated_lines: 0,
            ncloc: 399,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 1,
            cognitive_complexity: 4,
            complexity: 38,
            development_cost: 11970,
            duplicated_lines: 0,
            ncloc: 399,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 27,
        metadata: {
            title: "Draft endpoint for mission archive",
            body: "draft api work in progress",
            state: "OPEN",
            created_at: "2026-03-12T09:40:00Z",
            closed_at: null,
        },
        comments: [
            {
                body: "draft version, not ready yet",
                created_at: "2026-03-12T10:00:00Z",
            },
        ],
        head_metrics: {
            code_smells: 42,
            cognitive_complexity: 82,
            complexity: 470,
            development_cost: 101000,
            duplicated_lines: 20,
            ncloc: 3400,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 39,
            cognitive_complexity: 76,
            complexity: 456,
            development_cost: 99480,
            duplicated_lines: 52,
            ncloc: 3316,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 28,
        metadata: {
            title: "Mission state review flow",
            body: "",
            state: "OPEN",
            created_at: "2026-03-13T08:10:00Z",
            closed_at: null,
        },
        comments: [
            {
                body: "LGTM after review, a few changes requested before merge",
                created_at: "2026-03-13T11:00:00Z",
            },
        ],
        head_metrics: {
            code_smells: 43,
            cognitive_complexity: 88,
            complexity: 492,
            development_cost: 107000,
            duplicated_lines: 18,
            ncloc: 3520,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 42,
            cognitive_complexity: 82,
            complexity: 470,
            development_cost: 101000,
            duplicated_lines: 20,
            ncloc: 3400,
            software_quality_maintainability_rating: 1,
        },
    },
    {
        organisation: "ReViSE-EuroSpaceCenter",
        repo: "ReViSE-backend",
        prId: 29,
        metadata: {
            title: "Live host controls mission panel",
            body: "",
            state: "OPEN",
            created_at: "2026-03-14T10:00:00Z",
            closed_at: null,
        },
        comments: [],
        head_metrics: {
            code_smells: 45,
            cognitive_complexity: 92,
            complexity: 505,
            development_cost: 110000,
            duplicated_lines: 16,
            ncloc: 3600,
            software_quality_maintainability_rating: 1,
        },
        base_metrics: {
            code_smells: 43,
            cognitive_complexity: 88,
            complexity: 492,
            development_cost: 107000,
            duplicated_lines: 18,
            ncloc: 3520,
            software_quality_maintainability_rating: 1,
        },
    },
]

const FILTERS: Array<"all" | PRStatus> = [
    "all",
    "merged",
    "open",
    "pending",
    "closed",
    "draft",
]

const ACTIVITY_COLOR: AvailableChartColorsKeys = "lime"
const STATUS_COLORS: AvailableChartColorsKeys[] = [
    "emerald",
    "amber",
    "gray",
    "pink",
    "lime",
]

function getStatusTone(status: string) {
    switch (status) {
        case "merged":
            return "text-emerald-300 bg-emerald-500/15 border-emerald-500/30"
        case "open":
            return "text-amber-300 bg-amber-500/15 border-amber-500/30"
        case "pending":
            return "text-slate-200 bg-gray-500/15 border-gray-500/30"
        case "closed":
            return "text-pink-300 bg-pink-500/15 border-pink-500/30"
        case "draft":
            return "text-lime-300 bg-lime-500/15 border-lime-500/30"
        default:
            return "text-slate-300 bg-slate-500/15 border-slate-500/30"
    }
}

function inferStatus(pr: RawPullRequest): PRStatus {
    if (pr.metadata.state === "MERGED") return "merged"
    if (pr.metadata.state === "CLOSED") return "closed"

    const title = pr.metadata.title.toLowerCase()
    const body = pr.metadata.body.toLowerCase()
    const commentsText = pr.comments.map((comment) => comment.body.toLowerCase()).join(" ")

    if (
        title.includes("draft") ||
        body.includes("draft") ||
        commentsText.includes("draft")
    ) {
        return "draft"
    }

    if (
        commentsText.includes("review") ||
        commentsText.includes("lgtm") ||
        commentsText.includes("changes requested")
    ) {
        return "pending"
    }

    return "open"
}

function extractType(title: string): PRItem["type"] {
    const lower = title.toLowerCase()

    if (lower.includes("fix") || lower.includes("correction")) return "fix"
    if (lower.includes("refactor")) return "refactor"
    if (lower.includes("doc")) return "docs"
    if (lower.includes("test")) return "test"
    if (
        lower.includes("build") ||
        lower.includes("dependency") ||
        lower.includes("swagger") ||
        lower.includes("workflow")
    ) {
        return "chore"
    }

    return "feat"
}

function buildBranchName(pr: RawPullRequest): string {
    const repoPart = pr.repo.replace(/^ReViSE-/, "").toLowerCase()
    const slug = pr.metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 22)

    return `${repoPart}/${slug || `pr-${pr.prId}`}`
}

function buildCoverageHint(pr: RawPullRequest): string {
    const allComments = pr.comments.map((comment) => comment.body).join(" ")
    const match = allComments.match(/(\d+(?:\.\d+)?)%\s+Coverage on New Code/i)
    return match ? `${match[1]}% coverage` : "No coverage info"
}

function computeActivity(pr: RawPullRequest): number {
    const commentsWeight = pr.comments.length * 2
    const complexityDelta = Math.abs(pr.head_metrics.complexity - pr.base_metrics.complexity)
    const nclocDelta = Math.abs(pr.head_metrics.ncloc - pr.base_metrics.ncloc)
    const smellsDelta = Math.abs(pr.head_metrics.code_smells - pr.base_metrics.code_smells)

    return commentsWeight + complexityDelta + smellsDelta + Math.round(nclocDelta / 20)
}

function inferAuthor(pr: RawPullRequest): string {
    const allText = [
        pr.metadata.title,
        pr.metadata.body,
        ...pr.comments.map((comment) => comment.body),
    ]
        .join(" ")
        .toLowerCase()

    if (allText.includes("dependabot")) return "Dependabot"
    return "Team"
}

function toDisplayDate(pr: RawPullRequest): string {
    return (pr.metadata.closed_at ?? pr.metadata.created_at).slice(0, 10)
}

const prDataset: PRItem[] = rawDataset
    .map((pr) => ({
        id: pr.prId,
        organisation: pr.organisation,
        repo: pr.repo,
        branch: buildBranchName(pr),
        branch_name: buildBranchName(pr),
        hash: `pr-${pr.prId}`,
        subject: pr.metadata.title,
        title: pr.metadata.title,
        author: inferAuthor(pr),
        type: extractType(pr.metadata.title),
        status: inferStatus(pr),
        date: toDisplayDate(pr),
        activity: computeActivity(pr),
        description: pr.metadata.body || pr.metadata.title,
        createdAt: pr.metadata.created_at,
        closedAt: pr.metadata.closed_at,
        commentsCount: pr.comments.length,
        coverageHint: buildCoverageHint(pr),
        complexityDelta: pr.head_metrics.complexity - pr.base_metrics.complexity,
        nclocDelta: pr.head_metrics.ncloc - pr.base_metrics.ncloc,
    }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

export default function Home() {
    const [selectedPR, setSelectedPR] = useState<number | null>(null)
    const [selectedPoint, setSelectedPoint] = useState<AreaChartEventProps>(null)
    const [activeFilter, setActiveFilter] = useState<"all" | PRStatus>("all")

    const filteredDataset = useMemo(() => {
        if (activeFilter === "all") return prDataset
        return prDataset.filter((pr) => pr.status === activeFilter)
    }, [activeFilter])

    const selectedPRData = useMemo(
        () =>
            filteredDataset.find((pr) => pr.id === selectedPR) ??
            prDataset.find((pr) => pr.id === selectedPR) ??
            null,
        [filteredDataset, selectedPR],
    )

    const summary = useMemo(() => {
        const merged = filteredDataset.filter((pr) => pr.status === "merged").length
        const open = filteredDataset.filter((pr) => pr.status === "open").length
        const pending = filteredDataset.filter((pr) => pr.status === "pending").length
        const closed = filteredDataset.filter((pr) => pr.status === "closed").length
        const draft = filteredDataset.filter((pr) => pr.status === "draft").length
        const totalActivity = filteredDataset.reduce((acc, pr) => acc + pr.activity, 0)
        const peak =
            [...filteredDataset].sort((a, b) => b.activity - a.activity)[0] ?? prDataset[0]

        return {
            total: filteredDataset.length,
            merged,
            open,
            pending,
            closed,
            draft,
            totalActivity,
            peak,
        }
    }, [filteredDataset])

    const statusChartData = useMemo(() => {
        const sorted = [...filteredDataset].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

        let mergedCount = 0
        let openCount = 0
        let pendingCount = 0
        let closedCount = 0
        let draftCount = 0

        return sorted.reduce(
            (acc, pr) => {
                if (pr.status === "merged") mergedCount++
                if (pr.status === "open") openCount++
                if (pr.status === "pending") pendingCount++
                if (pr.status === "closed") closedCount++
                if (pr.status === "draft") draftCount++

                acc.push({
                    date: pr.date,
                    merged: mergedCount,
                    open: openCount,
                    pending: pendingCount,
                    closed: closedCount,
                    draft: draftCount,
                })

                return acc
            },
            [] as Array<{
                date: string
                merged: number
                open: number
                pending: number
                closed: number
                draft: number
            }>,
        )
    }, [filteredDataset])

    return (
        <main className="min-h-screen bg-[#06111f] text-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute right-[-5%] top-[15%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 md:px-8 lg:px-10">
                <motion.section
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
                >
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                Dataset Explorer
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                                    Pull Request Lifecycle Dashboard
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                                    Une lecture plus visuelle du dataset :
                                    cycle de vie des PRs, activité quotidienne et timeline Git interactive.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map((filter) => {
                                    const isActive = activeFilter === filter
                                    return (
                                        <button
                                            key={filter}
                                            type="button"
                                            onClick={() => {
                                                setActiveFilter(filter)
                                                setSelectedPR(null)
                                                setSelectedPoint(null)
                                            }}
                                            className={`rounded-full border px-3 py-1.5 text-sm transition ${
                                                isActive
                                                    ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
                                                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                <StatCard label="Total PRs" value={summary.total} helper="Volume total" />
                                <StatCard label="Merged" value={summary.merged} helper="PRs intégrées" tone="emerald" />
                                <StatCard label="Open" value={summary.open} helper="Encore actives" tone="amber" />
                                <StatCard label="Pending" value={summary.pending} helper="En review" tone="slate" />
                                <StatCard label="Activity" value={summary.totalActivity} helper="Somme des activités" tone="lime" />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl">
                            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                                Peak Activity
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            #{summary.peak.id} · {summary.peak.subject}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-300">
                                            {summary.peak.description}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(summary.peak.status)}`}
                                    >
                                        {summary.peak.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <InfoMini label="Auteur" value={summary.peak.author} />
                                    <InfoMini label="Date" value={summary.peak.date} />
                                    <InfoMini label="Branche" value={summary.peak.branch_name} />
                                    <InfoMini label="Activity" value={String(summary.peak.activity)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <section className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.45 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">PR Activity Over Time</h2>
                                <p className="text-sm text-slate-400">
                                    Clique sur un point pour isoler un moment clé du dataset.
                                </p>
                            </div>
                        </div>

                        <AreaChart
                            className="h-72"
                            data={filteredDataset}
                            index="date"
                            categories={["activity"]}
                            colors={[ACTIVITY_COLOR]}
                            showLegend={false}
                            showGridLines
                            yAxisLabel="Activity"
                            xAxisLabel="Date"
                            fill="gradient"
                            onValueChange={setSelectedPoint}
                            valueFormatter={(value) => `${value}`}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14, duration: 0.45 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-white">Status Progression</h2>
                            <p className="text-sm text-slate-400">
                                Lecture cumulative pour voir l’évolution du flux complet.
                            </p>
                        </div>

                        <AreaChart
                            className="h-72"
                            data={statusChartData}
                            index="date"
                            categories={["merged", "open", "pending", "closed", "draft"]}
                            colors={STATUS_COLORS}
                            showLegend
                            enableLegendSlider
                            yAxisLabel="Count"
                            xAxisLabel="Date"
                            fill="gradient"
                            type="default"
                            valueFormatter={(value) => `${value} PR`}
                        />
                    </motion.div>
                </section>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.45 }}
                    className="mb-8"
                >
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-white">Git Timeline</h2>
                            <p className="text-sm text-slate-400">
                                Clique sur un commit pour afficher ses détails dans le panneau.
                            </p>
                        </div>
                    </div>

                    <GitGraphComp prs={filteredDataset} onSelectPR={setSelectedPR} />
                </motion.section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.45 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Selected PR</h3>

                        <AnimatePresence mode="wait">
                            {selectedPRData ? (
                                <motion.div
                                    key={selectedPRData.id}
                                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.22 }}
                                    className="space-y-4 rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-cyan-300">PR #{selectedPRData.id}</p>
                                            <h4 className="text-xl font-semibold text-white">
                                                {selectedPRData.subject}
                                            </h4>
                                            <p className="mt-1 text-sm text-slate-300">
                                                {selectedPRData.description}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(selectedPRData.status)}`}
                                        >
                                            {selectedPRData.status}
                                        </span>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <InfoBlock label="Organisation" value={selectedPRData.organisation} />
                                        <InfoBlock label="Repo" value={selectedPRData.repo} />
                                        <InfoBlock label="Auteur" value={selectedPRData.author} />
                                        <InfoBlock label="Date" value={selectedPRData.date} />
                                        <InfoBlock label="Branche" value={selectedPRData.branch_name} />
                                        <InfoBlock label="Hash" value={selectedPRData.hash} mono />
                                        <InfoBlock label="Type" value={selectedPRData.type} />
                                        <InfoBlock label="Activity" value={String(selectedPRData.activity)} />
                                        <InfoBlock label="Comments" value={String(selectedPRData.commentsCount)} />
                                        <InfoBlock label="Coverage" value={selectedPRData.coverageHint} />
                                        <InfoBlock label="Complexity Δ" value={String(selectedPRData.complexityDelta)} />
                                        <InfoBlock label="NCLOC Δ" value={String(selectedPRData.nclocDelta)} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-pr"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400"
                                >
                                    Clique sur une PR dans la timeline Git pour afficher ses détails.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.45 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Selected Data Point</h3>

                        <AnimatePresence mode="wait">
                            {selectedPoint ? (
                                <motion.div
                                    key={`${selectedPoint.categoryClicked}-${JSON.stringify(selectedPoint)}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="rounded-2xl border border-violet-400/20 bg-slate-950/60 p-5"
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                                        <span className="text-sm font-medium text-violet-300">
                                            Interaction chart
                                        </span>
                                    </div>

                                    <pre className="overflow-auto rounded-xl bg-black/30 p-4 text-xs text-slate-200">
                                        {JSON.stringify(selectedPoint, null, 2)}
                                    </pre>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-point"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400"
                                >
                                    Clique sur un point du graphique d’activité pour voir le payload sélectionné.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>
            </div>
        </main>
    )
}

function StatCard({
                      label,
                      value,
                      helper,
                      tone = "slate",
                  }: {
    label: string
    value: number
    helper: string
    tone?: "slate" | "emerald" | "amber" | "lime"
}) {
    const toneMap = {
        slate: "from-gray-500/10 to-gray-400/5 border-white/10",
        emerald: "from-emerald-500/15 to-emerald-400/5 border-emerald-500/20",
        amber: "from-amber-500/15 to-amber-400/5 border-amber-500/20",
        lime: "from-lime-500/15 to-lime-400/5 border-lime-500/20",
    }

    return (
        <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`rounded-2xl border bg-linear-to-br p-4 ${toneMap[tone]}`}
        >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{helper}</p>
        </motion.div>
    )
}

function InfoMini({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-medium text-white">{value}</p>
        </div>
    )
}

function InfoBlock({
                       label,
                       value,
                       mono = false,
                   }: {
    label: string
    value: string
    mono?: boolean
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className={`mt-1 text-sm text-white ${mono ? "font-mono" : ""}`}>{value}</p>
        </div>
    )
}