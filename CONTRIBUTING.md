# Contributing

We gratefully accept contributions of bug fixes, feature requests design enhancements. Anything from fixing typos and broken links to CI improvements and code refactoring is much appreciated. 

## Table of Contents

- [Code Of Conduct](#code-of-conduct)
- [Notice A Bug?](#code-of-conduct)
- [Coding Rules](#coding-rules)
- [Pull Request](#pull-request)
- [License](#license)

## Code Of Conduct

Integrity is at the core of who we are. Please be respectful of others at all times to help us maintain a productive and healthy dynamic. 

## Notice A Bug? 

Page won't load? Link is broken? Wording doesn't make sense? Whatever it is, feel free to open an issue within our [Github repository](https://github.com/Verizon/verizon.github.io). 

Please use one of the following issue types to label any issue opened: 

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

## Coding Rules

- If you're looking to contribute code to our project, please ensure you open up an issue first and assign it to yourself
- Please create one branch per issue and name the branch accordingly. For example, if the issue is named `broken-community-link`, create your own branch off master like so: 

```
$ git checkout -b broken-community-link master
```

- After you've made your changes, verify that the local deployment and build pass:

```
$ gatsby develop
$ gatsby build
``` 

## Pull Request

- Refrain from fixing multiple issues in the same pull request. It's preferable to open multiple small PRs instead of one hard to review big one. Also, don't reuse old forks (or PRs) to fix new issues.
- Open a pull request in our Github repository.
  - Follow the [Pull Request Title Guidelines](#pull-request-title-guidelines).
  - Follow the template that is loaded in the PR body.
- If changes are suggested
  - Leave PR open
  - Make required updates
  - Push your new commit
- After approval a maintainer will merge the changes.
- After your pull request is merged, you can safely delete your branch.
  ```
  $ git branch -D my-fix-branch
  ```
- Update your master with the latest upstream version
  ```
  $ git pull --ff upstream master
  ```
- Close out the issue in the Github repository that you resolved.

## Pull Request Title Guidelines

The title field on the gitlab PR becomes the commit message in the master branch for the changes in the MR.

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we can use the git commit messages to **generate the change log**.

### Pull Request Title Format

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

Example

```
feat: allow overriding of webpack config
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: build, ci, docs, feat, fix, refactor, style, or test.
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on Gitlab as well as in various git tools.

The footer should contain a closing reference to an issue if any.

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference Github issues that this commit **Closes**.