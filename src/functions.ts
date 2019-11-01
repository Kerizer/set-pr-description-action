import * as exec from '@actions/exec';
import fetch from 'node-fetch';
import { WebhookPayload } from '@actions/github/lib/interfaces';

export const gitExec = (...gitOptionArray:string[]) => exec.exec('git', [...gitOptionArray]);

export const githubApiHandlerCreator = (githubContextPayload:WebhookPayload, githubToken:string) => {
  if (!githubContextPayload.pull_request) {
    throw {
      message: "This action can only be executed from PR"
    }
  }
  const repoName = githubContextPayload.pull_request.head.repo.full_name;
  const apiUrl = `https://${githubToken}@api.github.com/repos/${repoName}/`;
  return async (options:GihubApiHandlerInterface) => {
    const { resource, params, method='get' } = options;
    const fetchOptions: GithubApiRequest = {
      method
    }
    let fetchUrl = `${apiUrl}${resource}`;;
    if (params) {
      if (method==='get') {
        fetchUrl += `?${queryParams(params)}`;
      } else {
        fetchOptions.body = JSON.stringify(params);
      }
    }
    console.log('Sending request to ', fetchUrl, '. Options: ', fetchOptions); 
    const data = await fetch(fetchUrl, fetchOptions).then(data => data.json())
    return data;
  }
}

const queryParams = (params:GithubApiRequest) => {
  return Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
}

interface GithubApiRequest {
  [key: string]: any;
}

interface GihubApiHandlerInterface {
  resource: string;
  method?: string;
  params?: {
    [key: string]: any;
  }
}