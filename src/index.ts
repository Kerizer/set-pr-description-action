import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import fetch from 'node-fetch';

const gitExec = (...gitOptionArray:string[]) => exec.exec('git', [...gitOptionArray]);

async function run() {
  try {
    const githubApiToken:string = core.getInput('github-token');
    const githubUserName:string = core.getInput('github-user-name');
    const githubUserEmail:string = core.getInput('github-user-email');

    console.log(github.context.payload, { depth: null });

    if (githubApiToken !== null) {
      // pullRequestApiUrl = pullRequestApiUrl.replace("api.github.com", `${githubApiToken}@api.github.com`);
    }

    if (githubUserName) {
      await gitExec('config', '--global', 'user.name', `"${githubUserName}"`);
    }

    if (githubUserEmail) {
      await gitExec('config', '--global', 'user.email', `"${githubUserEmail}"`);
    }


    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();