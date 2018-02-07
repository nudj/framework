# framework

Nudj universal-express-redux-react app framework

## Contributing

### Dependencies

1. Docker
1. Make

### Development

1. `make build` to build the test image
1. `make test` to run the tests one time
1. `make tdd` to run the tdd watcher

### Publishing new versions

1. Pull latest from `origin/develop`
2. Increment `package.json` version
3. Commit the change with the commit message `Set [x.x.x]`
4. Push change onto `origin/develop`
5. Checkout to latest master
6. Merge latest develop into master using `git merge origin/develop --no-ff`, with the commit message of `Release [x.x.x]`
7. Push change onto `origin/master`
8. Tag the version using `git tag [x.x.x]`
9. Push the tag: `git push origin --tags`
10. Copy the release notes: `git --no-pager log [PREVIOUS_VERSION_TAG]..[NEW_VERSION_TAG] --pretty=format:'- %s %H ' --reverse --no-merges | pbcopy`
11. Put the release notes on the [relevant release on GitHub](https://github.com/nudj/framework/releases)
