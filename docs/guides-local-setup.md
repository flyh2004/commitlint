# Guide: Local setup

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

This guide demonstrates how to achieve this via git hooks.

## Install commitlint

Install `commitlint` and a `commitlint-config-*` of your choice as devDependency and
configure `commitlint` to use it.

```bash
# Create a package.json if needed
npm init

# Install and configure if needed
npm install --save-dev @commitlint/{cli,config-angular}
echo "module.exports = {extends: ['@commitlint/config-angular']};" > commitlint.config.js
```

Alternatively the configuration can be defined in `.commitlintrc.js`, `.commitlintrc.json`, or `.commitlintrc.yml` file or a `commitlint` field in `package.json`.

## Install husky

Install `husky` as devDependency, a handy git hook helper available on npm.

```bash
npm install --save-dev husky
```

This allows us to add [git hooks](https://github.com/typicode/husky/blob/master/HOOKS.md#hooks) directly into our `package.json` scripts.

```json
{
  "scripts": {
    "commitmsg": "commitlint -e $GIT_PARAMS"
  }
}
```

Using `commitmsg` gives us exactly what we want: It is executed everytime a new commit is created. Passimg husky's `$GIT_PARAMS` to `commitlint` via the `-e|--edit` flag directs it to the relevant edit file. `-e` defaults to `.git/COMMIT_EDITMSG`.

## Test

You can test the hook by simple commiting. You should see something like this if everything works.

```bash
git commit -m "foo: this will fail"
husky > npm run -s commitmsg

⧗   input: foo: this will fail
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]
✖   found 1 problems, 0 warnings

husky > commit-msg hook failed (add --no-verify to bypass)

git commit -m "chore: lint on commitmsg"
husky > npm run -s commitmsg

⧗   input: chore: lint on commitmsg
✔   found 0 problems, 0 warnings
```

?> Local linting is fine for fast feedback but can easily be tinkered with. To ensure all commits are linted you'll want to check commits on an automated CI Server to. Learn how to in the [CI Setup guide](guides-ci-setup.md).
