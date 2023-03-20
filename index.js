#!/usr/bin/env node
const fs = require('fs');
const {getPrecommitScript} = require('./src/getPrecommitScript');
const isCI = require('is-ci');
const {execSync} = require('child_process');

if (isCI) {
  console.log('Skipped precommit hook installation on CI');
  return;
}

const hooksDirectory = execSync('git rev-parse --git-path hooks', {encoding: 'utf8'}).replace('\n', '');
const preCommitFilePath = `${hooksDirectory}/pre-commit`;
const {version} = require('./package.json');

const FILE_HEADER = "monorepo-staged-precommit";

let fileStart = '';
let fileEnd = '';
if (fs.existsSync(preCommitFilePath)) {
  const file = fs.readFileSync(preCommitFilePath, 'UTF-8');
  const lines = file.split('\n');

  const start = lines.findIndex(line => line.startsWith(`# ${FILE_HEADER}`));
  const end = lines.findIndex(line => line.startsWith(`# end ${FILE_HEADER}`));
  fileStart = start >=0 ? lines.slice(0, start).join('\n'): lines.join('\n');
  fileEnd = start >=0 && end >=0 ? lines.slice(end + 1).join('\n'): '';
}

const file = [fileStart, getPrecommitScript(FILE_HEADER, version), fileEnd].filter(content => !!content).join('\n');

fs.writeFileSync(preCommitFilePath, file);
fs.chmodSync(preCommitFilePath, '755');

console.log('Added precommit hook');
