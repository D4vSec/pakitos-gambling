# Contributing Guide

To keep the repository clean and professional, follow the conventions and steps below.

## Code Conventions

We recommend following [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clear and structured commit history.

| Type          | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| **feat:**     | New functionality                                                |
| **fix:**      | Bug fixes                                                        |
| **docs:**     | Documentation changes                                            |
| **style:**    | Formatting, style, punctuation, without affecting logic          |
| **refactor:** | Code refactoring without adding features or fixing bugs          |
| **test:**     | Adding or modifying tests                                        |
| **chore:**    | Changes to build tasks, configuration, or scripts                |
| **perf:**     | Performance improvements                                         |
| **build:**    | Changes that affect the build system or dependencies             |
| **security:** | Vulnerability patches                                            |

**Commit examples:**

```
feat: add a bonus system for users
fix: correct blackjack balance calculation
docs: update README with deployment guide
style: format code according to ESLint rules
refactor: optimize bet validation function
test: add unit tests for the payment module
chore: update dependencies in package.json
chore: rename environment variables in .env
chore: remove obsolete project files
chore: adjust docker-compose.yml configuration
```

### Breaking Changes

**BREAKING CHANGES** are indicated with a **!** after the type or with `BREAKING CHANGE:` in the commit body.

**Examples:**

```
feat!: remove support for API v1
refactor!: change the database structure
```

```
feat: migrate to a new microservices architecture

BREAKING CHANGE: The API now requires JWT authentication on all endpoints
```

## Semantic Versioning (SemVer)

We follow Semantic Versioning `MAJOR.MINOR.PATCH` (e.g., 1.2.3):

```
v1.2.3
 │ │ └─── PATCH: backward-compatible fixes
 │ └───── MINOR: backward-compatible new features
 └─────── MAJOR: breaking changes
```

### How versioning works

| Change Type            | Increment | Example       | Description                               |
| ---------------------- | --------- | ------------- | ----------------------------------------- |
| Breaking Change        | MAJOR     | 1.2.3 -> 2.0.0 | Changes incompatible with previous versions |
| New Feature (feat)     | MINOR     | 1.2.3 -> 1.3.0 | New backward-compatible functionality     |
| Bug Fix (fix)          | PATCH     | 1.2.3 -> 1.2.4 | Bug fixes                                 |
| Others (docs, chore...) | PATCH    | 1.2.3 -> 1.2.4 | Internal improvements                     |

### Version and Release Flow

#### Release Stages

| Stage / Branch    | Version / Status | Description                        |
| ----------------- | ---------------- | ---------------------------------- |
| feature/          | N/A              | Development of new features        |
| develop           | N/A              | Feature integration in testing     |
| Release Candidate | v1.1.0-rc.1      | Testing before a stable release    |
| Stable            | v1.0.0 / v1.1.0  | Stable project release             |

#### Pre-release Types

| Pre-release Type  | Version        | Description                                  |
| ----------------- | -------------- | -------------------------------------------- |
| Release Candidate | v1.2.0-rc.1    | Release Candidate 1 (testing before stable)  |
| Release Candidate | v1.2.0-rc.2    | Release Candidate 2                          |
| Beta              | v1.2.0-beta.1  | Beta 1 (early testing)                       |
| Alpha             | v1.2.0-alpha.1 | Alpha 1 (internal development)               |

#### Version Evolution Example

| Version       | Type / Status                  | Description                           |
| ------------- | ------------------------------ | ------------------------------------- |
| v1.0.0        | Stable                         | Initial stable release                |
| v1.0.1        | Patch / Critical fix           | Critical bug fix                      |
| v1.1.0-rc.1   | Pre-release / Release Candidate | New feature in testing               |
| v1.1.0        | Minor / Stable feature         | New stable feature                    |
| v1.1.1        | Patch / Minor fix              | Minor bug fix                         |
| v1.2.0-beta.1 | Pre-release / Beta             | More features in beta                 |
| v2.0.0-rc.1   | Pre-release / Breaking change  | Breaking changes in testing           |
| v2.0.0        | Major / Breaking change        | New major version with breaking changes |
