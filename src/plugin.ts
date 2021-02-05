import { readFile } from 'fs';
import { join } from 'path';
import Debug from 'debug';
import { PluginOptions } from './types';

const debug = Debug('dyve:11typlugin:quicklink');

const defaults: PluginOptions = {
  copy: false,
};

export const plugin = {
  initArguments: {},
  configFunction: async (eleventyConfig: any, options?: PluginOptions) => {
    const _options = { ...defaults, ...options };
    let quicklinkUMD = '';
    readFile(
      join(__dirname, '../node_modules/quicklink/dist/quicklink.umd.js'),
      'utf-8',
      (err, data) => {
        if (err) {
          debug(err);
        }
        if (data) {
          quicklinkUMD = data;
        }
      }
    );
    eleventyConfig.addShortcode('quickLinkUMD', () => {
      return `<script>${quicklinkUMD}</script>`;
    });

    if (_options.copy) {
      eleventyConfig.addPassthroughCopy({
        'node_modules/@dyve/11ty-plugin-quicklink/node_modules/quicklink/dist/quicklink.umd.js':
          typeof _options.copy === 'string' ? _options.copy : 'quicklink.umd.js',
      });
      eleventyConfig.addShortcode('quickLinkScript', () => {
        return `<script src="/quicklink.umd.js"></script>`;
      });
    }

    eleventyConfig.addShortcode('quickLinkInit', (options: any) => {
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
    });
  },
};
