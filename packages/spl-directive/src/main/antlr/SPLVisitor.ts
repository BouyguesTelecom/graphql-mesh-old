// Generated from src/main/antlr/SPL.g4 by ANTLR 4.9.0-SNAPSHOT

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor'

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SPLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface SPLVisitor<Result> extends ParseTreeVisitor<Result> {
  /**
   * Visit a parse tree produced by `SPLParser.query`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitQuery?: (ctx: QueryContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.predicate_member`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPredicate_member?: (ctx: Predicate_memberContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.predicate`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPredicate?: (ctx: PredicateContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.sorter`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSorter?: (ctx: SorterContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.limiter`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLimiter?: (ctx: LimiterContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.start_page`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStart_page?: (ctx: Start_pageContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.number_per_page`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumber_per_page?: (ctx: Number_per_pageContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.sort_rule`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSort_rule?: (ctx: Sort_ruleContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.order`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitOrder?: (ctx: OrderContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.operand`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitOperand?: (ctx: OperandContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.comparator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitComparator?: (ctx: ComparatorContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.operator`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitOperator?: (ctx: OperatorContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.operation`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitOperation?: (ctx: OperationContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.prioOperation`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPrioOperation?: (ctx: PrioOperationContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.fieldName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFieldName?: (ctx: FieldNameContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.function_evaluation`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFunction_evaluation?: (ctx: Function_evaluationContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.identifier`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitIdentifier?: (ctx: IdentifierContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.value`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitValue?: (ctx: ValueContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.list`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitList?: (ctx: ListContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.integerValue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitIntegerValue?: (ctx: IntegerValueContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.variable`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVariable?: (ctx: VariableContext) => Result

  /**
   * Visit a parse tree produced by `SPLParser.primitiveValue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPrimitiveValue?: (ctx: PrimitiveValueContext) => Result
}
