# Blop.js

Client side dropping and cropping using canvas and delivering a nice clean blob.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/harleyjessop/blop.js/master/dist/src/blop.min.js
[max]: https://raw.github.com/harleyjessop/blop.js/master/dist/src/blop.js

In your web page:

```html
<div class="blop">
    <div class="blop__dropzone">
        <input type="file" class="blop__input" />
        <span>Drag & Drop to upload</span>
        <button type="button" class="blop__select">or, Select File</button>
    </div>
    <div class="blop__preview">
        <div class="blop__result">
            <img class="blop__image img-responsive" />
        </div>
    </div>
    <menu class="blop__toolbar">
        <button type="button" class="blop__set">Set</button></li>
        <button type="reset" class="blop__clear">Clear</button></li>
    </menu>
</div>

<script src="blop.min.js"></script>
<link rel="stylesheet" href="blop.css">
<script>
jQuery(function($) {
  $('.blop').blop(); // "awesome"
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
