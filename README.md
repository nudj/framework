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

### Release

1. Increment `package.json` version
1. Merge into `master`
1. Codefresh will publish to npm
