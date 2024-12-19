#!/usr/bin/env node
/* istanbul ignore file */
import { writeFileSync } from "fs";
import { fakeConfig, getConfig } from "./configReader";
import { createCSSBundle } from "./styleProcessor";
export { createCSSBundle, getConfig }
import chokidar from 'chokidar';

import { Command } from "commander";
const program = new Command();

program
    .version("0.0.1")
    .description("BlackSquareUI CLI")
    .action(async (options) => {
        const config = await getConfig()
        if (!config) {
            return console.error("you need to run `npx blacksquare init` to create config file")
        }
        const watcher = chokidar.watch(config.content.sourceDir, {
            persistent: true,
            ignored: (path, stats) => stats?.isFile() && !path.endsWith(config.content.fileExtension),
            ignoreInitial: true,
        });

        watcher.on('all', async () => {
            await createCSSBundle(config);
        });

        await new Promise(() => { });
    });

program.command('init')
    .action(() => {
        writeFileSync("BlackSquareUI.json", JSON.stringify(fakeConfig()))
    });

program.parse();