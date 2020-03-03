/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Az Informática',
    image: '/loki/img/logo-az.png',
    infoLink: 'https://www.azi.com.br',
    pinned: true
  },
  {
    caption: 'Oberon Coding',
    image: '/loki/img/logo-oberon-coding.svg',
    infoLink: 'https://www.google.com',
    pinned: true
  },
  {
    caption: 'Faciles',
    image: '/loki/img/logo-faciles.svg',
    infoLink: 'https://faciles.com.br',
    pinned: true
  }
];

const siteConfig = {
  title: 'Loki', // Title for your website.
  tagline: 'Vue UI Components built with Vuetify framework',
  url: 'https://azinformatica.github.io',
  baseUrl: '/loki/',
  projectName: 'loki',
  organizationName: 'azinformatica',
  headerLinks: [
    {doc: 'getting-started/quickStart', label: 'Docs'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
    {search: true, label: 'Search'},
  ],
  translationRecruitingLink: 'https://crowdin.com/project/azinformatica-loki',
  algolia: {
    apiKey: '58e8114f1bc514ac040082169c14133c',
    indexName: 'loki',
    placeholder: 'Search',
    algoliaOptions: {
      facetFilters: ['language:LANGUAGE', 'version:VERSION'],
    }
  },
  users,
  headerIcon: 'img/logo.svg',
  favicon: 'img/favicon.ico',
  colors: {
    primaryColor: '#12492f',
    secondaryColor: '#27b085'
  },
  copyright: `${new Date().getFullYear()} - I'm Loki ;)`,
  highlight: {
    theme: 'default'
  },
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js'
  ],
  onPageNav: 'separate',
  cleanUrl: true,
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',
  docsSideNavCollapsible: true,
  scrollToTopOptions: {
    zIndex: 100,
  },
  enableUpdateTime: true,
  enableUpdateBy: true,
};

module.exports = siteConfig;
