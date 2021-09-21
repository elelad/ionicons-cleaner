import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { deleteUnusedIcons, findIconsInJsFiles } from '../utils/utils';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function cleanUnused(_options: any): Rule {
  // @ts-ignore
  return async (tree: Tree, _context: SchematicContext) => {
    let {'output-path': outputPath, 'svg-dir': svgDir, icons, 'force-delete': force, whitelist} = _options;
    
    if (!icons.length) {
      icons = findIconsInJsFiles(tree, outputPath, svgDir, force, whitelist);
    }
    
    const newTree = deleteUnusedIcons(tree, icons, `${outputPath}/${svgDir}`);

    return newTree;
  };
}

