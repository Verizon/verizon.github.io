# verizon.github.io

[![Build Status](https://travis-ci.org/Verizon/verizon.github.io.svg?branch=master)](https://travis-ci.org/Verizon/verizon.github.io)

Home of Verizon open-source development. This site contains information about our various open source projects, technical talks that have been done by Verizon staff and our public engineering blog.

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
