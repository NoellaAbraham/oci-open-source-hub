// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Oracle Open Source Hub',
  tagline: 'Open source technologies on Oracle Cloud Infrastructure',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://noellaabraham.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/oci-open-source-hub/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'NoellaAbraham',
  projectName: 'oci-open-source-hub',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/zoo.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'OCI Open Source Hub',

        items: [
          {
            to: '/',
            label: 'Home',
            position: 'right',
            exact: true,
          },
          {
            to: '/about',
            label: 'About',
            position: 'right',
          },
          {
            to: '/services',
            label: 'Services',
            position: 'right',
          },
          {
            to: '/reports',
            label: 'Reports',
            position: 'right',
          },
          {
            to: '/demos-resources',
            label: 'Demos & Resources',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'OCI Open Source Hub',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/oracle',
              },
            ],
          },
        ],
        copyright: 'Copyright © 2026 Oracle Corporation · <a href="https://www.google.com/search?sca_esv=918fcbc529497425&rlz=1C1GCEA_en__1197AE1197&sxsrf=APpeQnvvz8wob1LPlxgkgSSlYv8GznKtKg:1790154874630&q=Austin,+Texas&si=APenkKl9jifxeC9ibQ_x4MSQwI5Umgo7WEBmeB2VLefJQEpIweKlLGDwuMq5vkXaLEdVe3Fs-UvTka9YOTdB_lXi9WPanukOe0J5lLkoOIbm1SXD1Q8Fo97oZN0Yb3vN4ftnVa5_Yamkr8KfrVDFx6-pBuithim-upI04YoYHHN753P4rMIaT1fMw5Hw2OFGfD7sdmXrx613&sa=X&ved=2ahUKEwjVo5TLroSXAxUS0gIHHeEqFHEQmxN6BAgeEAI" target="_blank" rel="noreferrer">Austin, Texas, United States</a>',
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
