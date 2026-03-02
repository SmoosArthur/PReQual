import streamlit as st
import streamlit.components.v1 as components

_my_component_func = components.declare_component(
    "pr_manager",
    url="http://localhost:5173"
)

# nos données
data_prs = [
    {"id": 101, "branch_name": "feat/api", "description": "Add endpoints", "status": "merged"},
    {"id": 102, "branch_name": "fix/css", "description": "Fix layout", "status": "open"}
]


st.title("🚀 Pull Request Dashboard")

# le graphe
selected_id_graph = _my_component_func(type="graph", prs=data_prs, key="mon_graphe")

# la table
selected_id_table = _my_component_func(type="table", prs=data_prs, key="ma_table")

# Logique de sélection
active_id = selected_id_graph or selected_id_table

if active_id:
    st.info(f"PR sélectionnée : **#{active_id}**")
    # Tu peux afficher des détails supplémentaires ici
    pr_details = next((item for item in data_prs if item["id"] == active_id), None)
    if pr_details:
        st.write(f"Description : {pr_details['description']}")