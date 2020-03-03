const ApolloClient = require('apollo-boost').default;
const gql = require('graphql-tag').default;
const fetch = require('node-fetch').default;

const getAssociatedPRsTitles = async (githubApiToken:string, commits:string[], options: Options) => {
  const client = new ApolloClient({
    uri: `https://${githubApiToken}@api.github.com/graphql`,
    fetch
  });

  const { repo, owner } = options;

  const commitsQ = commits.map( (commit, index) => (
    `c${commit}${index}: object(expression: "${commit}") {
      ... on Commit {
        associatedPullRequests(first:5){
          edges{
            node{
              title
              number
              body
            }
          }
        }
      }
    }`
  )).join('\n');

  const data = await client.query({
    query: gql`
      query associatedPRs($repo: String!, $owner: String!){
        repository(name: $repo, owner: $owner) {
          ${commitsQ}
        }
      }
    `,
    variables: { 
      owner,
      repo,
    },
    
  })
  .then( (data:GithubApiResponse) => data.data.repository)
  .catch( (error:GithubApiResponse) => console.error(error));
  
  const prs = Object.keys(data).map( (key) => data[key].associatedPullRequests).filter(pr => pr);
  const edges = prs.map(pr => pr.edges);
  const nodes = edges.map((edge, index) => edge[0] ? edge[0].node : { number: '0', title: `No PR found for ${!!commits[index] && commits[index]}` });
  const titles = nodes.map(node => `#${node.number} - ${node.title}`);
  return titles;
}

interface GithubApiResponse {
  [key: string]: any;
}

interface Options {
  repo: string;
  owner: string;
}

export default getAssociatedPRsTitles;
