import { parseArgs } from "jsr:@std/cli";
import { ensureDir } from "jsr:@std/fs";

interface Annotation {
    id: string;
    text: string;
}

interface Bookmark {
    id: string;
    href: string;
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
    type: string;
    has_article: boolean;
    description: string;
    is_deleted: boolean;
    is_marked: boolean;
    is_archived: boolean;
    labels: string[];
    resources: {
        article: { src: string };
        log: { src: string };
        props: { src: string };
    };
}

interface AnnotationResponse {
    items: Annotation[];
}

const API_KEY = Deno.env.get("READDECK_API_KEY");
const API_BASE = Deno.env.get("READDECK_API_URL") || "https://readeck-crimson-water-318.fly.dev/api";

async function retrieveBookmarks(query = "?is_archived=false&labels=newsletter"): Promise<Bookmark[] | undefined> {
    if (!API_KEY) {
        console.error("Missing READDECK_API_KEY");
        Deno.exit(1);
    }

    try {
        console.log(`Retrieving bookmarks... ${query}`);

        const response = await fetch(`${API_BASE}/bookmarks${query ? `${query}` : ""
            } `, {
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${API_KEY} `,
            },
        });

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw new Error(error);
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

            console.log(`Deleted bookmark: ${bookmark.title} - ${bookmark.url}`);
        }
        console.log("Bookmarks deleted successfully");
    } catch (error) {
        console.error("Error deleting bookmarks:", error.message);
    }
}

async function getAnnotations(bookmarkId: string): Promise<Annotation[]> {
    try {
        const response = await fetch(`${API_BASE} /bookmarks/${bookmarkId}/annotations`, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
            },
        });

        const data: AnnotationResponse = await response.json();
        return data.items;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

function generateArticleMarkdown(bookmark: Bookmark): string {
    const { title, authors, url } = bookmark;
    const authorText = authors ? ` by ${authors.join(", ")}` : "";
    return `##### [${title}${authorText}](${url})`;
}

async function convertToMarkdown(bookmarks: Bookmark[]): Promise<string> {
    const markdownEntries = await Promise.all(
        bookmarks.map((bookmark) => {
            return generateArticleMarkdown(bookmark);
        })
    );
    return markdownEntries.join("\n");
}

function calculateTotalTimes(bookmarks: Bookmark[]): string {
    // Since word_count is no longer available, just return article count
    return `\nTotal articles: ${bookmarks.length}`;
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
        console.error(error.message);
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
        console.log("Bookmarks archived successfully");
    } catch (error) {
        console.error("Error archiving bookmarks:", error.message);
    }
}

// Main execution
const flags = parseArgs(Deno.args, {
    boolean: ["total", "write", "archive", "clean"],
    string: ["query"],
});

if (!API_KEY) {
    console.error("Missing READDECK_API_KEY");
    Deno.exit(1);
}

const bookmarks = await retrieveBookmarks();


if (!bookmarks) {
    console.warn("No bookmarks found");
    Deno.exit(0);
}

if (flags.total) {
    console.log(`${bookmarks.length} bookmarks found ${calculateTotalTimes(bookmarks)}`);
    Deno.exit(0);
}

if (flags.archive) {
    if (bookmarks.length > 0) {
        await archiveBookmarks(bookmarks);
    } else {
        console.warn("No newsletter articles to archive");
    }
    Deno.exit(0);
}

if (flags.clean) {
    const articles = await retrieveBookmarks("?is_loaded=false");

    if (articles) {
        console.log(`Deleting ${articles.length} unloaded bookmarks
            `);
        await delete_bookmarks(articles);
    }
    Deno.exit(0);
}


const md = await convertToMarkdown(bookmarks);
console.log(md);

if (flags.write && bookmarks.length > 0) {
    await writeToFile(md);
}
