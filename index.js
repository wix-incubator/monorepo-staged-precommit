const findUp = require('find-up');
const fs = require('fs');
const {getPrecommitScripts} = require('./src/getPrecommitScript');

const gitDirectory = findUp.sync('.git');

const preCommitFilePath = `${gitDirectory}/hooks/pre-commit`;

const preCommitScript = fs.readFileSync(preCommitFilePath, 'utf-8');

const {version} = require('./package.json');

fs.writeFileSync(preCommitFilePath, getPrecommitScripts(version));