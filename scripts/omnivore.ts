import { parseArgs } from "jsr:@std/cli";
import { ensureDir } from "jsr:@std/fs";

interface Article {
  id: string;
  title: string;
  url: string;
  author?: string;
  wordsCount: number;
  highlights: {
    annotation: string;
  }[];
}

interface Edge {
  node: Article;
}

interface Response {
  data: {
    search: {
      edges: Edge[];
      pageInfo: {
        totalCount: number;
      };
    };
  };
}

async function retrieveNewsletter(query = "in:inbox label:newsletter"): Promise<Response | undefined> {
  const graphql = `query Search($after: String, $first: Int, $query: String) {
      search(first: $first, after: $after, query: $query) {
        ... on SearchSuccess {
          edges {
            node {
              id
              title
              url
              author
              wordsCount
              highlights {
                annotation
              }
            }
          }
          pageInfo {
            totalCount
          }
        }
        ... on SearchError {
          errorCodes
        }
      }
    }
      `;

  if (!API_KEY) {
    console.error("Missing OMNIVORE_API_KEY");
    Deno.exit(1);
  }

  try {
    const response = await fetch("https://api-prod.omnivore.app/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: API_KEY,
      },
      body: JSON.stringify({
        query: graphql,
        variables: {
          query,
          first: 1000,
        },
      }),
    });

    const json: Response = await response.json();

    return json;
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
}

function generateArticleMarkdown(article: Article, summary: boolean): string {
  const { title, author, url, highlights } = article;
  const authorText = author ? ` by ${author}` : "";
  const highlightsText = highlights.filter(highlight => highlight.annotation).map((highlight) => `\n- ${highlight.annotation}`);
  return `### [${title}${authorText}](${url})
  ${highlightsText}\n`;
}

function convertToMarkdown(articles: Article[], summary: boolean = true): string {
  let markdown = articles.map(article => generateArticleMarkdown(article, summary)).join("\n");
  // markdown = markdown_total_times(articles, markdown);
  return markdown;
}

function markdown_total_times(articles: Article[], markdown: string) {
  const totalWordCount = articles.reduce((acc, article) => acc + article.wordsCount, 0);
  const totalMinutes = Math.ceil(totalWordCount / 200);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  markdown += `\n\nTotal articles: ${articles.length}`;
  markdown += `\nTotal words: ${totalWordCount}`;
  markdown += `\nTotal reading time: ${hours} hours and ${minutes} minutes`;
  return markdown;
}

async function archiveNewsletters(articles: Article[]): Promise<void> {
  console.log("Archiving articles with newsletter label");

  try {
    await articles.map((article) => {
      archiveNewsletter(article.id);
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
  console.log("Articles archived");
}

async function archiveNewsletter(id: string): Promise<void> {
  try {
    const graphql = ` mutation SetLinkArchived($input: ArchiveLinkInput!) {
          setLinkArchived(input: $input) {
            ... on ArchiveLinkSuccess {
              linkId
              message
            }
            ... on ArchiveLinkError {
              message
              errorCodes
            }
          }
        }
      `;

    if (!API_KEY) {
      console.error("Missing OMNIVORE_API_KEY");
      Deno.exit(1);
    }

    const result = await fetch("https://api-prod.omnivore.app/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: API_KEY,
      },
      body: JSON.stringify({
        query: graphql,
        variables: {
          input: {
            archived: true,
            linkId: id,
          },
        },
      }),
    });

    await result.json();
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
}

async function writeToFile(markdown: string) {
  try {

    // Get today's date in YYYYMMDD format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}${mm}${dd}`;

    // Define the directory and file path
    const dirPath = `src/content/reads/${yyyy}`;
    const filePath = `${dirPath}/${formattedDate}.md`;

    // Create the directory if it doesn't exist
    await ensureDir(dirPath);

    // Write the output to the Markdown file
    const markdownContent = `---\npubDate: ${yyyy}-${mm}-${dd}\n---\n\n${md}`;
    await Deno.writeTextFile(filePath, markdownContent);
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error);
  }
}

const API_KEY = Deno.env.get("OMNIVORE_API_KEY");

if (!API_KEY) {
  console.error("Missing OMNIVORE_API_KEY");
  Deno.exit(1);
}
const flags = parseArgs(Deno.args, {
  boolean: ["total", "archive", "complete"],
  string: ["query"],
});

if (flags.total) {
  if (flags.query) {
    console.log(flags.query);
  } else {
    flags.query = "in:inbox no:label";
  }

  const toread = await retrieveNewsletter(flags.query);
  const times = markdown_total_times(toread?.data.search.edges.map((x) => x.node) as Article[], "");
  console.log(`${toread?.data.search.pageInfo.totalCount} articles found ${times}`);
  Deno.exit(0);
}

const response = await retrieveNewsletter();

if (!response) {
  console.error("No articles found");
  Deno.exit(1);
}
const articles = response.data.search.edges.map((x) => x.node) as Article[];

if (articles.length === 0) {
  console.warn("No articles found");
  Deno.exit(0);
}

const md = await convertToMarkdown(articles, flags.complete)
console.log(md);


if (flags.write) {
  await writeToFile(md);
}

if (flags.archive) {
  archiveNewsletters(articles);
}



