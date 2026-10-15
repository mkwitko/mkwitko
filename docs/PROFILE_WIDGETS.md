# Optional GitHub profile widgets

Two open-source generators have been configured. They are **supplemental** to the source-based portfolio and should not obscure the project case studies.

## Contribution snake

- Workflow: [profile-snake.yml](../.github/workflows/profile-snake.yml)
- Engine: [Platane/snk](https://github.com/Platane/snk), pinned to a reviewed v3 revision
- Publishes SVG assets to a separate `output` branch on a weekly schedule or manual trigger.
- No personal access token is required: uses repository-scoped `GITHUB_TOKEN` with write access to this repository only.
- Once the first run succeeds and the `output` branch exists, this image can be placed at the bottom of the profile README:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mkwitko/mkwitko/output/github-snake-dark.svg" />
  <img alt="GitHub contribution graph animation" src="https://raw.githubusercontent.com/mkwitko/mkwitko/output/github-snake.svg" />
</picture>
```

**Do not insert this snippet before successful generation**, or the README will contain broken assets. The workflow is not evidence of engineering performance.

## Metrics panel

- Workflow: [profile-metrics.yml](../.github/workflows/profile-metrics.yml)
- Engine: [lowlighter/metrics](https://github.com/lowlighter/metrics), pinned to revision v3.34
- It intentionally **does not run the generation step until the profile owner creates a `METRICS_TOKEN` secret**.

Owner setup: **Settings → Secrets and variables → Actions → New repository secret**, key `METRICS_TOKEN`. Use a dedicated, short-lived, least-privilege credential; **never paste it into a README, workflow, commit, issue, or chat**. Avoid private repository read scopes; only public-profile metrics are intended. The generator documentation describes token requirements, which may vary by plugin.

After a successful run, check whether `assets/github-metrics.svg` exists on `main`. Only then should the image be embedded into README. Avoid adding inaccurate badges if runs fail.

## Security and maintenance

- GitHub Actions execute third-party software. Action references are pinned to commit SHAs to reduce unexpected upgrades; periodically review upstream security fixes.
- The workflow token has write access only to this repository and is not a general GitHub account credential.
- Metrics PAT, if configured, must be treated as a secret and periodically rotated. Avoid using high-privilege account tokens.
- If the animations fail or become distracting, disable the workflow without affecting the portfolio content.
- These workflows and their scheduled executions have not been independently validated in this documentation update.
