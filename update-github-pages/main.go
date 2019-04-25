package main

// Q&D tool to fix github pages after a force push

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

var (
	dnsName      = "tinyci.org"
	orgName      = "tinyci"
	repoName     = "ci-docs"
	targetBranch = "gh-pages"
)

func main() {
	token := os.Getenv("GITHUB_TOKEN")
	if strings.TrimSpace(token) == "" {
		fmt.Println("rtfs")
		os.Exit(1)
	}

	client := github.NewClient(oauth2.NewClient(context.Background(), oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})))

	content, err := json.Marshal(map[string]interface{}{
		"cname":  dnsName,
		"source": "gh-pages",
	})

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tURL, err := client.BaseURL.Parse(path.Join("repos", orgName, repoName, "pages"))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	req, err := http.NewRequest("PUT", tURL.String(), bytes.NewBuffer(content))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	req.Header.Add("Accept", "application/vnd.github.mister-fantastic-preview+json")

	resp, err := client.Do(context.Background(), req, ioutil.Discard)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if resp.StatusCode-200 > 100 {
		fmt.Println("We failed at updating github's CNAME for our docs branch", resp.StatusCode)
		os.Exit(1)
	}
}
