import { parseArgs } from "jsr:@std/cli";
import { ensureDir } from "jsr:@std/fs";
import * as log from "jsr:@std/log"; // new import


interface Highlight {
    created: string; // date-time
    end_offset: number; // integer
    end_selector: string; // XPath selector for end element
    id: string; // short-uid
    start_offset: number; // integer
    start_selector: string; // XPath selector for start element
    text: string; // highlighted text
}

interface Bookmark {
    id: string;
    created: string;
    updated: string;
    state: number;
    loaded: boolean;
    url: string;
    title: string;
    site_name: string;
    site: string;
    authors: string[];
    lang: string;
    text_direction: string;
    document_type: string;
    reading_time: number;
    type: string;
    has_article: boolean;
    description: string;
    is_deleted: boolean;
    is_marked: boolean;
    is_archived: boolean;
    labels: string[];
    summary?: string;
    highlights?: Highlight[];
    resources: {
        article: { src: string };
        log: { src: string };
        props: { src: string };
        thumbnail?: { src: string };
    };
}

const API_KEY = Deno.env.get("READDECK_API_KEY");
const API_BASE = Deno.env.get("READDECK_API_URL") || "https://read.cabeda.dev/api";

// Add a help function to display usage information.
function printHelp(): void {
    log.info(`
Usage: deno run --allow-net --allow-env --allow-write readeck.ts [options]

Options:
  --total       Display total number of bookmarks.
  --write       Write bookmarks to a file.
  --archive     Archive bookmarks.
  --clean       Delete unloaded bookmarks.
  --query       Custom query for retrieving bookmarks.
  --help        Show this help message.
    `);
}

async function retrieveBookmarks(query = "?labels=newsletter&is_archived=false", addHighlights: boolean = true): Promise<Bookmark[]> {
    if (!API_KEY) {
        log.error("Missing READDECK_API_KEY");
        Deno.exit(1);
    }

    try {
        log.info(`Retrieving bookmarks... ${query}`);

        const response = await fetch(`${API_BASE}/bookmarks${query ? `${query}` : ""} `, {
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${API_KEY} `,
            },
        });

        const bookmarks = await response.json();

        if (addHighlights) {
            for (const bookmark of bookmarks) {
                bookmark.highlights = await retrieveHighlights(bookmark.id);
            }
        }

        return bookmarks;
    } catch (error) {
        if (error instanceof Error) {
            log.error(error.message);
            throw new Error(error.message);
        } else {
            log.error(String(error));
            throw new Error(String(error));
        }
    }
}

async function retrieveHighlights(bookmarkId: string): Promise<Highlight[]> {
    try {
        const response = await fetch(`${API_BASE}/bookmarks/${bookmarkId}/annotations`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch highlights for bookmark ${bookmarkId}`);
        }
        const highlights = await response.json();
        return highlights;

    } catch (error: any) {
        log.error(error.message);
        throw error;
    }
}

async function delete_bookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
        for (const bookmark of bookmarks) {
            await fetch(`${API_BASE}/bookmarks/${bookmark.id}`, {
                method: "DELETE",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
            });

            log.info(`Deleted bookmark: ${bookmark.title} - ${bookmark.url}`);
        }
        log.info("Bookmarks deleted successfully");
    } catch (error) {
        log.error("Error deleting bookmarks:", error.message);
    }
}


function generateArticleMarkdown(bookmark: Bookmark): string {
    const { title, authors, url, summary } = bookmark;
    const authorText = authors && authors.length ? ` by ${authors.join(", ")}` : "";
    // Create header with title
    let markdown = `##### [${title}${authorText}](${url})`;
    // Append highlights if available as bullet points
    if (bookmark.highlights && bookmark.highlights.length) {
        markdown += "\n\n";
        for (const highlight of bookmark.highlights) {
            markdown += `- ${highlight.text}\n`;
        }
    }
    return markdown;
}

async function convertToMarkdown(bookmarks: Bookmark[]): Promise<string> {
    const markdownEntries = await Promise.all(
        bookmarks.map((bookmark) => {
            return generateArticleMarkdown(bookmark);
        })
    );
    return markdownEntries.join("\n");
}

function convertMinutesToHumanReadable(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = "";
    if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) result += `${hours > 0 ? " " : ""}${minutes} minute${minutes !== 1 ? "s" : ""}`;
    return result || "0 minutes";
}

function calculateTotalTimes(bookmarks: Bookmark[]): string {
    const totalArticles = bookmarks.length;
    const totalReadingTime = bookmarks.reduce((total, bookmark) => total + (bookmark.reading_time ?? 0), 0);
    const humanTime = convertMinutesToHumanReadable(totalReadingTime);
    return `\nTotal articles: ${totalArticles}, Total reading time: ${humanTime}`;
}

async function writeToFile(markdown: string) {
    try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}${mm}${dd}`;

        const dirPath = `src/data/reads/${yyyy}`;
        const filePath = `${dirPath}/${formattedDate}.md`;

        await ensureDir(dirPath);
        await Deno.writeTextFile(filePath, `---\npubDate: ${yyyy}-${mm}-${dd}\n---\n\n${markdown}`);
    } catch (error: any) {
        log.error(error.message);
        throw new Error(error);
    }
}

async function archiveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
        for (const bookmark of bookmarks) {
            await fetch(`${API_BASE}/bookmarks/${bookmark.id}`, {
                method: "PATCH",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({ is_archived: true }),
            });
        }
        log.info("Bookmarks archived successfully");
    } catch (error) {
        log.error("Error archiving bookmarks:", error.message);
    }
}

// Main execution
const flags = parseArgs(Deno.args, {
    boolean: ["total", "write", "archive", "clean", "help"],
    string: ["query"],
});

// Check for the help flag first.
if (flags.help) {
    printHelp();
    Deno.exit(0);
}

if (!API_KEY) {
    log.error("Missing READDECK_API_KEY");
    Deno.exit(1);
}

// Log starting operation for clarity.
log.info("Starting bookmark retrieval...");

const bookmarks = await retrieveBookmarks();

if (!bookmarks) {
    log.warn("No bookmarks found");

    Deno.exit(0);
}

if (flags.total) {
    const totalBookmarks = await retrieveBookmarks("?is_archived=false& has_labels=false", false);
    log.info(`${calculateTotalTimes(totalBookmarks)}`);
    Deno.exit(0);
}

if (flags.archive) {
    if (bookmarks.length > 0) {
        await archiveBookmarks(bookmarks);
    } else {
        log.warn("No newsletter articles to archive");
    }
    Deno.exit(0);
}

if (flags.clean) {
    const articles = await retrieveBookmarks("?is_loaded=false");
    if (articles) {
        log.info(`Deleting ${articles.length} unloaded bookmarks`);
        await delete_bookmarks(articles);
    }
    Deno.exit(0);
}

const md = await convertToMarkdown(bookmarks);

if (flags.write && bookmarks.length > 0) {
    await writeToFile(md);
    Deno.exit(0);
}

log.info(md);