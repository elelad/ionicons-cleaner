import * as cheerio from 'cheerio';
import { Tree } from "@angular-devkit/schematics";
import { getWorkspace } from '@schematics/angular/utility/workspace';

export async function getIconsList(tree: Tree): Promise<string[]> {
    const projects = await (await getWorkspace(tree)).projects;

    const icons: Set<string> = new Set();
    for (let p of projects.values()) {
        checkInFolder(tree, p.sourceRoot as string, icons);
    }

    return Array.from(icons.values());
}

export function checkInFolder(tree: Tree, path: string, iconsSet: Set<string>) {
    const dirEntry = tree.getDir(path);
    for (const dir of dirEntry.subdirs) {
        const subDirEntry = dirEntry.dir(dir);
        if (tree.getDir(subDirEntry.path).subdirs) {
            checkInFolder(tree, subDirEntry.path, iconsSet);
        }
        const files = subDirEntry.subfiles;
        if (files) {
            for (const f of files) {
                if (f.endsWith('html')) {
                    const c: Buffer | null = tree.read(subDirEntry.path + '/' + f);
                    if (c) {
                        const str = c.toString();
                        const cheerioDom = cheerio.load(str);
                        const listElem = cheerioDom('ion-icon');
                        if (listElem) {
                            for (const el of listElem) {
                                if (el.attribs.name) {
                                    iconsSet.add(el.attribs.name);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export function deleteUnusedIcons(tree: Tree, usedIcons: string[], svgFullPath: string) {
    const buildDirEntry = tree.getDir(svgFullPath);
    if (buildDirEntry.subfiles) {
        for (const f of buildDirEntry.subfiles) {
            const fileName = f.replace('.svg', '');
            if (f.endsWith('.svg') && !usedIcons.includes(fileName)) {
                tree.delete(`${svgFullPath}/${f}`);
            }
        }
    }
    return tree;
}

export function updateNgsw(tree: Tree, usedIcons: string[], outputPath: string, svgRelativePath: string) {
    const newUrls = [];
    for (const i of usedIcons) {
        newUrls.push(`${svgRelativePath}/${i}.svg`);
    }

    const svgSource: Buffer | null = tree.read(`${outputPath}/ngsw.json`);
    if (svgSource) {
        const sourceText = svgSource.toString('utf-8');
        const json = JSON.parse(sourceText);
        json.assetGroups[2].urls = newUrls;
        tree.overwrite(`${outputPath}/ngsw.json`, JSON.stringify(json, null, 2))
    }
    return tree;
}

export async function getOutputPath(tree: Tree): Promise<string> {
    const angularJsonSource: Buffer | null = tree.read('./angular.json');
    if (!angularJsonSource) return 'www';
    const angularJson = JSON.parse(angularJsonSource.toString('utf8'));
    console.log('angularJson.defaultProject', angularJson.defaultProject);
    const projects = await (await getWorkspace(tree)).projects;
    const defaultProject = projects.get(angularJson.defaultProject);
    if (!defaultProject) return 'www';
    const  outputPath = defaultProject.targets.get('build')?.options?.outputPath as string ?? 'www';
    return outputPath;
}