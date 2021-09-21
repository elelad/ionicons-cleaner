export const defaultIonicIcons = ['chevron-back','chevron-forward','close-sharp','search-sharp'];

export const extractIconNameRegex = /"|,|:|(name)|(icon)|(backButtonIcon)|\[|\]|\(|\)/g;

export const findIconsInTextRegex = /\["name","[\w-]*"\]|"name","[\w-]*"|name:"[\w-]*"|icon:"[\w-]*"|\("backButtonIcon","[\w-]*"\)/g;

export const findIconVariablesInfTextRegex = /\("name",[\w-.]*\)/g;