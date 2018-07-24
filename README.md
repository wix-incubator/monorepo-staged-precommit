# monorepo-staged-precommit

This package adds a pre-commit hook script that runs the `precommit` script in all package.json's in projects where there are staged changes.

Uses nvm use to use the correct node version for each project.

Does not run on CI.

## Usage
1. add to all `package.json` files in monorepo by running `npm i --save-dev monorepo-staged-precommit` in all folders containg package.json. (can be done in one, yet only when installing a project with it, will the precommit-hook script be added).
2. add `precommit` script to package.json. (e.g. `"precommit": "lint-staged"`).
3. make changes and stage them.
4. run `git commit`. - all `precommit` scripts will run in projects with changes. 

## Example
Given monorepo:

```
- project
  |
  |-- projectA
  |   |
  |   |-- package.json
  |
  |-- projectB
  |   |
  |   |--package.json
  |
  |-- projectC
```

* When changing a file in projectA and staging it, the script will run the `precommit` script in `projectA/pacakge.json`.

* When changing a file in projectA and projectB and staging them the script will run the `precommit` script in both `project/package.json` and `projectB/package.json`.

* When changing a file in projectC and staging it nothing will run since projectC has no package.json.
