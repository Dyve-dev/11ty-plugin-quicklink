"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('dyve:11typlugin:quicklink');
const defaults = {
    copy: false,
};
exports.plugin = {
    initArguments: {},
    configFunction: async (eleventyConfig, options) => {
        const _options = { ...defaults, ...options };
        let quicklinkUMD = '';
        fs_1.readFile(path_1.join(__dirname, '../node_modules/quicklink/dist/quicklink.umd.js'), 'utf-8', (err, data) => {
            if (err) {
                debug(err);
            }
            if (data) {
                quicklinkUMD = data;
            }
        });
        eleventyConfig.addShortcode('quickLinkUMD', () => {
            return `<script>${quicklinkUMD}</script>`;
        });
        if (_options.copy) {
            eleventyConfig.addPassthroughCopy({
                'node_modules/@dyve/11ty-plugin-quicklink/node_modules/quicklink/dist/quicklink.umd.js': typeof _options.copy === 'string' ? _options.copy : 'quicklink.umd.js',
            });
            eleventyConfig.addShortcode('quickLinkScript', () => {
                return `<script src="/quicklink.umd.js"></script>`;
            });
        }
        eleventyConfig.addShortcode('quickLinkInit', (options) => {
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
