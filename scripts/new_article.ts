#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { postIdentity } from "../src/lib/content-intake.ts";

const rl = createInterface({ input, output });
const prompt = async (question: string, defaultValue = '') => (await rl.question(`${question}${defaultValue ? ` (${defaultValue})` : ''}: `)).trim() || defaultValue;
const exists = existsSync;

const main = async () => {
    try {
        // Get article information
        const title = await prompt('Title');
        if (!title) {
            console.error('Title is required');
            process.exit(1);
        }

        // Generate the entry id and date from the intake module: the folder name
        // is the URL, so the date and the slug come from one place.
        const identity = postIdentity("blog", { date: new Date(), title });
        const folderName = identity.entryId;

        // Define the blog directory path
        const projectRoot = process.cwd();
        const blogDir = join(projectRoot, 'src', 'data', 'blog');

        // Check if blog directory exists
        if (!exists(blogDir)) {
            console.log(`Blog directory does not exist: ${blogDir}`);
            console.log('Creating directory...');
            mkdirSync(blogDir, { recursive: true });
        }

        // Create the post folder
        const postDir = join(blogDir, folderName);

        // Check if folder already exists
        if (exists(postDir)) {
            const overwrite = await prompt(`Folder ${folderName} already exists. Continue? (y/N)`, 'N');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Operation cancelled.');
                process.exit(0);
            }
        } else {
            // Create the post directory
            mkdirSync(postDir, { recursive: true });
        }

        // Create the file path for index.md
        const filePath = join(postDir, 'index.md');

        // Check if file already exists
        if (exists(filePath)) {
            const overwrite = await prompt(`File index.md already exists in folder. Overwrite? (y/N)`, 'N');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Operation cancelled.');
                process.exit(0);
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
        writeFileSync(filePath, content);
        console.log(`Created new article: ${filePath}`);

        // Open in VS Code
        try {
            const { spawn } = await import("node:child_process");
            await new Promise<void>((resolve, reject) => {
                const child = spawn("code", [filePath], { stdio: "inherit" });
                child.once("error", reject);
                child.once("exit", () => resolve());
            });
            console.log('Opened in VS Code');
        } catch (error) {
            console.error('Failed to open in VS Code. Make sure VS Code is installed and in your PATH.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        process.exitCode = 1;
    } finally {
        rl.close();
    }
};

await main();
