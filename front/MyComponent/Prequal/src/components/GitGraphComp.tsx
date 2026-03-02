import { useEffect } from "react"
import { Streamlit } from "streamlit-component-lib"
import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react"

interface GitGraphProps {
    prs: any[]
}

function GitGraphComp({ prs = [] }: GitGraphProps) {
    useEffect(() => {
        Streamlit.setFrameHeight()
    }, [prs])

    // Template plus moderne (style One Dark / VSCode)
    const customTemplate = templateExtend(TemplateName.Metro, {
        colors: ["#61afef", "#98c379", "#e5c07b", "#c678dd", "#e06c75"],
        branch: { lineWidth: 3, spacing: 40 },
        commit: {
            spacing: 50,
            dot: { size: 10, strokeWidth: 2 },
            message: { displayHash: false, displayAuthor: false, font: "italic 12pt sans-serif" },
        },
    })

    const handleCommitClick = (commit: any) => {
        // Renvoie l'ID du commit (ou de la PR associée) à Streamlit
        if (commit.subject.includes("#")) {
            const prId = commit.subject.split('#')[1].split(' ')[0]
            Streamlit.setComponentValue(parseInt(prId))
        }
    }

    return (
        <div style={{
            padding: "24px",
            backgroundColor: "#1e1e1e",
            color: "#abb2bf",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#61afef", fontWeight: 500 }}>
                🌿 Git Flow Visualizer
            </h3>

            <div style={{ overflowX: "auto" }}>
                <Gitgraph options={{ template: customTemplate }}>
                    {(gitgraph) => {
                        const main = gitgraph.branch({ name: "main", style: { color: "#61afef" } })
                        main.commit("Initial commit")

                        if (Array.isArray(prs)) {
                            prs.forEach((pr) => {
                                const branch = gitgraph.branch({
                                    name: pr.branch_name,
                                    style: { label: { display: true } }
                                })

                                // On ajoute l'ID dans le message pour le récupérer au clic
                                branch.commit({
                                    subject: `${pr.description} #${pr.id}`,
                                    onClick: handleCommitClick,
                                })

                                if (pr.status === "merged") {
                                    main.merge({
                                        branch: branch,
                                        fastForward: false,
                                        commitOptions: { subject: `Merge PR #${pr.id}`, onClick: handleCommitClick }
                                    })
                                }
                            })
                        }
                    }}
                </Gitgraph>
            </div>
        </div>
    )
}

export default GitGraphComp