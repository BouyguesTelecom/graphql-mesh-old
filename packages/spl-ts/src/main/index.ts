import { OperandReader } from './OperandReader'
import { PropertyWalker } from './PropertyWalker'
import { SPLQueryToTreeConverter } from './antlr/SPLQueryToTreeConverter'
import { SPLLimitExtractor } from './limiter/SPLLimitExtractor'
import { PredicateOperation } from './predicate/PredicateOperation'
import { SPLPredicateFilter } from './predicate/SPLPredicateFilter'
import { SPLComparatorFactory } from './sorter/SPLComparatorFactory'
import { SPLListFilterer } from './sorter/SPLListFilterer'
import { StringOperations } from './predicate/StringOperations'
import { NumberOperations } from './predicate/NumberOperations'
import { BooleanOperations } from './predicate/BooleanOperations'
import { DateOperations } from './predicate/DateOperations'
import { StringListStringOperations } from './predicate/StringListStringOperations'
import { BooleanListBooleansOperations } from './predicate/BooleanListBooleansOperations'

const operations: PredicateOperation<any, any>[] = [
  new StringOperations(),
  new StringListStringOperations(),
  new NumberOperations(),
  new BooleanOperations(),
  new BooleanListBooleansOperations(),
  new DateOperations()
]

export const splListFilterer: SPLListFilterer = new SPLListFilterer(
  new SPLPredicateFilter(new OperandReader(new PropertyWalker()), operations),
  new SPLLimitExtractor(new OperandReader(new PropertyWalker())),
  new SPLComparatorFactory(new PropertyWalker()),
  new SPLQueryToTreeConverter()
)
