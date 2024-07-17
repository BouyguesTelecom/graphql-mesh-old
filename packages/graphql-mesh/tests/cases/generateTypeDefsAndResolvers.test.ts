import { describe, it, expect } from 'vitest'
import { generateTypeDefsAndResolversFromSwagger } from '../../utils/generateTypeDefsAndResolvers'
import { Spec, ConfigExtension, Catalog } from '../../types'

/**
 * ---------- MOCKS ----------
 */

const mockSwaggerWithPrefix: Spec = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '0.0.1'
  },
  paths: {
    '/vehicle/{id}/owner': {
      get: {
        operationId: 'getOwnerOfVehicleById',
        summary: 'Get the owner of a specific vehicle.',
        responses: {
          '200': {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Person'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Person: {
        // @ts-ignore
        'x-graphql-prefix-schema-with': 'Owner',
        type: 'object',
        properties: {
          id: {
            type: 'integer'
          }
        }
      }
    }
  }
}
const mockSwaggerWithHATEOASLinks: Spec = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '0.0.1'
  },
  paths: {
    '/vehicles': {
      get: {
        operationId: 'getVehicles',
        summary: 'Get all vehicles.',
        responses: {
          '200': {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Vehicles'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Vehicles: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Vehicle'
            }
          }
        }
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: {
            type: 'integer'
          },
          _links: {
            $ref: '#/components/schemas/VehicleLinks'
          }
        }
      },
      VehicleLinks: {
        type: 'object',
        properties: {
          owner: {
            $ref: '#/components/schemas/XLink'
          }
        },
        // @ts-ignore
        'x-links': [
          {
            rel: 'owner',
            type: 'application/json',
            hrefPattern: '/vehicle/{id}/owner'
          }
        ]
      },
      XLink: {
        type: 'object',
        properties: {
          type: {
            type: 'string'
          },
          href: {
            type: 'string'
          }
        }
      },
      Car: {
        allOf: [
          {
            $ref: '#/components/schemas/Vehicle'
          },
          {
            type: 'object',
            properties: {
              fuelType: {
                type: 'string'
              }
            }
          }
        ]
      },
      Bike: {
        allOf: [
          {
            $ref: '#/components/schemas/Vehicle'
          },
          {
            type: 'object',
            properties: {
              bikeType: {
                type: 'string'
              }
            }
          }
        ]
      }
    }
  }
}
const mockSwaggerWithHATEOASLinksAndVersionedTypes: Spec = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '5.0.0'
  },
  paths: {
    '/vehicles': {
      get: {
        operationId: 'getVehicles',
        summary: 'Get all vehicles.',
        responses: {
          '200': {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Vehicles_v5'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Vehicles_v5: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Vehicle_v5'
            }
          }
        }
      },
      Vehicle_v5: {
        type: 'object',
        properties: {
          id: {
            type: 'integer'
          },
          _links: {
            $ref: '#/components/schemas/VehicleLinks_v5'
          }
        }
      },
      VehicleLinks_v5: {
        type: 'object',
        properties: {
          owner: {
            $ref: '#/components/schemas/XLink_v5'
          }
        },
        // @ts-ignore
        'x-links': [
          {
            rel: 'owner',
            type: 'application/json',
            hrefPattern: '/vehicle/{id}/owner'
          }
        ]
      },
      XLink_v5: {
        type: 'object',
        properties: {
          type: {
            type: 'string'
          },
          href: {
            type: 'string'
          }
        }
      }
    }
  }
}
const mockAvailableTypes = ['Vehicles', 'Vehicle', 'VehicleLinks', 'Car', 'Bike', 'Person']
const mockAvailableTypesWithVersions = [
  'Vehicles_v5',
  'Vehicle_v5',
  'VehicleLinks_v5',
  'Person_v3',
  'Person_v2',
  'Person_v1'
]
const mockInterfacesWithChildren = { Vehicle: ['Car', 'Bike'] }
const mockCatalog: Catalog = {
  '/vehicle/{id}/owner': {
    operationIds: ['checkOwner'],
    type: 'Person',
    swaggers: ['checkOwner.json']
  }
}

/**
 * ---------- TESTS ----------
 */

// Empty Swagger
describe('Empty Swagger test', () => {
  it('should return empty typeDefs and empty resolvers', () => {
    const result: ConfigExtension = generateTypeDefsAndResolversFromSwagger(
      {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '0.0.1'
        },
        paths: {}
      },
      mockAvailableTypes,
      mockInterfacesWithChildren,
      mockCatalog,
      {}
    )

    // typeDefs
    expect(result.typeDefs).toStrictEqual('')
    // resolvers
    expect(result.resolvers).toStrictEqual({})
  })
})

// Schema prefixing
describe('Schema prefixing test', () => {
  it('should return the correct typeDefs and resolvers', () => {
    const result: ConfigExtension = generateTypeDefsAndResolversFromSwagger(
      mockSwaggerWithPrefix,
      mockAvailableTypes,
      mockInterfacesWithChildren,
      mockCatalog,
      {}
    )

    // typeDefs
    expect(result).toHaveProperty('typeDefs')
    expect(result.typeDefs).toBe(
      /**
       *   extend type Person @prefixSchema(prefix: "Owner") {
       *      dummy: String
       *   }
       */
      'extend type Person @prefixSchema(prefix: "Owner") { dummy: String }\n'
    )
    // resolvers
    expect(result.resolvers).toStrictEqual({})
  })
})

// Simple HATEOAS link generation
describe('Simple HATEOAS link generation test', () => {
  it('should return the correct typeDefs and resolvers', () => {
    const result: ConfigExtension = generateTypeDefsAndResolversFromSwagger(
      mockSwaggerWithHATEOASLinks,
      mockAvailableTypes,
      {},
      mockCatalog,
      {}
    )

    // typeDefs
    expect(result).toHaveProperty('typeDefs')
    expect(result.typeDefs).toBe(
      /**
       *   extend type Vehicle {
       *      owner: Person
       *      _linksList: [LinkItem]
       *   }
       */
      'extend type Vehicle {\nowner: Person\n_linksList: [LinkItem]\n}\n'
    )
    // resolvers
    expect(result).toHaveProperty('resolvers')
    expect(result.resolvers).toHaveProperty('Vehicle')
    expect(result.resolvers['Vehicle']).toHaveProperty('owner')
    expect(result.resolvers['Vehicle']).toHaveProperty('_linksList')
  })
})

// HATEOAS link generation with interfaces
describe('HATEOAS link generation with interfaces test', () => {
  it('should return the correct typeDefs and resolvers', () => {
    const result: ConfigExtension = generateTypeDefsAndResolversFromSwagger(
      mockSwaggerWithHATEOASLinks,
      mockAvailableTypes,
      mockInterfacesWithChildren,
      mockCatalog,
      {}
    )

    // typeDefs
    expect(result).toHaveProperty('typeDefs')
    expect(result.typeDefs).toBe(
      /**
       *   extend interface Vehicle {
       *      owner: Person
       *      _linksList: [LinkItem]
       *   }
       *   extend type Car {
       *      owner: Person
       *      _linksList: [LinkItem]
       *   }
       *   extend type Bike {
       *      owner: Person
       *      _linksList: [LinkItem]
       *   }
       */
      'extend interface Vehicle {\nowner: Person\n_linksList: [LinkItem]\n}\nextend type Car {\nowner: Person\n_linksList: [LinkItem]\n}\nextend type Bike {\nowner: Person\n_linksList: [LinkItem]\n}\n'
    )
    // resolvers
    expect(result).toHaveProperty('resolvers')
    expect(result.resolvers).toHaveProperty('Vehicle')
    expect(result.resolvers['Vehicle']).toHaveProperty('owner')
    expect(result.resolvers['Vehicle']).toHaveProperty('_linksList')
    expect(result.resolvers['Vehicle']).toHaveProperty('__resolveType')
    expect(result.resolvers).toHaveProperty('Car')
    expect(result.resolvers['Car']).toHaveProperty('owner')
    expect(result.resolvers['Car']).toHaveProperty('_linksList')
    expect(result.resolvers).toHaveProperty('Bike')
    expect(result.resolvers['Bike']).toHaveProperty('owner')
    expect(result.resolvers['Bike']).toHaveProperty('_linksList')
  })
})

// HATEOAS link generation with versions
describe('HATEOAS link generation with versions test', () => {
  it('should return the correct typeDefs and resolvers', () => {
    const result: ConfigExtension = generateTypeDefsAndResolversFromSwagger(
      mockSwaggerWithHATEOASLinksAndVersionedTypes,
      mockAvailableTypesWithVersions,
      {},
      mockCatalog,
      {}
    )

    // typeDefs
    expect(result).toHaveProperty('typeDefs')
    expect(result.typeDefs).toBe(
      /**
       *   extend type Vehicle_v5 {
       *      owner_v3: Person_v3
       *      owner_v2: Person_v2
       *      owner_v1: Person_v1
       *      _linksList: [LinkItem]
       *   }
       */
      'extend type Vehicle_v5 {\nowner_v3: Person_v3\nowner_v2: Person_v2\nowner_v1: Person_v1\n_linksList: [LinkItem]\n}\n'
    )
    // resolvers
    expect(result).toHaveProperty('resolvers')
    expect(result.resolvers).toHaveProperty('Vehicle_v5')
    expect(result.resolvers['Vehicle_v5']).toHaveProperty('owner_v3')
    expect(result.resolvers['Vehicle_v5']).toHaveProperty('owner_v2')
    expect(result.resolvers['Vehicle_v5']).toHaveProperty('owner_v1')
    expect(result.resolvers['Vehicle_v5']).toHaveProperty('_linksList')
  })
})
