"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.Plugin = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('dyve:11typlugin:quicklink');
const defaults = {
    copy: false,
};
let UMDcode = '';
async function readUMDcode() {
    return await new Promise((resolve, reject) => {
        fs_1.readFile(require.resolve('quicklink/dist/quicklink.umd.js'), 'utf-8', (err, data) => {
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
class Plugin {
    constructor(options) {
        this._quicklinkUMD = '';
        this._options = { ...defaults, ...options };
        this._quicklinkUMD = UMDcode;
        if (UMDcode.length === 0) {
            readUMDcode()
                .then((data) => (this._quicklinkUMD = data))
                .catch(null);
        }
    }
    quickLinkInit(options) {
        let _options = options;
        if (typeof options === 'string') {
            _options = JSON.parse(options);
        }
        const { el, ...rest } = _options;
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
            return `<script src="/${path_1.normalize(this._options.copy)}"></script>`;
        }
        return `<script src="/quicklink.umd.js"></script>`;
    }
}
exports.Plugin = Plugin;
exports.plugin = {
    initArguments: {},
    configFunction: async (eleventyConfig, options) => {
        const _options = { ...defaults, ...options };
        const _plugin = new Plugin(_options);
        eleventyConfig.addShortcode('quickLinkUMD', () => _plugin.quicklinkUMD());
        if (_options.copy) {
            const _path = path_1.relative(__dirname, require.resolve('quicklink/dist/quicklink.umd.js'));
            eleventyConfig.addPassthroughCopy({
                [_path]: typeof _options.copy === 'string' ? _options.copy : 'quicklink.umd.js',
            });
            eleventyConfig.addShortcode('quickLinkScript', () => _plugin.quickLinkScript());
        }
        eleventyConfig.addShortcode('quickLinkInit', (options) => _plugin.quickLinkInit(options));
    },
};
