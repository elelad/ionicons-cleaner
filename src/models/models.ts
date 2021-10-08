export interface VariableMatchData{
    variablesFound: string[];
    iconsOfVariables: string[];
}

export interface Args{
    'output-path': string;
    'svg-dir': string;
    'sw-svg': string;
    'force-delete': boolean;
    whitelist: string[];
    'dry-run': boolean;
    'clean-ngsw': boolean;
}
