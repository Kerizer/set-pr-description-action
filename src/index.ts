import * as core from '@actions/core';
import * as github from '@actions/github';
import { gitExec, githubApiHandlerCreator } from './functions';

async function run() {
  try {
    if (!github.context.payload.pull_request) {
      throw {
        message: "This action can only be executed from PR"
      }
    }
    const githubApiToken:string = core.getInput('github-token');
    const githubUserName:string = core.getInput('github-user-name');
    const githubUserEmail:string = core.getInput('github-user-email');

    // console.log();github.context.payload.
    const githubApi = githubApiHandlerCreator(github.context.payload, githubApiToken);
    const prNumber = github.context.payload.pull_request.number;

    const githubCommits = githubApi({resource: `pulls/${prNumber}/commits`});

    console.log('githubCommits: ', JSON.stringify(githubCommits));

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