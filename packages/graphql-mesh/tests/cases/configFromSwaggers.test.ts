import { describe, it, expect, beforeAll, vi } from 'vitest'
import ConfigFromSwaggers from '../../utils/configFromSwaggers'
import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { Spec, Catalog } from '../../types'

// Mock dependencies
vi.mock('glob', () => ({ globSync: vi.fn() }))
vi.mock('node:fs', () => ({ readFileSync: vi.fn() }))

describe('ConfigFromSwaggers tests', () => {
  let instance: ConfigFromSwaggers
  let mockSpecs: Spec[]
  let mockConfig: any

  beforeAll(() => {
    // Mock Swaggers
    mockSpecs = [
      {
        openapi: '3.0.0',
        info: {
          title: 'getOwnerOfVehicleById',
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
              type: 'object',
              properties: {
                id: {
                  type: 'integer'
                }
              }
            }
          }
        }
      },
      {
        openapi: '3.0.0',
        info: {
          title: 'getVehicles',
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
              discriminator: {
                propertyName: 'type',
                mapping: {
                  Vehicle: '#/components/schemas/Vehicle',
                  Car: '#/components/schemas/Car',
                  Bike: '#/components/schemas/Bike'
                }
              },
              properties: {
                id: {
                  type: 'integer'
                },
                type: {
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
    ]
    // Mock config
    mockConfig = {
      sources: [
        {
          name: 'getVehicles',
          handler: {
            openapi: {
              operationHeaders: {}
            }
          }
        },
        {
          name: 'getOwnerOfVehicleById',
          handler: {
            openapi: {
              operationHeaders: {}
            }
          }
        }
      ]
    }
    // Mock globSync
    vi.mocked(globSync).mockReturnValue([
      'mocks/getOwnerOfVehicleById.json',
      'mocks/getVehicles.json'
    ])
    // Mock readFileSync to return values of mockSpecs alternatively
    const readFileSyncMock = (path: string, options?: { encoding?: string | null; flag?: string } | BufferEncoding) => {
      let data;
      if (path === 'mocks/getOwnerOfVehicleById.json') {
        data = JSON.stringify(mockSpecs[0])
      } else if (path === 'mocks/getVehicles.json') {
        data = JSON.stringify(mockSpecs[1])
      }

      const encoding = typeof options === 'string' ? options : options?.encoding;
      if (encoding === 'buffer' || !encoding) {
        return Buffer.from(data ?? '');
      }
      return data;
    };
    vi.mocked(readFileSync).mockImplementation(readFileSyncMock);

    vi.resetModules()

    instance = new ConfigFromSwaggers()

    instance.config = mockConfig
  })

  // Specs tests
  it('should initialize swaggers and specs correctly', () => {
    expect(instance.swaggers).toEqual([
      'mocks/getOwnerOfVehicleById.json',
      'mocks/getVehicles.json'
    ])
    expect(instance.specs).toEqual(mockSpecs)
  })

  // Catalog test
  it('should build the catalog correctly', () => {
    const expectedCatalog: Catalog = {
      '/vehicle/{id}/owner': {
        operationIds: ['getOwnerOfVehicleById'],
        type: 'Person',
        swaggers: ['mocks/getOwnerOfVehicleById.json']
      },
      '/vehicles': {
        operationIds: ['getVehicles'],
        type: 'Vehicles',
        swaggers: ['mocks/getVehicles.json']
      }
    }
    expect(instance.catalog).toEqual(expectedCatalog)
  })

  // Test function to get available types
  it('should return all the available types', () => {
    const expectedTypes = ['Person', 'Vehicles']
    const expectedVersionedTypes = ['Person_v0', 'Vehicles_v0']
    expect(instance.getAvailableTypes(false)).toEqual(expectedTypes)
    expect(instance.getAvailableTypes(true)).toEqual(expectedVersionedTypes)
  })

  // Test function to get interfaces with their children
  it('should return interfaces with children correctly', () => {
    const expectedInterfacesWithChildren: Record<string, string[]> = {
      Vehicle: ['Car', 'Bike']
    }
    expect(instance.getInterfacesWithChildren()).toEqual(expectedInterfacesWithChildren)
  })

  // Test function to get OpenAPI sources
  it('should get OpenAPI sources correctly', () => {
    const expectedOpenApiSources = [
      {
        name: 'getOwnerOfVehicleById',
        handler: {
          openapi: {
            source: 'mocks/getOwnerOfVehicleById.json',
            endpoint: '{env.ENDPOINT}',
            ignoreErrorResponses: true,
            operationHeaders: {
              Authorization: `{context.headers["authorization"]}`
            }
          }
        },
        transforms: undefined
      },
      {
        name: 'getVehicles',
        handler: {
          openapi: {
            source: 'mocks/getVehicles.json',
            endpoint: '{env.ENDPOINT}',
            ignoreErrorResponses: true,
            operationHeaders: {
              Authorization: `{context.headers["authorization"]}`
            }
          }
        },
        transforms: undefined
      }
    ]
    expect(instance.getOpenApiSources()).toEqual(expectedOpenApiSources)
  })

  // Test function to get non-OpenAPI sources
  it('should get other sources correctly', () => {
    const expectedOtherSources = []
    expect(instance.getOtherSources()).toEqual(expectedOtherSources)
  })

  // Test function to get config from Swaggers
  it('should return the complete mesh config from swaggers', () => {
    const meshConfig = instance.getMeshConfigFromSwaggers()
    expect(meshConfig.defaultConfig).toEqual(mockConfig)
    expect(meshConfig.additionalTypeDefs).toContain('type LinkItem')
    expect(meshConfig.additionalResolvers).toBeDefined()
    expect(meshConfig.sources.length).toEqual(2)
  })
})
