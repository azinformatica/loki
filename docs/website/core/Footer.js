/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
        <footer className="nav-footer" id="footer">
          <section className="sitemap">
            <div>
              <h5>Docs</h5>
              <a href={this.docUrl('getting-started/quickStart.html')}>
                Getting Started
              </a>
              <a href={this.docUrl('components/actions/azBackButton.html')}>
                Components
              </a>
              <a href={this.docUrl('filters/azClipText.html')}>
                Filters
              </a>
            </div>
            <div>
              <h5>Community</h5>
              <a href={this.pageUrl('users.html', this.props.language)}>
                User Showcase
              </a>
              <a
                  href="https://github.com/azinformatica/loki/graphs/contributors"
                  target="_blank"
                  rel="noreferrer noopener">
                Contributors
              </a>
              <a
                  href="https://github.com/azinformatica/loki/issues"
                  target="_blank"
                  rel="noreferrer noopener">
                Issues
              </a>
            </div>
            <div>
              <h5>More</h5>
              <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
              <a href="https://github.com/azinformatica/loki" target="_blank">GitHub</a>
              <a
                  className="github-button"
                  href="https://github.com/azinformatica/loki"
                  data-icon="octicon-star"
                  data-count-href="/facebook/docusaurus/stargazers"
                  data-show-count="true"
                  data-count-aria-label="# stargazers on GitHub"
                  aria-label="Star this project on GitHub">
                Star
              </a>
            </div>
          </section>

          <section className="copyright">{this.props.config.copyright}</section>
        </footer>
    );
  }
}

module.exports = Footer;
