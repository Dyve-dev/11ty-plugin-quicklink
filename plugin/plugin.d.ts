import { PluginOptions } from './types';
export declare class Plugin {
    private _options;
    private _quicklinkUMD;
    constructor(options?: PluginOptions);
    quickLinkInit(options: any): string;
    quicklinkUMD(): string;
    quickLinkScript(): string;
}
export declare const plugin: {
    initArguments: {};
    configFunction: (eleventyConfig: any, options?: PluginOptions | undefined) => Promise<void>;
};
