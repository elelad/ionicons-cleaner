import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getIconsList, getOutputPath } from '../utils/utils';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ioniconsTreeShaking(_options: any): Rule {
  // @ts-ignore
  return async (tree: Tree, _context: SchematicContext) => {
    let outputPath = _options.outputPath;
    if (!outputPath){
      outputPath = await getOutputPath(tree);
      _options.outputPath = outputPath;
    }
    
    const icons = await getIconsList(tree);

    const cleanRole = schematic('clean-unused', {..._options, icons});
    const swRole = schematic('remove-from-sw', {..._options, icons});

    return chain([cleanRole, swRole]);
  };
}

