const asciidoctor = require('asciidoctor.js')();
require('../index.js');

const debug = require('debug')('asciidoctor.js-pug:tests');
const assert = require('chai').assert;

describe("asciidoctor", function() {
  it("bypass template engine if no template_dir", function() {
    const doc = asciidoctor.loadFile('./test/data/001-plain-text.adoc');
    const html = doc.convert();
    assert.include(html, '</p>');
    assert.notInclude(html, '</PARA>');
    debug(html);
  });

  it("should convert simple texts", function() {
    const doc = asciidoctor.loadFile('./test/data/001-plain-text.adoc', {template_dirs: './test/templates'});
    const html = doc.convert({template_dirs: './test/templates'});
    debug(html);
  });

  it("should find templates for block elements", function() {
    const doc = asciidoctor.loadFile('./test/data/002-blocks.adoc', {template_dirs: './test/templates'});
    const html = doc.convert({template_dirs: './test/templates'});

    debug(html);
    assert.include(html, '<PARA>');
  });

  it("should find href and anchor's target", function() {
    const doc = asciidoctor.loadFile('./test/data/003-anchors.adoc', {template_dirs: './test/templates'});
    const html = doc.convert({template_dirs: './test/templates'});
    debug(html);

    assert.include(html, '<A HREF="http://asciidoctor.org">asciidoctor</A>');
  });

  it("should access attributes", function() {
    const doc = asciidoctor.loadFile('./test/data/004-attributes.adoc', {template_dirs: './test/templates'});
    const html = doc.convert({template_dirs: './test/templates'});
    debug(html);

    assert.include(html, '<IMG src="source.png" alt="Atl Text Here"></IMG>');
  });

  it("should build proper image URI", function() {
    const doc = asciidoctor.loadFile('./test/data/005-img-uri.adoc', {template_dirs: './test/templates'});
    const html = doc.convert();
    debug(html);

    assert.include(html, '<IMG src="https://image.dir/source.png" alt="Atl Text Here"></IMG>');
  });

  it("should accept the `templates` parameter", function() {
    const doc = asciidoctor.loadFile('./test/data/005-img-uri.adoc', {
      template_dirs: {
        image: () => 'IMAGE-REMOVED',
      },
    });
    const html = doc.convert();
    debug(html);

    assert.include(html, 'IMAGE-REMOVED');
  });

  it("should provides the next() method", function() {
    let passed = false; // Prevent evergreen tests
    const doc = asciidoctor.loadFile('./test/data/006-roles.adoc', {
      template_dirs: {
        paragraph: (node) => { assert.isFunction(node.next); passed = true; return ""; },
      },
    });
    const html = doc.convert();
    debug(html);

    assert.isTrue(passed);
  });
});
