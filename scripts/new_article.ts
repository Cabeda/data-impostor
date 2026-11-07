#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

import { join } from "@std/path";
import { postIdentity } from "../src/lib/content-intake.ts";

// Function to prompt user for input
const prompt = async (question: string, defaultValue: string = ''): Promise<string> => {
    const q = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;

    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(q));

    const n = await Deno.stdin.read(buf);
    if (n === null) {
        return defaultValue;
    }

    const input = new TextDecoder().decode(buf.subarray(0, n)).trim();
    return input || defaultValue;
};

const exists = (path: string): boolean => {
    try {
        Deno.statSync(path);
        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return false;
        }
        throw error;
    }
};

const main = async () => {
    try {
        // Get article information
        const title = await prompt('Title');
        if (!title) {
            console.error('Title is required');
            Deno.exit(1);
        }

        // Generate the entry id and date from the intake module: the folder name
        // is the URL, so the date and the slug come from one place.
        const identity = postIdentity("blog", { date: new Date(), title });
        const folderName = identity.entryId;

        // Define the blog directory path
        const projectRoot = Deno.cwd();
        const blogDir = join(projectRoot, 'src', 'data', 'blog');

        // Check if blog directory exists
        if (!exists(blogDir)) {
            console.log(`Blog directory does not exist: ${blogDir}`);
            console.log('Creating directory...');
            Deno.mkdirSync(blogDir, { recursive: true });
        }

        // Create the post folder
        const postDir = join(blogDir, folderName);

        // Check if folder already exists
        if (exists(postDir)) {
            const overwrite = await prompt(`Folder ${folderName} already exists. Continue? (y/N)`, 'N');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Operation cancelled.');
                Deno.exit(0);
            }
        } else {
            // Create the post directory
            Deno.mkdirSync(postDir, { recursive: true });
        }

        // Create the file path for index.md
        const filePath = join(postDir, 'index.md');

        // Check if file already exists
        if (exists(filePath)) {
            const overwrite = await prompt(`File index.md already exists in folder. Overwrite? (y/N)`, 'N');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Operation cancelled.');
                Deno.exit(0);
            }
        }

        let content = `---
title: "${title}"
pubDate: ${identity.pubDate}
heroImage: 
heroImageAlt:
`;

        content += `---

`;

        // Write to file
        await Deno.writeTextFile(filePath, content);
        console.log(`Created new article: ${filePath}`);

        // Open in VS Code
        try {
            const command = new Deno.Command("code", {
                args: [filePath],
                stdout: "inherit",
                stderr: "inherit"
            });
            await command.output();
            console.log('Opened in VS Code');
        } catch (error) {
            console.error('Failed to open in VS Code. Make sure VS Code is installed and in your PATH.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        Deno.exit(1);
    }
};

await main();
