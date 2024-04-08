export const directiveTypeDefs = /* GraphQL */ `
  """
  This is a very small, lightweight, straightforward and non-evaluated expression language to sort, filter and paginate arrays of maps.
  """
  directive @SPL(query: String) on FIELD

  """
  This directive is used to disable authentication for a specific operation.
  """
  directive @noAuth on FIELD

  type LinkItem {
    rel: String
    href: String
  }

  input Header {
    key: String
    value: String
  }

  """
  This directive is used to add headers to the request.
  """
  directive @headers(input: [Header]) on FIELD
`
