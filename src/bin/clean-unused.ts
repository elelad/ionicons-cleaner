#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { Args } from '../models/models';
import { deleteUnusedIcons, findIconsInJsFiles, updateNgsw } from '../utils/utils';


const argv: Args = yargs(process.argv.slice(2)).options({
    'output-path': { type: 'string', default: 'www' },
    'svg-dir': { type: 'string', default: 'svg' },
    'sw-svg': { type: 'string', default: 'svg' },
    'force-delete': { type: 'boolean', default: false },
    whitelist: { type: 'array', default: [] },
    'dry-run': { type: 'boolean', default: false },
    'clean-ngsw': { type: 'boolean', default: false }
}).parseSync();

const {
    'output-path': outputPath, 'svg-dir': svgDir, 'sw-svg': swSvg,
    'force-delete': force, whitelist, 'dry-run': dryRun, 'clean-ngsw': cleanNgSW
} = argv;

const icons = findIconsInJsFiles(outputPath, svgDir, force, whitelist);

if (dryRun) process.exit();

if (!icons) {
    console.log(`Didn't found output-path ${outputPath}`);
    process.exit();
}

if (!icons?.length) {
    console.log(`Didn't found any icons in your code.`);
    process.exit();
}

deleteUnusedIcons(icons as string[], `${outputPath}/${svgDir}`);

if (!cleanNgSW) process.exit();
updateNgsw(icons as string[], outputPath, svgDir, swSvg);