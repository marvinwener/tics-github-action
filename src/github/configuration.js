import core from '@actions/core';
let processEnv = process.env;

export let githubConfig = {
    repo: processEnv.GITHUB_REPOSITORY,
    owner: processEnv.GITHUB_REPOSITORY.split("/")[0],
    reponame: processEnv.GITHUB_REPOSITORY.split("/")[1],
    branchname: processEnv.GITHUB_HEAD_REF,
    basebranchname: processEnv.GITHUB_BASE_REF,
    branchdir: processEnv.GITHUB_WORKSPACE,
    eventName: processEnv.GITHUB_EVENT_NAME,
    runnerOS: processEnv.RUNNER_OS
}

export let ticsConfig = {
    projectName: core.getInput('projectName', {required: true}),
    branchName: core.getInput('branchName'),
    branchDir: core.getInput('branchDir', {required: false}),
    tmpDir: core.getInput('tmpDir'),
    calc: core.getInput('calc'),
    viewerUrl: core.getInput('ticsViewerUrl') ? core.getInput('ticsViewerUrl') : "",
    clientToken: core.getInput('clientToken'),
    ticsAuthToken: processEnv.TICSAUTHTOKEN,
    installTics: core.getInput('installTics'),
    ticsConfiguration: core.getInput('ticsConfiguration'),
    extendTics: core.getInput('extendTics')
}
