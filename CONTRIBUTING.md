# Welcome to GraphQL Mesh

Thank you for investing time in contributing to this project!

## Project Architecture

```
├── packages/
|   ├── directive-spl/ # directive to sort, filter and paginate
|   ├── graphql-mesh/ # superset of [graphql-mesh](https://github.com/ardatan/graphql-mesh) with patches and customs features
|   ├── inject-additionnal-transforms/
├── test/
|   ├── integration/ # Folder containing integration tests and mocks used by them
|   |   ├── mocks/ # static files for testing api
|   |   ├── plugins/ # custom plugin for integration tests
|   |   ├── tests/ # tests cases
|   |   ├── tranforms/ # custom transform for integration tests
```

## Getting started

After cloning the repo locally, initialize, build and start the services with:

```shell
npm install
```

## Useful commands

* Once you've added your swagger files to your [sources](./packages/graphql-mesh/sources/) folder or your [config.yaml](./packages/graphql-mesh/config.yaml), you can start the service with:

```shell
npm run start
```

* Build the 🐳 Docker image for local test with:

```shell
cd packages/graphql-mesh && npm run build:local:image
```

* This project is using several packages like `directive-headers`, `directive-no-auth`, `directive-spl` and `inject-additional-transforms`.
To avoid publishing their packages in npm registry and using them inside `graphql-mesh` package, we pefer to pack them into [local-pkg](./packages/graphql-mesh/local-pkg/).
This approach is interesting because it avoids publishing these packages at each changes.

If any changes are made to these packages, you need to clean your `node_modules` and run `npm install` again with:

```shell
npm run clean:modules && npm install
```

* Run the integration tests locally:

  * Start the services:

  ```shell
  cd test/integration && docker-compose up
  ```

  * Run the tests:

  ```shell
  cd test/integration/tests && npm install && npm test
  ```
