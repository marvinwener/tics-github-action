import { Octokit } from "@octokit/action"; //GitHub API client for GitHub Actions
import { githubConfig } from '../configuration.js';
import core from '@actions/core';
import fs from 'fs';
import path from "node:path";
import ProxyAgent from "proxy-agent";

//Octokit client is authenticated
const octokit = new Octokit({
  request: {
    agent: new ProxyAgent(),
  },
});
const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const pullRequestNum = payload.pull_request ? payload.pull_request.number : "";

/* Helper functions to get all changed files params of a pull request */
const getParams = () => {

    let parameters = {
        accept: 'application/vnd.github.v3+json',
        owner: githubConfig.owner,
        repo: githubConfig.reponame,
        pull_number: pullRequestNum,
        per_page: 100,
        page: 1,
    }

    return parameters;
}

export const getPRChangedFiles =  async() => {

    let changedFiles = "";

    try {
       await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', getParams()).then((response) => {
            core.debug(`Getting the changed files list ${response.data}`)

            response.data && response.data.map((item) => {
                changedFiles += item.filename + " ,"
            })

            changedFiles = changedFiles.slice(0, -1); // remove the last comma

            return changedFiles; 
        })
    } catch(e) {
        core.error(`We cannot retrieve the files that changed in this PR: ${e}`)
    }

    return changedFiles;
};

export function changeSetToFileList(changeSet) {
    core.info(`\u001b[35m > Creation of file list based on PR changeSet`);
    let filesChanged = changeSet.split(",");
    let contents = "";
    
    filesChanged && filesChanged.map((item) => {
        contents += item + "\n";
    })

    var stream = fs.createWriteStream('changeSet.txt', { mode: 0o777 });
    stream.write(contents);
    stream.end();

    return path.resolve('changeSet.txt');
}
