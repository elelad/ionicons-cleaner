import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { deleteUnusedIcons, getIconsList, getOutputPath } from '../utils/utils';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function cleanUnused(_options: any): Rule {
  // @ts-ignore
  return async (tree: Tree, _context: SchematicContext) => {
    let outputPath = _options.outputPath;
    if (!outputPath) {
      outputPath = await getOutputPath(tree);
    }

    let icons = _options.icons;
    if (!icons) {
      icons = await getIconsList(tree);
    }

    const svgRelativePath = _options.svgRelativePath;
    const newTree = deleteUnusedIcons(tree, icons, `${outputPath}/${svgRelativePath}`);

    return newTree;
  };
}

