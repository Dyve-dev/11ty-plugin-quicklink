# 11ty-plugin-quicklink

@11ty plugin for including https://getquick.link in your pages

# Install

```
npm install @dyve/11ty-plugin-quicklink
```

# Enable plugin

**.eleventy.js**

```js
const quicklink = require('@dyve/11ty-plugin-quicklink');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(quicklink);
};
```

## Description

This plugin will add three news shortCodes to your eleventy templates.

### quickLinkUMD

Includes the `quicklink.umd.js` code directly in you template.

**output**

```html
<script>!function(n,e){"object"==typeof exports&&.....</string>
```

### quickLinkInit

Outputs the initialization script.

**example**

```js
{% quickLinkInit {
    el: "nav"
}
%}
```

**output**

```html
<script>
  window.addEventListener('load', () => {
    quicklink.listen({
      el: document.querySelector('nav'),
    });
  });
</script>
```

### quickLinkScript

**\*requires plugin option `copy`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(quicklink, { copy: '/your/path/quickliknk.umd.js' });
};
```

**use in template**

```js
{% quickLinkScript %}
```

Will output `<script src="/your/path/quickliknk.umd.js">`.

**in your template**

```js
// this will include the umd code in your template's output between tags <script>umd code here</script>
{% quickLinkUMD %}

// initialize quicklink
{% quickLinkInit { el: "nav" } %}
```
