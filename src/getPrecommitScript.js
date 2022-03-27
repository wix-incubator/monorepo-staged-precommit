function getPrecommitScript(fileHeader, version) {
  return `# ${fileHeader} ${version}

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

command_exists npm || {
  echo >&2 "precommit > can't find npm in PATH, skipping precommit git hook"
  exit 1
}

STAGED=\`git diff --name-only --cached\`

package="/package.json"
git="/.git"

find_package() {
    parentDirectory=$(dirname $1)
    if [ -f $parentDirectory$package ]; then
        RESULT=$parentDirectory$package
    elif [ -d $parentDirectory$git ]; then
        RESULT=''
    else
        RESULT=$(find_package $parentDirectory)
    fi

    echo $RESULT
}

list=()
set -f; IFS=$'\\n'
for staged in $STAGED; do
    item=$(find_package $staged)

    if [[ -z "$item" ]]; then
        echo skipped $staged
    elif grep -q precommit "$item"; then
        list+=($item)
    fi
done

files=$(echo "\${list[*]}" | sort -u)

set +f

command_exists nvm
hasNvm=$?
if [ $hasNvm == 0 ]
then
    export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";
fi

command_exists fnm
hasFnm=$?


nvmrc=".nvmrc"

exitCode=0
for file in $files; do
    fileDirectory=$(dirname $file)
    echo
    echo "[$fileDirectory] > npm run -s precommit"
    cd $fileDirectory
    if [ -f $nvmrc ]; then
        if [ $hasNvm == 0 ]
        then
            nvm use
        elif [ $hasFnm == 0 ]
        then
            fnm use
        fi
    fi

    npm run -s precommit || {
        echo
        echo "[$fileDirectory] > pre-commit hook failed (add --no-verify to bypass)"
        exitCode=1
    }
    cd -
done

if [ $exitCode == 1 ]
then
  exit 1
fi
# end ${fileHeader}`;
}

module.exports = {getPrecommitScript};