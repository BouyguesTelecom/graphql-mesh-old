![Docker Image Version](https://img.shields.io/docker/v/bouyguestelecom/graphql-mesh?style=for-the-badge)

<div align='center'>

# GraphQL Mesh gateway

**The Graph of Everything - Federated architecture for any API service - Dockerized**

**[🤿 Dive in!](#getting-started)**

</div>

---

This repo is a superset of [graphql-mesh](https://github.com/ardatan/graphql-mesh) with the following additional features:

- `✨` support for [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) links;
- `✨` support for advanced filtering with the [`@SPL`](./packages/directive-spl/README.md) directive;
- `✨` support adding addionnal headers with [`@headers`](./test/integration/tests/cases/directive-headers.test.ts) directive;
- `✨` support removing authorization hearders with [`@noAuth`](./test/integration/tests/cases/directive-no-auth.test.ts) directive;
- `✨` support filtering null values from request result by setting `filterNull` in config
- `🩺` more lenient parsing of swaggers;
- `🐛` a few bug fixes and added flexibility;

And is delivered as a single multi-platform 🐳 [Docker image](https://hub.docker.com/r/bouyguestelecom/graphql-mesh).

---

GraphQL Mesh allows you to use GraphQL query language to access data in remote APIs that don't run GraphQL (and also ones that do run GraphQL). It can be used as a gateway to other services or run as a local GraphQL schema that aggregates data from remote APIs.

The goal of GraphQL Mesh is to let developers easily access services that are written in other APIs specs (such as gRPC, OpenAPI/Swagger, OData, SOAP/WSDL, Apache Thrift, Mongoose, PostgreSQL, Neo4j, and also GraphQL) with GraphQL queries and mutations.

GraphQL Mesh gives the developer the ability to modify the output schemas, link types across schemas and merge schema types. You can even add custom GraphQL types and resolvers that fit your needs.

It allows developers to control the way they fetch data, and overcome issues related to backend implementation, legacy API services, chosen schema specification and non-typed APIs.

GraphQL Mesh is acting as a proxy to your data, and uses common libraries to wrap your existing API services. You can use this proxy locally in your service or application by running the GraphQL schema locally (with GraphQL `execute`), or you can deploy this as a gateway layer to your internal service.

## How does it work?

The way GraphQL Mesh works is:

1. Collect API schema specifications from services
2. Create a runtime instance of fully-typed SDK for the services.
3. Convert API specs to GraphQL schema
4. Applies custom schema transformations and schema extensions
5. Creates fully-typed, single schema, GraphQL SDK to fetch data from your services.

## Getting Started

1. Write a configuration file `config.yaml` like below:

```yaml
sources:
  - name: Products
    handler:
      openapi:
        source: http://api-products:8080/api-docs/products
        endpoint: http://api-products:8080
  - name: Suppliers
    handler:
      openapi:
        source: http://api-products:8080/api-docs/suppliers
        endpoint: http://api-products:8080

  - name: Authentication
    handler:
      openapi:
        source: http://api-products:8080/api-docs/authenticate
        endpoint: http://api-products:8080

additionalEnvelopPlugins: "./plugins"
additionalTransforms: [{ "./transforms/index.ts": {} }]
additionalTypeDefs: |
  """
  This directive is used to convert the result to uppercase.
  """
  directive @lower on FIELD
skipSSLValidation: true
filterNull: false
serve:
  hostname: 0.0.0.0
  port: 3000
  cors:
    origin: "*"
  playground: true
  playgroundTitle: Console GraphQL
```

2. Run the service:

```sh
$ docker run -it -p 4000:4000 \
  -v ./sources:/app/sources \
  -v ./transforms:/app/transforms \
  -v ./plugins:/app/plugins \
  -v ./config.yaml:/app/config.yaml \
  bouyguestelecom/graphql-mesh:0.1.0
```

Make sure that your api endpoint is up before running this command.

*See the [integrations](#integrations) section for more use cases, such as docker compose.*

## Integrations

### with `docker compose`

This example can be tested inside the [test/integration](./test/integration/) folder.

1. Prepare your `compose.yml`:

```yaml
services:
  api-products:
    image: shubhendumadhukar/camouflage
    ports:
      - 45537:8080
    volumes:
      - ../mocks/camouflage.yaml:/app/config.yml:ro
      - ../mocks:/app/mocks:ro

    healthcheck:
      test: wget --spider --tries=1 --no-verbose http://localhost:8080/products || exit 1
      interval: 10s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  graphql-mesh:
    depends_on:
      api-products:
        condition: service_healthy
    links:
      - api-products
    image: bouyguestelecom/graphql-mesh
    environment:
      - DEBUG=1
    ports:
      - 45538:3000
    volumes:
      - ./transforms:/app/transforms:ro
      - ./plugins:/app/plugins:ro
      - ./config.yaml:/app/config.yaml:ro
    restart: unless-stopped
```

2. Run it:
```sh
$ docker compose up
```

3. Access it: <http://localhost:45538/graphql>

## Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed
a bug for yourself, please consider submitting a PR!

### License

![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg?maxAge=2592000)

MIT
