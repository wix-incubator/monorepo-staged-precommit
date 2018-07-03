const findUp = require('find-up');
const fs = require('fs');
const {getPrecommitScripts} = require('./getPrecommitScript');
const isCI = require('is-ci');

if (isCI) {
  console.log('Skipped precommit hook installation on CI');
} else {

  const gitDirectory = findUp.sync('.git');

  const preCommitFilePath = `${gitDirectory}/hooks/pre-commit`;

  const preCommitScript = fs.readFileSync(preCommitFilePath, 'utf-8');

  const {version} = require('../package.json');

  fs.writeFileSync(preCommitFilePath, getPrecommitScripts(version));

  console.log('Added precommit hook');
}