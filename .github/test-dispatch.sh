#!/bin/bash
BRANCH="develop"
TOKEN=$(cat $HOME/.gh_token)
REPO="DataBiosphere/jade-data-repo-ui"
WORKFLOW="helmtagbump.yaml"

curl -H "Accept: application/vnd.github.everest-preview+json" \
    -H "Authorization: token ${TOKEN}" \
    --request POST \
    --data '{"ref": "'"${BRANCH}"'"}' \
    https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches
