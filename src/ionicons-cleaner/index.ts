import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findIconsInJsFiles } from '../utils/utils';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ioniconsCleaner(_options: any): Rule {
  // @ts-ignore
  return async (tree: Tree, _context: SchematicContext) => {
    let {'output-path': outputPath, 'svg-dir': svgDir, 'force-delete': force, whitelist} = _options;
    
    const icons = findIconsInJsFiles(tree, outputPath, svgDir, force, whitelist);

    if(icons.length){
      const cleanRole = schematic('clean-unused', {..._options, icons}, {interactive: false});
      const swRole = schematic('remove-from-sw', {..._options, icons}, {interactive: false});

      return chain([cleanRole, swRole]);
    }

    console.log('No icons found');
    return tree;

    
  };
}

