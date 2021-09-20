# Ionicons Tree Shaking

Remove not used Ionicons from your Angular output.

When using ionicons with Angular you have 2 issues:
- On every build you get all the icons in the output folder. This is affecting the bundle size.
- If you want to use Angular PWA and prefetch the icons you get the list of all icons even if you only using few of them.

This repo uses Angular Schematics to remove all not used icons from the output folder and from the ngsw.json file.


## Install
Run `npm install ionic-tree-shaking`

## How to use
- Run `schematics ionic-tree-shaking:ionic-tree-shaking` to remove all unused icons from the output folder and from ngsw.json.

- Run `schematics ionic-tree-shaking:clean-unused` to remove all unused icons from the output folder only.

- Run `schematics ionic-tree-shaking:remove-from-sw` to remove all unused icons from ngsw.json only.

## Options

| Option| Description |
|:---|:---|
| `--outputPath`     | By default the output path (destination of the build files) is taken from the default project output path in the angular.json file. If you want to run the schematics on a different folder you can pass the path to this option. |
| `--svgRelativePath`     | By default the svg folder is inside the output folder and called svg. If you store your svg files in a different folder you can change the name using this option. |