# Ionicons Cleaner

Remove unused Ionicons from your Angular output.

When using ionicons with Angular you have 2 issues:
- On every build you get all the icons in the output folder. This is affecting the bundle size.
- If you want to use Angular PWA and prefetch the icons you get the list of all icons even if you only using few of them.

This repo uses npx to remove all unused icons from the output folder and from the ngsw.json file.


> **_NOTE:_**  This package is still under beta testing - use it carefully.


## Installation
Run `npm install -g ionicons-cleaner`

## How to use
- Run `npx ionicons-cleaner` to remove all unused icons from the output folder.
- Run `npx ionicons-cleaner --clean-ngsw` to remove all unused icons from the output folder and from ngsw.json.

## Dynamic icons
If you set icons dynamically, for example getting them from the server, you need then to be in your build but we don't have a way to know about them during the build.
If you have any of those you may get a warning while trying to use this package. Now you have 2 options:
1. If you sure the warming is false and you don't have icons that sets dynamically in your code you can use the force-delete option: 
`npx ionicons-cleaner --force-delete`
2. To overcome this you can use the whitelist option to list an icons that won't be deleted even if they didn't found in the code.
For example: `npx ionicons-cleaner --whitelist= add close moon --force-delete`

## Options

| Option| Description |
|:---|:---|
| `--output-path`     | By default the output path (destination of the build files) is `www`. If you want to run the script on a different folder you can pass the path to this option. |
| `--svg-dir`     | By default the svg folder is inside the output folder and called `svg`. If you store your svg files in a different folder you can change the name using this option. |
| `--force-delete`     | Delete icons even if you get the dynamic warning. Use this if you provide whitelist or if you sure the dynamic warning is false and you don't have icons that sets dynamically in your code.  |
| `--whitelist`     | List of icons that won't be deleted even if they not found in the code. |
| `--clean-ngsw`     | If you are using Angular service worker set this to true to delete the unused icons from ngsw.json |
| `--sw-svg`     | The name of the svg asset group in the ngsw.json file. Default is `svg`. |
| `--dry-run`     | Use this to see how much icons we can delete without actually deleting them. |

## Tested on:
- Angular 12
- Ionicons 5