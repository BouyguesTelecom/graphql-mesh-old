// Generated from src/main/antlr/SPL.g4 by ANTLR 4.9.0-SNAPSHOT

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener'

import { QueryContext } from './SPLParser'
import { Predicate_memberContext } from './SPLParser'
import { PredicateContext } from './SPLParser'
import { SorterContext } from './SPLParser'
import { LimiterContext } from './SPLParser'
import { Start_pageContext } from './SPLParser'
import { Number_per_pageContext } from './SPLParser'
import { Sort_ruleContext } from './SPLParser'
import { OrderContext } from './SPLParser'
import { OperandContext } from './SPLParser'
import { ComparatorContext } from './SPLParser'
import { OperatorContext } from './SPLParser'
import { OperationContext } from './SPLParser'
import { PrioOperationContext } from './SPLParser'
import { FieldNameContext } from './SPLParser'
import { Function_evaluationContext } from './SPLParser'
import { IdentifierContext } from './SPLParser'
import { ValueContext } from './SPLParser'
import { ListContext } from './SPLParser'
import { IntegerValueContext } from './SPLParser'
import { VariableContext } from './SPLParser'
import { PrimitiveValueContext } from './SPLParser'

/**
 * This interface defines a complete listener for a parse tree produced by
 * `SPLParser`.
 */
export interface SPLListener extends ParseTreeListener {
  /**
   * Enter a parse tree produced by `SPLParser.query`.
   * @param ctx the parse tree
   */
  enterQuery?: (ctx: QueryContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.query`.
   * @param ctx the parse tree
   */
  exitQuery?: (ctx: QueryContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.predicate_member`.
   * @param ctx the parse tree
   */
  enterPredicate_member?: (ctx: Predicate_memberContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.predicate_member`.
   * @param ctx the parse tree
   */
  exitPredicate_member?: (ctx: Predicate_memberContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.predicate`.
   * @param ctx the parse tree
   */
  enterPredicate?: (ctx: PredicateContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.predicate`.
   * @param ctx the parse tree
   */
  exitPredicate?: (ctx: PredicateContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.sorter`.
   * @param ctx the parse tree
   */
  enterSorter?: (ctx: SorterContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.sorter`.
   * @param ctx the parse tree
   */
  exitSorter?: (ctx: SorterContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.limiter`.
   * @param ctx the parse tree
   */
  enterLimiter?: (ctx: LimiterContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.limiter`.
   * @param ctx the parse tree
   */
  exitLimiter?: (ctx: LimiterContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.start_page`.
   * @param ctx the parse tree
   */
  enterStart_page?: (ctx: Start_pageContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.start_page`.
   * @param ctx the parse tree
   */
  exitStart_page?: (ctx: Start_pageContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.number_per_page`.
   * @param ctx the parse tree
   */
  enterNumber_per_page?: (ctx: Number_per_pageContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.number_per_page`.
   * @param ctx the parse tree
   */
  exitNumber_per_page?: (ctx: Number_per_pageContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.sort_rule`.
   * @param ctx the parse tree
   */
  enterSort_rule?: (ctx: Sort_ruleContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.sort_rule`.
   * @param ctx the parse tree
   */
  exitSort_rule?: (ctx: Sort_ruleContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.order`.
   * @param ctx the parse tree
   */
  enterOrder?: (ctx: OrderContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.order`.
   * @param ctx the parse tree
   */
  exitOrder?: (ctx: OrderContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.operand`.
   * @param ctx the parse tree
   */
  enterOperand?: (ctx: OperandContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.operand`.
   * @param ctx the parse tree
   */
  exitOperand?: (ctx: OperandContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.comparator`.
   * @param ctx the parse tree
   */
  enterComparator?: (ctx: ComparatorContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.comparator`.
   * @param ctx the parse tree
   */
  exitComparator?: (ctx: ComparatorContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.operator`.
   * @param ctx the parse tree
   */
  enterOperator?: (ctx: OperatorContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.operator`.
   * @param ctx the parse tree
   */
  exitOperator?: (ctx: OperatorContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.operation`.
   * @param ctx the parse tree
   */
  enterOperation?: (ctx: OperationContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.operation`.
   * @param ctx the parse tree
   */
  exitOperation?: (ctx: OperationContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.prioOperation`.
   * @param ctx the parse tree
   */
  enterPrioOperation?: (ctx: PrioOperationContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.prioOperation`.
   * @param ctx the parse tree
   */
  exitPrioOperation?: (ctx: PrioOperationContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.fieldName`.
   * @param ctx the parse tree
   */
  enterFieldName?: (ctx: FieldNameContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.fieldName`.
   * @param ctx the parse tree
   */
  exitFieldName?: (ctx: FieldNameContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.function_evaluation`.
   * @param ctx the parse tree
   */
  enterFunction_evaluation?: (ctx: Function_evaluationContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.function_evaluation`.
   * @param ctx the parse tree
   */
  exitFunction_evaluation?: (ctx: Function_evaluationContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.identifier`.
   * @param ctx the parse tree
   */
  enterIdentifier?: (ctx: IdentifierContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.identifier`.
   * @param ctx the parse tree
   */
  exitIdentifier?: (ctx: IdentifierContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.value`.
   * @param ctx the parse tree
   */
  enterValue?: (ctx: ValueContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.value`.
   * @param ctx the parse tree
   */
  exitValue?: (ctx: ValueContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.list`.
   * @param ctx the parse tree
   */
  enterList?: (ctx: ListContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.list`.
   * @param ctx the parse tree
   */
  exitList?: (ctx: ListContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.integerValue`.
   * @param ctx the parse tree
   */
  enterIntegerValue?: (ctx: IntegerValueContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.integerValue`.
   * @param ctx the parse tree
   */
  exitIntegerValue?: (ctx: IntegerValueContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.variable`.
   * @param ctx the parse tree
   */
  enterVariable?: (ctx: VariableContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.variable`.
   * @param ctx the parse tree
   */
  exitVariable?: (ctx: VariableContext) => void

  /**
   * Enter a parse tree produced by `SPLParser.primitiveValue`.
   * @param ctx the parse tree
   */
  enterPrimitiveValue?: (ctx: PrimitiveValueContext) => void
  /**
   * Exit a parse tree produced by `SPLParser.primitiveValue`.
   * @param ctx the parse tree
   */
  exitPrimitiveValue?: (ctx: PrimitiveValueContext) => void
}
