# framework

Nudj universal-express-redux-react app framework

## Installation

`npm i -S @nudj/framework`


## Options

- `reduxRoutes`: routing component for the redux app
- `reduxReducers`: redux reducers for page level interactions
- `expressRouters`: array of routers to add to the express app
- `expressAssetPath`: path to dynamically built files express needs to statically serve
- `dummyData`: data object to use in mock api (in json-server format)


## Examples

`reduxRoutes`
```
const reduxRoutes = {
  '/': require('./routes/companies/page'),
  '/people': require('./routes/people/page')
}
```

`reduxReducers`
```
const reduxReducers = {
  people: require('./routes/people/reducers')
}
```

`expressRouters`
```
const expressRouters = [
  require('./server/routers/app')
]
```

`expressAssetPath`
```
const path = require('path')
const expressAssetPath = path.join(__dirname, 'server/assets')
```

`dummyData`
```
const dummyData = {
  people: [
    {
      id: 1,
      name: 'Test person'
    }
  ]
}
```

## Usage

1. For the client:

  ```
  const client = require('@nudj/framework/client')

  client({
    reduxRoutes,
    reduxReducers
  })
  ```

2. For the server:

  ```
  const server = require('@nudj/framework/server')

  server({
    reduxRoutes,
    reduxReducers,
    expressRouters,
    expressAssetPath,
    dummyData
  })
  ```
