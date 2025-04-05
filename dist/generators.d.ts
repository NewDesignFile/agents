import { TemplateFiles, TemplateVariables } from './types.js';
export interface GenerateOptions {
    outputDir: string;
    files: string[];
    templates?: TemplateFiles;
    variables?: TemplateVariables;
}
export declare const TEMPLATES: TemplateFiles;
export declare function generateFiles(options: GenerateOptions): Promise<void>;
//# sourceMappingURL=generators.d.ts.map