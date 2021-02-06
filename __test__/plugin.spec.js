const fs = require('fs');
const { join } = require('path');
const chai = require('chai');
const { spawn } = require('child_process');
const { Plugin } = require('../plugin/plugin');
const rimraf = require('rimraf');

chai.should();

describe('PLUGIN', () => {
  before((done) => {
    rimraf('./_site/**', (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });
  it('eleventy should run', (done) => {
    const eleventy = spawn('npx', ['eleventy']);
    eleventy.on('close', (code) => {
      code.should.equal(0);
      done();
    });
  });
  it('_site/index.html is created', async () => {
    const exist = fs.existsSync(join(__dirname, '_site/index.html'));
    exist.should.be.true;
  });
  it('_site/index.html should not be empty', async () => {
    const content = fs.readFileSync(join(__dirname, '_site/index.html'), 'utf-8');
    content.length.should.gt(600);
  });
  /* it('_site/quicklink.umd.js should be copied', async () => {
    const exist = fs.existsSync(join(__dirname, '_site/quicklink.umd.js'));
    exist.should.be.true;
  }); */
  it('_site/subfolder/quicklink.umd.js should be copied', async () => {
    const exist = fs.existsSync(join(__dirname, '_site/subfolder/quicklink.umd.js'));
    exist.should.be.true;
  });

  it('plugin returns UMD code', async () => {
    const plugin = new Plugin();
    const umd = plugin.quicklinkUMD();
    umd.should.be.of.string;
    umd.length.should.gt(20);
  });

  it('<script src="/quicklink.umd.js"></script>', async () => {
    const plugin = new Plugin({ copy: true });
    const scriptTag = plugin.quickLinkScript();
    scriptTag.should.be.of.string;
    scriptTag.length.should.gt(15);
    scriptTag.should.contain('/quicklink.umd.js');
  });
  it('<script src="/subfolder/quicklink.umd.js"></script>', async () => {
    const plugin = new Plugin({ copy: 'subfolder/quicklink.umd.js' });
    const scriptTag = plugin.quickLinkScript();
    scriptTag.should.be.of.string;
    scriptTag.length.should.gt(15);
    scriptTag.should.contain('/subfolder/quicklink.umd.js');
  });
});
