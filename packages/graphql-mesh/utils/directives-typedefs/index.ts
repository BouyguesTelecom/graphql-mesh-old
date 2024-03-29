export const directiveTypeDefs = /* GraphQL */ `
  directive @SPL(query: String) on FIELD

  directive @noAuth on FIELD

  directive @upper on FIELD

  type LinkItem {
    rel: String
    href: String
  }

  input Header {
    key: String
    value: String
  }

  directive @headers(input: [Header]) on FIELD
`
