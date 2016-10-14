# verizon.github.io

[![Build Status](https://travis-ci.org/Verizon/verizon.github.io.svg?branch=hugo)](https://travis-ci.org/Verizon/verizon.github.io)

Home of Verizon open-source development. This site contains information about our various open source projects, technical talks that have been done by Verizon staff and our public engineering blog.

### Publishing a new article

In order to publish a new blog article, simply send a pull request that adds a new [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) file to the `content/blog` directory. Be sure to include the following TOML front-matter at the head of the file:

```
+++
layout = "single"
title  = "Name of your article"
author = "Your Name"
date   = "2016-04-01"
+++
```
That's all there is too it. Shortly after your pull request is approved and merged, a new revision of the site will be published (this can take up to half an hour depending on Github cache expiry).

### Local Development

This project makes use of [Hugo](https://gohugo.io/) for site generation. In order to build this project, follow these steps:

```
$ hugo -b http://127.0.0.1:4000
```

In order to run a local development server, simply execute the shell script that is supplied with this project:

```
$ ./bin/local-server
```

This will automatically reload the site if any files change.
