// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkWikiLink } from './src/plugins/remark-wikilink.mjs';
import { remarkObsidianCallout } from './src/plugins/remark-obsidian-callout.mjs';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const customSite = process.env.SITE_URL;
const customBase = process.env.SITE_BASE;
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPage =
  Boolean(repositoryOwner) &&
  Boolean(repositoryName) &&
  repositoryName !== `${repositoryOwner}.github.io`;

const githubPagesSite =
  repositoryOwner && repositoryName
    ? `https://${repositoryOwner}.github.io${isProjectPage ? `/${repositoryName}` : ''}`
    : undefined;

const resolvedSite =
  customSite || (isGitHubActions && githubPagesSite ? githubPagesSite : 'https://bitorst.github.io');

const resolvedBase =
  customBase || (isGitHubActions && isProjectPage && repositoryName ? `/${repositoryName}` : '/');

// https://astro.build/config
export default defineConfig({
  site: resolvedSite,
  base: resolvedBase,
  integrations: [
    expressiveCode(),
    mdx({
      remarkPlugins: [remarkMath, remarkWikiLink, remarkObsidianCallout],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
