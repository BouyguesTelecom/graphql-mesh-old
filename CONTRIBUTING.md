# Welcome to

Thank you for investing time in contributing to this project!

## Project Architecture

```
├── packages/
|   ├── directive-headers/ directive for adding headers
|   ├── directive-no-auth/ directive for removing authorization header
|   ├── directive-spl/ directive for sort, filter and paginate
|   ├── graphql-mesh/ # superset of [graphql-mesh](https://github.com/ardatan/graphql-mesh) with patches and customs features
|   ├── inject-additionnal-transforms/
├── test/
|   ├── integration/ # Folder contains intégration tests and mocks for them
|   |   ├── mocks/ # Static files for testing api
|   |   ├── plugins/ # Custom plugin for integration tests
|   |   ├── mocks/ # Static files for testing api
|   |   ├── tests/ # tests cases
|   |   ├── tranforms/ # Custom transform for integration tests
```

## Getting started

After cloning the repo locally, initialize, build and start the services with:

```shell
npm install
```

## Usefull commands

* After adding yours saggers inside your [sources](./packages/graphql-mesh/sources/) folder you start the service with

```shell
npm run start
```

* Build docker image 🐳 for local test

```shell
cd packages/graphql-mesh && npm run build:local:image
```

* This project is using several packages like `directive-headers`, `directive-no-auth`, `directive-spl` and `inject-additional-transforms`.
To avoid publishing their packages in npm registry and using them inside `graphql-mesh` package, we pefer to pack them into [local-pkg](./packages/graphql-mesh/local-pkg/).
This approach is interesting because it avoids publishing these packages at each modification.

If modication made in their packages, you need to clean yours `node_modules`  and run `npm install` again.

```shell
npm run clean:modules && npm install
```

* Running integration tests locally

  * Start services

  ```shell
  cd test/integration && docker-compose up
  ```

  * Run tests

  ```shell
  cd test/integration && npm test
  ```
