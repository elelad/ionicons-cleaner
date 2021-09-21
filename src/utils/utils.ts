import { Tree } from "@angular-devkit/schematics";
import { defaultIonicIcons, extractIconNameRegex, findIconsInTextRegex, findIconVariablesInfTextRegex } from "../constants/constants";
import { VariableMatchData } from "../models/models";

export function deleteUnusedIcons(tree: Tree, usedIcons: string[], svgFullPath: string) {
    if (!usedIcons.length) return tree;
    const buildDirEntry = tree.getDir(svgFullPath);
    let deleted = 0;
    if (buildDirEntry.subfiles) {
        for (const f of buildDirEntry.subfiles) {
            const fileName = f.replace('.svg', '');
            if (f.endsWith('.svg') && !usedIcons.includes(fileName)) {
                tree.delete(`${svgFullPath}/${f}`);
                deleted++;
            }
        }
    }
    console.log(`deleted ${deleted} out of ${buildDirEntry.subfiles.length}`)
    return tree;
}

export function updateNgsw(tree: Tree, usedIcons: string[], outputPath: string, svgDir: string, swSvg: string) {
    if (!usedIcons.length) return tree;
    const svgSource: Buffer | null = tree.read(`${outputPath}/ngsw.json`);
    if (svgSource) {

        const newUrls = [];
        for (const i of usedIcons) {
            newUrls.push(`${svgDir}/${i}.svg`);
        }

        const sourceText = svgSource.toString('utf-8');
        const json = JSON.parse(sourceText);
        const svg = json.assetGroups.findIndex((g: any) => g.name === swSvg);
        json.assetGroups[svg].urls = newUrls;

        const newHashTable: { [key: string]: string } = {};
        for (const ht in json.hashTable) {
            if (!ht.startsWith(`/${swSvg}`)) {
                newHashTable[ht] = json.hashTable[ht];
            }
            const keyToIconName = ht.replace(`/${swSvg}/`, '').replace('.svg', '');
            if (usedIcons.includes(keyToIconName)) {
                newHashTable[ht] = json.hashTable[ht];
            }
        }
        json.hashTable = newHashTable;

        tree.overwrite(`${outputPath}/ngsw.json`, JSON.stringify(json, null, 2))
    }
    return tree;
}

function getAllIconsList(tree: Tree, outputPath: string, svgDir: string): string[] {
    const { subfiles } = tree.getDir(`${outputPath}/${svgDir}`);
    return subfiles.map(f => f.replace('.svg', ''));
}

export function findIconsInJsFiles(tree: Tree, outputPath: string, svgDir: string, force: boolean, whitelist: string[]): string[] {
    const { subfiles = [] } = tree.getDir(outputPath);
    const jsFiles = subfiles.filter(f => f.endsWith('.js'));
    if (!jsFiles.length) return [];

    console.log('Looking for icons in the build bundle');
    
    const icons: Set<string> = new Set([...whitelist, ...defaultIonicIcons]);
    const variablesFound: string[] = [];
    const iconsOfVariables: Set<string> = new Set();
    for (const f of jsFiles) {
        const filePath = `${outputPath}/${f}`;
        const fileSource: Buffer | null = tree.read(filePath);
        if (fileSource) {
            const fileText = fileSource.toString();
            const match = findIconsInText(fileText);
            if (match?.length) {
                match.map(m => icons.add(extractIconName(m)));
            }

            const matchData = findIconVariablesInfText(fileText);
            
            variablesFound.push(...matchData.variablesFound);
            matchData.iconsOfVariables.map(i => iconsOfVariables.add(i));
        }
    }

    if ((variablesFound.length === iconsOfVariables.size) || force) {
        Array.from(iconsOfVariables).map(i => icons.add(i));
    } else {
        console.warn('\x1b[33m%s\x1b[0m', 'It looks like you have some icons that sets dynamically:', '\n', variablesFound);
        console.warn('\x1b[33m%s\x1b[0m', 'We cant delete all unused icons without knowing for sure you will not need them');
        console.warn('\x1b[33m%s\x1b[0m', 'To continue use with --whitelist={icon-name,icon-name} with --force-delete option');
        return [];
    }

    const allIcons = getAllIconsList(tree, outputPath, svgDir);
    for (const i of icons.values()) {
        if (!allIcons.includes(i)) {
            icons.delete(i);
        }
    }
    console.log(`Found ${icons.size} icons`);
    return Array.from(icons);
}

function extractIconName(text: string): string {
    const iconName = text.replace(extractIconNameRegex, '');
    return iconName;
}

function findIconsInText(text: string): string[] | null {
    const regex = findIconsInTextRegex;
    return text.match(regex);
}

function findIconVariablesInfText(text: string): VariableMatchData {
    const matchVar = text.match(findIconVariablesInfTextRegex);
    const matchData: VariableMatchData = {
        variablesFound: [],
        iconsOfVariables: []
    }
    if (matchVar?.length) {
        
        matchVar.map(v => {
            let variable = v.replace(extractIconNameRegex, '');
            matchData.variablesFound.push(variable.replace(/.\./, 'this.'));
            variable = variable.replace(/.\./, '');
            const start = `this\\.${variable}`;
            const nn = new RegExp(`${start}="[\\w-]*"`, 'g');
            const matchNew = text.match(nn);
            if (matchNew?.length) {
                matchNew.map((m: string) => {
                    const iconName = m.replace(`this.${variable}="`, '').replace('"', '');
                    matchData.iconsOfVariables.push(iconName);
                })
            }

        })
    }
    return matchData;
}