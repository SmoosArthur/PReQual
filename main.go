package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"PReQual/client"
	"PReQual/helper"
	"PReQual/metric"
)

const defaultWorkspace = "workspace"

func main() {
	// CLI flags
	repo := flag.String("repo", "", "GitHub repository in the form <owner>/<repo> (required)")
	workspace := flag.String("workspace", defaultWorkspace, "Workspace directory (default: tmp)")

	flag.Parse()

	// Validate required arguments
	if *repo == "" {
		fmt.Println("Error: -repo argument is required")
		flag.Usage()
		os.Exit(1)
	}

	var prClient client.PullRequestClient
	prClient = &client.GhClient{}

	var analyzer metric.ProjectAnalyser
	analyzer = &metric.SonarQubeAnalyzer{}

	prs, err := prClient.GetPullRequests(*repo)
	if err != nil {
		fmt.Printf("Error fetching pull requests: %v\n", err)
		return
	}

	for _, pr := range prs {
		fmt.Printf(
			"PR #%d: %s (Base: %s, Head: %s)\n",
			pr.Number,
			pr.Title,
			pr.BaseRefOid,
			pr.HeadRefOid,
		)

		path := fmt.Sprintf("%s/%s/pr_%d", *workspace, *repo, pr.Number)

		if err := prClient.RetrieveBranchZip(*repo, pr.HeadRefOid, path, "head.zip"); err != nil {
			fmt.Printf("Error retrieving head branch: %v\n", err)
			return
		}

		if err := prClient.RetrieveBranchZip(*repo, pr.BaseRefOid, path, "base.zip"); err != nil {
			fmt.Printf("Error retrieving base branch: %v\n", err)
			return
		}

		helper.WriteMetaDataFile(path, pr)

		formattedRepo := strings.ReplaceAll(*repo, "/", "-")

		if err := analyzer.AnalyzeProject(formattedRepo, path); err != nil {
			fmt.Printf("Error analyzing pull request: %v\n", err)
			return
		}
	}
}
