#!/bin/sh

rm -rf ext
mkdir -p ext/js

# jQuery
curl -o ext/js/jquery.js http://code.jquery.com/jquery.min.js

# JSrender (JavaScript Template Rendering for jQuery)
curl -o ext/js/jsrender.js https://raw.github.com/BorisMoore/jsrender/master/jsrender.js

# JSO (JavaScript OAuth 2 client)
curl -o ext/js/jso.js https://raw.github.com/andreassolberg/jso/master/jso.js
