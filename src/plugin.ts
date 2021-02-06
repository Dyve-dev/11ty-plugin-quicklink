import { readFile } from 'fs';
import { normalize, relative } from 'path';
import Debug from 'debug';
import { PluginOptions } from './types';

const debug = Debug('dyve:11typlugin:quicklink');

const defaults: PluginOptions = {
  copy: false,
};

let UMDcode: string = '';

async function readUMDcode(): Promise<string> {
  return await new Promise((resolve, reject) => {
    readFile(require.resolve('quicklink/dist/quicklink.umd.js'), 'utf-8', (err, data) => {
      if (err) {
        debug(err);
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
}
readUMDcode()
  .then((data) => (UMDcode = data))
  .catch(null);
export class Plugin {
  private _options: PluginOptions;
  private _quicklinkUMD: string = '';

  constructor(options?: PluginOptions) {
    this._options = { ...defaults, ...options };
    this._quicklinkUMD = UMDcode;
    if (UMDcode.length === 0) {
      readUMDcode()
        .then((data) => (this._quicklinkUMD = data))
        .catch(null);
    }
  }

  quickLinkInit(options: any) {
    const { el, ...rest } = options;
    const others = Object.keys(rest).map((k) => `${k}:${rest[k]}`);

    return `<script>
      window.addEventListener('load', () =>{
        quicklink.listen({
          ${el ? 'el: document.querySelector("' + String(el) + '")' : ''},
          ${others.join(',')}
        });
      });
      </script>`;
  }

  quicklinkUMD() {
    return `<script>${this._quicklinkUMD}</script>`;
  }

  quickLinkScript() {
    if (this._options.copy && typeof this._options.copy === 'string') {
      return `<script src="/${normalize(this._options.copy)}"></script>`;
    }
    return `<script src="/quicklink.umd.js"></script>`;
  }
}

export const plugin = {
  initArguments: {},
  configFunction: async (eleventyConfig: any, options?: PluginOptions) => {
    const _options = { ...defaults, ...options };
    const _plugin = new Plugin(_options);

    eleventyConfig.addShortcode('quickLinkUMD', () => _plugin.quicklinkUMD());

    if (_options.copy) {
      const _path = relative(__dirname, require.resolve('quicklink/dist/quicklink.umd.js'));
      eleventyConfig.addPassthroughCopy({
        [_path]: typeof _options.copy === 'string' ? _options.copy : 'quicklink.umd.js',
      });
      eleventyConfig.addShortcode('quickLinkScript', () => _plugin.quickLinkScript());
    }

    eleventyConfig.addShortcode('quickLinkInit', (options: any) => _plugin.quickLinkInit(options));
  },
};
