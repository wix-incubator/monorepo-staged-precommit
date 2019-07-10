const findUp = require('find-up');
const fs = require('fs');
const {getPrecommitScripts} = require('./src/getPrecommitScript');
const isCI = require('is-ci');

if (isCI) {
  console.log('Skipped precommit hook installation on CI');
  return;
}

const gitDirectory = findUp.sync('.git');

const preCommitFilePath = `${gitDirectory}/hooks/pre-commit`;

const {version} = require('./package.json');

fs.writeFileSync(preCommitFilePath, getPrecommitScripts(version));
fs.chmodSync(preCommitFilePath, '755');

console.log('Added precommit hook');
