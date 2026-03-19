This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```
to install dependencies
```bash
npm install
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

There are currently two component files: one for “gitgraph” and the other for “areachart”,
used to display the information

The dataset is located in `app/page.tsx` 

# dashboard description 
## PR Lifecycle Dashboard

A React / Next.js dashboard designed to visualize Pull Request lifecycles through:

- summary cards
- an activity chart
- a cumulative status chart
- an interactive Git timeline
- a detail panel for the selected PR

The goal is to represent a Pull Request dataset in a way that is much more visual and understandable than a plain table.

---

## Overview

This project displays a dashboard focused on the lifecycle of Pull Requests.

It allows users to:

- filter PRs by status
- visualize activity over time
- observe cumulative status evolution
- represent PR lifecycles in an interactive GitGraph
- inspect detailed information for a selected PR

Supported statuses are:

- `merged`
- `open`
- `pending`
- `closed`
- `draft`

---

## Main layout

The main page is divided into four major sections.

### 1. Summary section
At the top of the page, a summary block displays:

- the dashboard title
- filter buttons by status
- KPI cards:
    - total number of PRs
    - number of merged PRs
    - number of open PRs
    - number of pending PRs
    - total activity

A "Peak Activity" card also highlights the most active PR.

---

### 2. Charts
Two charts are displayed.

#### PR Activity Over Time
Shows how PR activity evolves over time.

This chart allows the user to:
- spot activity peaks
- click a point
- inspect the selected payload in the detail panel

#### Status Progression
Shows the cumulative evolution of statuses:

- merged
- open
- pending
- closed
- draft

This chart helps visualize how the PR flow evolves over time.

---

### 3. Git Timeline
The `GitGraphComp` component represents PRs as an interactive Git timeline.

Each PR is displayed as a branch with a small visual lifecycle.

Examples:

- `draft` → Draft
- `pending` → Draft → Review
- `open` → Draft → Review → Ready
- `closed` → Draft → Review → Closed
- `merged` → Draft → Review → Approved → Merge

This makes the lifecycle of each PR much easier to understand at a glance.

---

### 4. Detail panels
Two panels are displayed at the bottom of the page.

#### Selected PR
Displays information about the selected PR:

- identifier
- title
- description
- author
- date
- branch
- hash
- type
- activity

#### Selected Data Point
Displays the payload of the selected point in the activity chart.

---

## Technologies used

- **Next.js**
- **React**
- **TypeScript**
- **Framer Motion**
- **Tailwind CSS**
- **Recharts**
- **@gitgraph/react**

---