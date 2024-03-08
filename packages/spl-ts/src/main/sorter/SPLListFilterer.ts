import { SPLPredicateFilter } from '../predicate/SPLPredicateFilter'
import { SPLLimitExtractor } from '../limiter/SPLLimitExtractor'
import { SPLQueryToTreeConverter } from '../antlr/SPLQueryToTreeConverter'
import { SPLComparatorFactory } from './SPLComparatorFactory'
import { QueryContext } from '../antlr/SPLParser'
import { Limit } from '../limiter/Limit'

export class SPLListFilterer {
  private splPredicateFilter: SPLPredicateFilter
  private splLimitExtractor: SPLLimitExtractor
  private splComparatorFactory: SPLComparatorFactory
  private splQueryToTreeConverter: SPLQueryToTreeConverter

  constructor(
    splPredicateFilter: SPLPredicateFilter,
    splLimitExtractor: SPLLimitExtractor,
    splComparatorFactory: SPLComparatorFactory,
    splQueryToTreeConverter: SPLQueryToTreeConverter
  ) {
    this.splPredicateFilter = splPredicateFilter
    this.splLimitExtractor = splLimitExtractor
    this.splComparatorFactory = splComparatorFactory
    this.splQueryToTreeConverter = splQueryToTreeConverter
  }

  public filter(
    query: string,
    input: Map<string, Object>[],
    variables: Map<string, Object>
  ): Map<string, Object>[] {
    const queryContext: QueryContext = this.splQueryToTreeConverter.createTree(query)
    const limitObj: Limit = this.splLimitExtractor.fetchLimit(queryContext, variables)

    return input
      .filter((stringObjMap) =>
        this.splPredicateFilter.filter(queryContext, stringObjMap, variables)
      )
      .slice(limitObj.offset, limitObj.offset + limitObj.limit)
      .sort(this.splComparatorFactory.createComparator(queryContext))
  }

  public filter_no_variables(query: string, input: Map<string, Object>[]) {
    return this.filter(query, input, new Map())
  }

  public formatInput(input: any): Map<string, Object>[] {
    const parsedJsonInput = JSON.parse(JSON.stringify(input))

    const inputMap: Map<string, Object>[] = []

    parsedJsonInput.forEach((item: Map<string, Object>) => {
      const newItem: Map<string, Object> = new Map()

      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'object') {
          newItem.set(key, new Map(Object.entries(value)))
        } else {
          newItem.set(key, value)
        }
      })

      inputMap.push(newItem)
    })
    return inputMap
  }

  public formatOutput(output: Map<string, Object>[]): any[] {
    const reversedInput: any[] = []

    output.forEach((item: Map<string, Object>) => {
      const newItem: any = {}

      item.forEach((value, key) => {
        if (value instanceof Map) {
          newItem[key] = Object.fromEntries(value)
        } else {
          newItem[key] = value
        }
      })

      reversedInput.push(newItem)
    })
    return reversedInput
  }
}
