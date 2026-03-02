import * as React from "react"
import { withStreamlitConnection, ComponentProps, Streamlit } from "streamlit-component-lib"
import GitGraphComp from "./components/GitGraphComp"
import PRTableComp from "./components/PRTableComp"

function App({ args }: ComponentProps) {
    const componentType = args["type"]
    const prs = args["prs"] || []

    // Pour éviter la boucle infinie de hauteur
    const lastHeight = React.useRef(0)

    React.useEffect(() => {
        const updateHeight = () => {
            const newHeight = document.documentElement.scrollHeight
            // On ne met à jour que si la différence est réelle
            if (Math.abs(lastHeight.current - newHeight) > 5) {
                lastHeight.current = newHeight
                Streamlit.setFrameHeight(newHeight)
            }
        }

        // Petit délai pour laisser GitGraph finir son animation
        const timeout = setTimeout(updateHeight, 150)
        return () => clearTimeout(timeout)
    }, [componentType, prs]) // Se déclenche uniquement si le type ou les données changent

    if (!componentType) return null

    return (
        <div style={{ overflow: "hidden" }}>
            {componentType === "graph" ? (
                <GitGraphComp prs={prs} />
            ) : (
                <PRTableComp prs={prs} />
            )}
        </div>
    )
}

export default withStreamlitConnection(App)