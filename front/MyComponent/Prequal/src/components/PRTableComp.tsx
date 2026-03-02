import * as React from "react"
import { Streamlit } from "streamlit-component-lib"

interface PRTableProps {
    prs: any[]
}

const PRTableComp = ({ prs }: PRTableProps) => {
    // Fonction pour renvoyer la PR sélectionnée à Streamlit
    const selectPR = (id: number) => {
        Streamlit.setComponentValue(id)
    }

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            backgroundColor: "#ffffff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <thead>
                <tr style={{ color: "#888", fontSize: "0.85rem", textTransform: "uppercase" }}>
                    <th style={headerStyle}>ID</th>
                    <th style={headerStyle}>Branche</th>
                    <th style={headerStyle}>Description</th>
                    <th style={headerStyle}>Statut</th>
                </tr>
                </thead>
                <tbody>
                {prs.map((pr) => (
                    <tr
                        key={pr.id}
                        onClick={() => selectPR(pr.id)}
                        style={rowStyle}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                    >
                        <td style={cellStyle}><strong>#{pr.id}</strong></td>
                        <td style={cellStyle}>
                            <span style={branchBadgeStyle}>{pr.branch_name}</span>
                        </td>
                        <td style={cellStyle}>{pr.description}</td>
                        <td style={cellStyle}>
                            <StatusBadge status={pr.status} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

// Sous-composant pour les badges de statut
const StatusBadge = ({ status }: { status: string }) => {
    const isMerged = status === "merged"
    return (
        <span style={{
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: isMerged ? "#e6f4ea" : "#fff8e1",
            color: isMerged ? "#1e7e34" : "#b05d22",
            border: `1px solid ${isMerged ? "#ceead6" : "#ffecb3"}`
        }}>
            {status.toUpperCase()}
        </span>
    )
}

const headerStyle: React.CSSProperties = { padding: "12px", textAlign: "left", fontWeight: 500 }
const cellStyle: React.CSSProperties = { padding: "12px", borderBottom: "none" }
const branchBadgeStyle: React.CSSProperties = {
    backgroundColor: "#f1f3f5",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.9em",
    color: "#495057"
}
const rowStyle: React.CSSProperties = {
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "8px",
    backgroundColor: "#000",
}

export default PRTableComp