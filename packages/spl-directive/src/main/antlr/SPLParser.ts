// Generated from src/main/antlr/SPL.g4 by ANTLR 4.9.0-SNAPSHOT

import { ATN } from 'antlr4ts/atn/ATN'
import { ATNDeserializer } from 'antlr4ts/atn/ATNDeserializer'
import { FailedPredicateException } from 'antlr4ts/FailedPredicateException'
import { NotNull } from 'antlr4ts/Decorators'
import { NoViableAltException } from 'antlr4ts/NoViableAltException'
import { Override } from 'antlr4ts/Decorators'
import { Parser } from 'antlr4ts/Parser'
import { ParserRuleContext } from 'antlr4ts/ParserRuleContext'
import { ParserATNSimulator } from 'antlr4ts/atn/ParserATNSimulator'
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener'
import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor'
import { RecognitionException } from 'antlr4ts/RecognitionException'
import { RuleContext } from 'antlr4ts/RuleContext'
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from 'antlr4ts/tree/TerminalNode'
import { Token } from 'antlr4ts/Token'
import { TokenStream } from 'antlr4ts/TokenStream'
import { Vocabulary } from 'antlr4ts/Vocabulary'
import { VocabularyImpl } from 'antlr4ts/VocabularyImpl'

import * as Utils from 'antlr4ts/misc/Utils'

import { SPLListener } from './SPLListener'
import { SPLVisitor } from './SPLVisitor'

export class SPLParser extends Parser {
  public static readonly T__0 = 1
  public static readonly T__1 = 2
  public static readonly T__2 = 3
  public static readonly T__3 = 4
  public static readonly T__4 = 5
  public static readonly T__5 = 6
  public static readonly T__6 = 7
  public static readonly T__7 = 8
  public static readonly T__8 = 9
  public static readonly T__9 = 10
  public static readonly T__10 = 11
  public static readonly T__11 = 12
  public static readonly ORDER = 13
  public static readonly OPERATOR = 14
  public static readonly PRIO_OPERATION = 15
  public static readonly OPERATION = 16
  public static readonly XOR_OPERATOR = 17
  public static readonly OR_OPERATOR = 18
  public static readonly AND_OPERATOR = 19
  public static readonly COMPARATOR = 20
  public static readonly STRING = 21
  public static readonly SINGLE_STRING = 22
  public static readonly DOUBLE_STRING = 23
  public static readonly BOOL = 24
  public static readonly NULL = 25
  public static readonly FUNCTION_NAME = 26
  public static readonly IDENTIFIER = 27
  public static readonly DATE = 28
  public static readonly INTEGER = 29
  public static readonly FLOAT = 30
  public static readonly WS = 31
  public static readonly COMMENT = 32
  public static readonly RULE_query = 0
  public static readonly RULE_predicate_member = 1
  public static readonly RULE_predicate = 2
  public static readonly RULE_sorter = 3
  public static readonly RULE_limiter = 4
  public static readonly RULE_start_page = 5
  public static readonly RULE_number_per_page = 6
  public static readonly RULE_sort_rule = 7
  public static readonly RULE_order = 8
  public static readonly RULE_operand = 9
  public static readonly RULE_comparator = 10
  public static readonly RULE_operator = 11
  public static readonly RULE_operation = 12
  public static readonly RULE_prioOperation = 13
  public static readonly RULE_fieldName = 14
  public static readonly RULE_function_evaluation = 15
  public static readonly RULE_identifier = 16
  public static readonly RULE_value = 17
  public static readonly RULE_list = 18
  public static readonly RULE_integerValue = 19
  public static readonly RULE_variable = 20
  public static readonly RULE_primitiveValue = 21
  // tslint:disable:no-trailing-whitespace
  public static readonly ruleNames: string[] = [
    'query',
    'predicate_member',
    'predicate',
    'sorter',
    'limiter',
    'start_page',
    'number_per_page',
    'sort_rule',
    'order',
    'operand',
    'comparator',
    'operator',
    'operation',
    'prioOperation',
    'fieldName',
    'function_evaluation',
    'identifier',
    'value',
    'list',
    'integerValue',
    'variable',
    'primitiveValue'
  ]

  private static readonly _LITERAL_NAMES: Array<string | undefined> = [
    undefined,
    "'('",
    "')'",
    "'SORT'",
    "'ORDER'",
    "'BY'",
    "','",
    "'LIMIT'",
    "'.'",
    "'?'",
    "'['",
    "']'",
    "':'",
    undefined,
    undefined,
    undefined,
    undefined,
    "'XOR'",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "'null'"
  ]
  private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    'ORDER',
    'OPERATOR',
    'PRIO_OPERATION',
    'OPERATION',
    'XOR_OPERATOR',
    'OR_OPERATOR',
    'AND_OPERATOR',
    'COMPARATOR',
    'STRING',
    'SINGLE_STRING',
    'DOUBLE_STRING',
    'BOOL',
    'NULL',
    'FUNCTION_NAME',
    'IDENTIFIER',
    'DATE',
    'INTEGER',
    'FLOAT',
    'WS',
    'COMMENT'
  ]
  public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(
    SPLParser._LITERAL_NAMES,
    SPLParser._SYMBOLIC_NAMES,
    []
  )

  // @Override
  // @NotNull
  public get vocabulary(): Vocabulary {
    return SPLParser.VOCABULARY
  }
  // tslint:enable:no-trailing-whitespace

  // @Override
  public get grammarFileName(): string {
    return 'SPL.g4'
  }

  // @Override
  public get ruleNames(): string[] {
    return SPLParser.ruleNames
  }

  // @Override
  public get serializedATN(): string {
    return SPLParser._serializedATN
  }

  protected createFailedPredicateException(
    predicate?: string,
    message?: string
  ): FailedPredicateException {
    return new FailedPredicateException(this, predicate, message)
  }

  constructor(input: TokenStream) {
    super(input)
    this._interp = new ParserATNSimulator(SPLParser._ATN, this)
  }
  // @RuleVersion(0)
  public query(): QueryContext {
    let _localctx: QueryContext = new QueryContext(this._ctx, this.state)
    this.enterRule(_localctx, 0, SPLParser.RULE_query)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 45
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        if (
          (_la & ~0x1f) === 0 &&
          ((1 << _la) &
            ((1 << SPLParser.T__0) |
              (1 << SPLParser.T__9) |
              (1 << SPLParser.T__11) |
              (1 << SPLParser.STRING) |
              (1 << SPLParser.BOOL) |
              (1 << SPLParser.NULL) |
              (1 << SPLParser.FUNCTION_NAME) |
              (1 << SPLParser.IDENTIFIER) |
              (1 << SPLParser.DATE) |
              (1 << SPLParser.INTEGER) |
              (1 << SPLParser.FLOAT))) !==
            0
        ) {
          {
            this.state = 44
            this.predicate(0)
          }
        }

        this.state = 48
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        if (_la === SPLParser.T__2 || _la === SPLParser.T__3) {
          {
            this.state = 47
            this.sorter()
          }
        }

        this.state = 51
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        if (_la === SPLParser.T__6) {
          {
            this.state = 50
            this.limiter()
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public predicate_member(): Predicate_memberContext {
    let _localctx: Predicate_memberContext = new Predicate_memberContext(this._ctx, this.state)
    this.enterRule(_localctx, 2, SPLParser.RULE_predicate_member)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 53
        this.operand(0)
        this.state = 54
        this.comparator()
        this.state = 55
        this.operand(0)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }

  public predicate(): PredicateContext
  public predicate(_p: number): PredicateContext
  // @RuleVersion(0)
  public predicate(_p?: number): PredicateContext {
    if (_p === undefined) {
      _p = 0
    }

    let _parentctx: ParserRuleContext = this._ctx
    let _parentState: number = this.state
    let _localctx: PredicateContext = new PredicateContext(this._ctx, _parentState)
    let _prevctx: PredicateContext = _localctx
    let _startState: number = 4
    this.enterRecursionRule(_localctx, 4, SPLParser.RULE_predicate, _p)
    try {
      let _alt: number
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 63
        this._errHandler.sync(this)
        switch (this.interpreter.adaptivePredict(this._input, 3, this._ctx)) {
          case 1:
            {
              this.state = 58
              this.predicate_member()
            }
            break

          case 2:
            {
              this.state = 59
              this.match(SPLParser.T__0)
              this.state = 60
              _localctx._subPredicate = this.predicate(0)
              this.state = 61
              this.match(SPLParser.T__1)
            }
            break
        }
        this._ctx._stop = this._input.tryLT(-1)
        this.state = 71
        this._errHandler.sync(this)
        _alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx)
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent()
            }
            _prevctx = _localctx
            {
              {
                _localctx = new PredicateContext(_parentctx, _parentState)
                this.pushNewRecursionContext(_localctx, _startState, SPLParser.RULE_predicate)
                this.state = 65
                if (!this.precpred(this._ctx, 3)) {
                  throw this.createFailedPredicateException('this.precpred(this._ctx, 3)')
                }
                this.state = 66
                this.operator()
                this.state = 67
                this.predicate(4)
              }
            }
          }
          this.state = 73
          this._errHandler.sync(this)
          _alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx)
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.unrollRecursionContexts(_parentctx)
    }
    return _localctx
  }
  // @RuleVersion(0)
  public sorter(): SorterContext {
    let _localctx: SorterContext = new SorterContext(this._ctx, this.state)
    this.enterRule(_localctx, 6, SPLParser.RULE_sorter)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 74
        _la = this._input.LA(1)
        if (!(_la === SPLParser.T__2 || _la === SPLParser.T__3)) {
          this._errHandler.recoverInline(this)
        } else {
          if (this._input.LA(1) === Token.EOF) {
            this.matchedEOF = true
          }

          this._errHandler.reportMatch(this)
          this.consume()
        }
        this.state = 75
        this.match(SPLParser.T__4)
        this.state = 76
        this.sort_rule()
        this.state = 81
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        while (_la === SPLParser.T__5) {
          {
            {
              this.state = 77
              this.match(SPLParser.T__5)
              this.state = 78
              this.sort_rule()
            }
          }
          this.state = 83
          this._errHandler.sync(this)
          _la = this._input.LA(1)
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public limiter(): LimiterContext {
    let _localctx: LimiterContext = new LimiterContext(this._ctx, this.state)
    this.enterRule(_localctx, 8, SPLParser.RULE_limiter)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 84
        this.match(SPLParser.T__6)
        this.state = 85
        this.operand(0)
        this.state = 88
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        if (_la === SPLParser.T__5) {
          {
            this.state = 86
            this.match(SPLParser.T__5)
            this.state = 87
            this.operand(0)
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public start_page(): Start_pageContext {
    let _localctx: Start_pageContext = new Start_pageContext(this._ctx, this.state)
    this.enterRule(_localctx, 10, SPLParser.RULE_start_page)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 90
        this.match(SPLParser.INTEGER)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public number_per_page(): Number_per_pageContext {
    let _localctx: Number_per_pageContext = new Number_per_pageContext(this._ctx, this.state)
    this.enterRule(_localctx, 12, SPLParser.RULE_number_per_page)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 92
        this.match(SPLParser.INTEGER)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public sort_rule(): Sort_ruleContext {
    let _localctx: Sort_ruleContext = new Sort_ruleContext(this._ctx, this.state)
    this.enterRule(_localctx, 14, SPLParser.RULE_sort_rule)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 94
        this.operand(0)
        this.state = 96
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        if (_la === SPLParser.ORDER) {
          {
            this.state = 95
            this.order()
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public order(): OrderContext {
    let _localctx: OrderContext = new OrderContext(this._ctx, this.state)
    this.enterRule(_localctx, 16, SPLParser.RULE_order)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 98
        this.match(SPLParser.ORDER)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }

  public operand(): OperandContext
  public operand(_p: number): OperandContext
  // @RuleVersion(0)
  public operand(_p?: number): OperandContext {
    if (_p === undefined) {
      _p = 0
    }

    let _parentctx: ParserRuleContext = this._ctx
    let _parentState: number = this.state
    let _localctx: OperandContext = new OperandContext(this._ctx, _parentState)
    let _prevctx: OperandContext = _localctx
    let _startState: number = 18
    this.enterRecursionRule(_localctx, 18, SPLParser.RULE_operand, _p)
    try {
      let _alt: number
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 109
        this._errHandler.sync(this)
        switch (this._input.LA(1)) {
          case SPLParser.T__11:
            {
              this.state = 101
              this.variable()
            }
            break
          case SPLParser.IDENTIFIER:
            {
              this.state = 102
              this.fieldName()
            }
            break
          case SPLParser.FUNCTION_NAME:
            {
              this.state = 103
              this.function_evaluation()
            }
            break
          case SPLParser.T__9:
          case SPLParser.STRING:
          case SPLParser.BOOL:
          case SPLParser.NULL:
          case SPLParser.DATE:
          case SPLParser.INTEGER:
          case SPLParser.FLOAT:
            {
              this.state = 104
              this.value()
            }
            break
          case SPLParser.T__0:
            {
              this.state = 105
              this.match(SPLParser.T__0)
              this.state = 106
              _localctx._subOperand = this.operand(0)
              this.state = 107
              this.match(SPLParser.T__1)
            }
            break
          default:
            throw new NoViableAltException(this)
        }
        this._ctx._stop = this._input.tryLT(-1)
        this.state = 121
        this._errHandler.sync(this)
        _alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx)
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent()
            }
            _prevctx = _localctx
            {
              this.state = 119
              this._errHandler.sync(this)
              switch (this.interpreter.adaptivePredict(this._input, 9, this._ctx)) {
                case 1:
                  {
                    _localctx = new OperandContext(_parentctx, _parentState)
                    this.pushNewRecursionContext(_localctx, _startState, SPLParser.RULE_operand)
                    this.state = 111
                    if (!this.precpred(this._ctx, 7)) {
                      throw this.createFailedPredicateException('this.precpred(this._ctx, 7)')
                    }
                    {
                      this.state = 112
                      this.prioOperation()
                    }
                    this.state = 113
                    this.operand(8)
                  }
                  break

                case 2:
                  {
                    _localctx = new OperandContext(_parentctx, _parentState)
                    this.pushNewRecursionContext(_localctx, _startState, SPLParser.RULE_operand)
                    this.state = 115
                    if (!this.precpred(this._ctx, 6)) {
                      throw this.createFailedPredicateException('this.precpred(this._ctx, 6)')
                    }
                    {
                      this.state = 116
                      this.operation()
                    }
                    this.state = 117
                    this.operand(7)
                  }
                  break
              }
            }
          }
          this.state = 123
          this._errHandler.sync(this)
          _alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx)
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.unrollRecursionContexts(_parentctx)
    }
    return _localctx
  }
  // @RuleVersion(0)
  public comparator(): ComparatorContext {
    let _localctx: ComparatorContext = new ComparatorContext(this._ctx, this.state)
    this.enterRule(_localctx, 20, SPLParser.RULE_comparator)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 124
        this.match(SPLParser.COMPARATOR)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public operator(): OperatorContext {
    let _localctx: OperatorContext = new OperatorContext(this._ctx, this.state)
    this.enterRule(_localctx, 22, SPLParser.RULE_operator)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 126
        this.match(SPLParser.OPERATOR)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public operation(): OperationContext {
    let _localctx: OperationContext = new OperationContext(this._ctx, this.state)
    this.enterRule(_localctx, 24, SPLParser.RULE_operation)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 128
        this.match(SPLParser.OPERATION)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public prioOperation(): PrioOperationContext {
    let _localctx: PrioOperationContext = new PrioOperationContext(this._ctx, this.state)
    this.enterRule(_localctx, 26, SPLParser.RULE_prioOperation)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 130
        this.match(SPLParser.PRIO_OPERATION)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public fieldName(): FieldNameContext {
    let _localctx: FieldNameContext = new FieldNameContext(this._ctx, this.state)
    this.enterRule(_localctx, 28, SPLParser.RULE_fieldName)
    try {
      let _alt: number
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 132
        this.identifier()
        this.state = 140
        this._errHandler.sync(this)
        _alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx)
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            {
              {
                this.state = 133
                this.match(SPLParser.T__7)
                this.state = 134
                this.identifier()
                this.state = 136
                this._errHandler.sync(this)
                switch (this.interpreter.adaptivePredict(this._input, 11, this._ctx)) {
                  case 1:
                    {
                      this.state = 135
                      this.match(SPLParser.T__8)
                    }
                    break
                }
              }
            }
          }
          this.state = 142
          this._errHandler.sync(this)
          _alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx)
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public function_evaluation(): Function_evaluationContext {
    let _localctx: Function_evaluationContext = new Function_evaluationContext(
      this._ctx,
      this.state
    )
    this.enterRule(_localctx, 30, SPLParser.RULE_function_evaluation)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 143
        this.match(SPLParser.FUNCTION_NAME)
        this.state = 144
        this.match(SPLParser.T__0)
        this.state = 159
        this._errHandler.sync(this)
        switch (this.interpreter.adaptivePredict(this._input, 15, this._ctx)) {
          case 1:
            {
              {
                this.state = 145
                this.operand(0)
                this.state = 150
                this._errHandler.sync(this)
                _la = this._input.LA(1)
                while (_la === SPLParser.T__5) {
                  {
                    {
                      this.state = 146
                      this.match(SPLParser.T__5)
                      this.state = 147
                      this.operand(0)
                    }
                  }
                  this.state = 152
                  this._errHandler.sync(this)
                  _la = this._input.LA(1)
                }
              }
            }
            break

          case 2:
            {
              this.state = 156
              this._errHandler.sync(this)
              _la = this._input.LA(1)
              while (
                (_la & ~0x1f) === 0 &&
                ((1 << _la) &
                  ((1 << SPLParser.T__0) |
                    (1 << SPLParser.T__9) |
                    (1 << SPLParser.T__11) |
                    (1 << SPLParser.STRING) |
                    (1 << SPLParser.BOOL) |
                    (1 << SPLParser.NULL) |
                    (1 << SPLParser.FUNCTION_NAME) |
                    (1 << SPLParser.IDENTIFIER) |
                    (1 << SPLParser.DATE) |
                    (1 << SPLParser.INTEGER) |
                    (1 << SPLParser.FLOAT))) !==
                  0
              ) {
                {
                  {
                    this.state = 153
                    this.operand(0)
                  }
                }
                this.state = 158
                this._errHandler.sync(this)
                _la = this._input.LA(1)
              }
            }
            break
        }
        this.state = 161
        this.match(SPLParser.T__1)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public identifier(): IdentifierContext {
    let _localctx: IdentifierContext = new IdentifierContext(this._ctx, this.state)
    this.enterRule(_localctx, 32, SPLParser.RULE_identifier)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 163
        this.match(SPLParser.IDENTIFIER)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public value(): ValueContext {
    let _localctx: ValueContext = new ValueContext(this._ctx, this.state)
    this.enterRule(_localctx, 34, SPLParser.RULE_value)
    try {
      this.state = 167
      this._errHandler.sync(this)
      switch (this._input.LA(1)) {
        case SPLParser.STRING:
        case SPLParser.BOOL:
        case SPLParser.NULL:
        case SPLParser.DATE:
        case SPLParser.INTEGER:
        case SPLParser.FLOAT:
          this.enterOuterAlt(_localctx, 1)
          {
            this.state = 165
            this.primitiveValue()
          }
          break
        case SPLParser.T__9:
          this.enterOuterAlt(_localctx, 2)
          {
            this.state = 166
            this.list()
          }
          break
        default:
          throw new NoViableAltException(this)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public list(): ListContext {
    let _localctx: ListContext = new ListContext(this._ctx, this.state)
    this.enterRule(_localctx, 36, SPLParser.RULE_list)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 169
        this.match(SPLParser.T__9)
        this.state = 170
        this.operand(0)
        this.state = 175
        this._errHandler.sync(this)
        _la = this._input.LA(1)
        while (_la === SPLParser.T__5) {
          {
            {
              this.state = 171
              this.match(SPLParser.T__5)
              this.state = 172
              this.operand(0)
            }
          }
          this.state = 177
          this._errHandler.sync(this)
          _la = this._input.LA(1)
        }
        this.state = 178
        this.match(SPLParser.T__10)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public integerValue(): IntegerValueContext {
    let _localctx: IntegerValueContext = new IntegerValueContext(this._ctx, this.state)
    this.enterRule(_localctx, 38, SPLParser.RULE_integerValue)
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 180
        this.match(SPLParser.INTEGER)
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public variable(): VariableContext {
    let _localctx: VariableContext = new VariableContext(this._ctx, this.state)
    this.enterRule(_localctx, 40, SPLParser.RULE_variable)
    try {
      let _alt: number
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 182
        this.match(SPLParser.T__11)
        this.state = 183
        this.identifier()
        this.state = 191
        this._errHandler.sync(this)
        _alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx)
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            {
              {
                this.state = 184
                this.match(SPLParser.T__7)
                this.state = 185
                this.identifier()
                this.state = 187
                this._errHandler.sync(this)
                switch (this.interpreter.adaptivePredict(this._input, 18, this._ctx)) {
                  case 1:
                    {
                      this.state = 186
                      this.match(SPLParser.T__8)
                    }
                    break
                }
              }
            }
          }
          this.state = 193
          this._errHandler.sync(this)
          _alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx)
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }
  // @RuleVersion(0)
  public primitiveValue(): PrimitiveValueContext {
    let _localctx: PrimitiveValueContext = new PrimitiveValueContext(this._ctx, this.state)
    this.enterRule(_localctx, 42, SPLParser.RULE_primitiveValue)
    let _la: number
    try {
      this.enterOuterAlt(_localctx, 1)
      {
        this.state = 194
        _la = this._input.LA(1)
        if (
          !(
            (_la & ~0x1f) === 0 &&
            ((1 << _la) &
              ((1 << SPLParser.STRING) |
                (1 << SPLParser.BOOL) |
                (1 << SPLParser.NULL) |
                (1 << SPLParser.DATE) |
                (1 << SPLParser.INTEGER) |
                (1 << SPLParser.FLOAT))) !==
              0
          )
        ) {
          this._errHandler.recoverInline(this)
        } else {
          if (this._input.LA(1) === Token.EOF) {
            this.matchedEOF = true
          }

          this._errHandler.reportMatch(this)
          this.consume()
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        _localctx.exception = re
        this._errHandler.reportError(this, re)
        this._errHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return _localctx
  }

  public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
    switch (ruleIndex) {
      case 2:
        return this.predicate_sempred(_localctx as PredicateContext, predIndex)

      case 9:
        return this.operand_sempred(_localctx as OperandContext, predIndex)
    }
    return true
  }
  private predicate_sempred(_localctx: PredicateContext, predIndex: number): boolean {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 3)
    }
    return true
  }
  private operand_sempred(_localctx: OperandContext, predIndex: number): boolean {
    switch (predIndex) {
      case 1:
        return this.precpred(this._ctx, 7)

      case 2:
        return this.precpred(this._ctx, 6)
    }
    return true
  }

  public static readonly _serializedATN: string =
    '\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03"\xC7\x04\x02' +
    '\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07' +
    '\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04' +
    '\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04' +
    '\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x03' +
    '\x02\x05\x020\n\x02\x03\x02\x05\x023\n\x02\x03\x02\x05\x026\n\x02\x03' +
    '\x03\x03\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03' +
    '\x04\x05\x04B\n\x04\x03\x04\x03\x04\x03\x04\x03\x04\x07\x04H\n\x04\f\x04' +
    '\x0E\x04K\v\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x07\x05R\n\x05' +
    '\f\x05\x0E\x05U\v\x05\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06[\n\x06\x03' +
    '\x07\x03\x07\x03\b\x03\b\x03\t\x03\t\x05\tc\n\t\x03\n\x03\n\x03\v\x03' +
    '\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\vp\n\v\x03\v\x03\v\x03' +
    '\v\x03\v\x03\v\x03\v\x03\v\x03\v\x07\vz\n\v\f\v\x0E\v}\v\v\x03\f\x03\f' +
    '\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x03' +
    '\x10\x05\x10\x8B\n\x10\x07\x10\x8D\n\x10\f\x10\x0E\x10\x90\v\x10\x03\x11' +
    '\x03\x11\x03\x11\x03\x11\x03\x11\x07\x11\x97\n\x11\f\x11\x0E\x11\x9A\v' +
    '\x11\x03\x11\x07\x11\x9D\n\x11\f\x11\x0E\x11\xA0\v\x11\x05\x11\xA2\n\x11' +
    '\x03\x11\x03\x11\x03\x12\x03\x12\x03\x13\x03\x13\x05\x13\xAA\n\x13\x03' +
    '\x14\x03\x14\x03\x14\x03\x14\x07\x14\xB0\n\x14\f\x14\x0E\x14\xB3\v\x14' +
    '\x03\x14\x03\x14\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16' +
    '\x05\x16\xBE\n\x16\x07\x16\xC0\n\x16\f\x16\x0E\x16\xC3\v\x16\x03\x17\x03' +
    '\x17\x03\x17\x02\x02\x04\x06\x14\x18\x02\x02\x04\x02\x06\x02\b\x02\n\x02' +
    '\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02' +
    '\x1E\x02 \x02"\x02$\x02&\x02(\x02*\x02,\x02\x02\x04\x03\x02\x05\x06\x05' +
    '\x02\x17\x17\x1A\x1B\x1E \x02\xC7\x02/\x03\x02\x02\x02\x047\x03\x02\x02' +
    '\x02\x06A\x03\x02\x02\x02\bL\x03\x02\x02\x02\nV\x03\x02\x02\x02\f\\\x03' +
    '\x02\x02\x02\x0E^\x03\x02\x02\x02\x10`\x03\x02\x02\x02\x12d\x03\x02\x02' +
    '\x02\x14o\x03\x02\x02\x02\x16~\x03\x02\x02\x02\x18\x80\x03\x02\x02\x02' +
    '\x1A\x82\x03\x02\x02\x02\x1C\x84\x03\x02\x02\x02\x1E\x86\x03\x02\x02\x02' +
    ' \x91\x03\x02\x02\x02"\xA5\x03\x02\x02\x02$\xA9\x03\x02\x02\x02&\xAB' +
    '\x03\x02\x02\x02(\xB6\x03\x02\x02\x02*\xB8\x03\x02\x02\x02,\xC4\x03\x02' +
    '\x02\x02.0\x05\x06\x04\x02/.\x03\x02\x02\x02/0\x03\x02\x02\x0202\x03\x02' +
    '\x02\x0213\x05\b\x05\x0221\x03\x02\x02\x0223\x03\x02\x02\x0235\x03\x02' +
    '\x02\x0246\x05\n\x06\x0254\x03\x02\x02\x0256\x03\x02\x02\x026\x03\x03' +
    '\x02\x02\x0278\x05\x14\v\x0289\x05\x16\f\x029:\x05\x14\v\x02:\x05\x03' +
    '\x02\x02\x02;<\b\x04\x01\x02<B\x05\x04\x03\x02=>\x07\x03\x02\x02>?\x05' +
    '\x06\x04\x02?@\x07\x04\x02\x02@B\x03\x02\x02\x02A;\x03\x02\x02\x02A=\x03' +
    '\x02\x02\x02BI\x03\x02\x02\x02CD\f\x05\x02\x02DE\x05\x18\r\x02EF\x05\x06' +
    '\x04\x06FH\x03\x02\x02\x02GC\x03\x02\x02\x02HK\x03\x02\x02\x02IG\x03\x02' +
    '\x02\x02IJ\x03\x02\x02\x02J\x07\x03\x02\x02\x02KI\x03\x02\x02\x02LM\t' +
    '\x02\x02\x02MN\x07\x07\x02\x02NS\x05\x10\t\x02OP\x07\b\x02\x02PR\x05\x10' +
    '\t\x02QO\x03\x02\x02\x02RU\x03\x02\x02\x02SQ\x03\x02\x02\x02ST\x03\x02' +
    '\x02\x02T\t\x03\x02\x02\x02US\x03\x02\x02\x02VW\x07\t\x02\x02WZ\x05\x14' +
    '\v\x02XY\x07\b\x02\x02Y[\x05\x14\v\x02ZX\x03\x02\x02\x02Z[\x03\x02\x02' +
    '\x02[\v\x03\x02\x02\x02\\]\x07\x1F\x02\x02]\r\x03\x02\x02\x02^_\x07\x1F' +
    '\x02\x02_\x0F\x03\x02\x02\x02`b\x05\x14\v\x02ac\x05\x12\n\x02ba\x03\x02' +
    '\x02\x02bc\x03\x02\x02\x02c\x11\x03\x02\x02\x02de\x07\x0F\x02\x02e\x13' +
    '\x03\x02\x02\x02fg\b\v\x01\x02gp\x05*\x16\x02hp\x05\x1E\x10\x02ip\x05' +
    ' \x11\x02jp\x05$\x13\x02kl\x07\x03\x02\x02lm\x05\x14\v\x02mn\x07\x04\x02' +
    '\x02np\x03\x02\x02\x02of\x03\x02\x02\x02oh\x03\x02\x02\x02oi\x03\x02\x02' +
    '\x02oj\x03\x02\x02\x02ok\x03\x02\x02\x02p{\x03\x02\x02\x02qr\f\t\x02\x02' +
    'rs\x05\x1C\x0F\x02st\x05\x14\v\ntz\x03\x02\x02\x02uv\f\b\x02\x02vw\x05' +
    '\x1A\x0E\x02wx\x05\x14\v\txz\x03\x02\x02\x02yq\x03\x02\x02\x02yu\x03\x02' +
    '\x02\x02z}\x03\x02\x02\x02{y\x03\x02\x02\x02{|\x03\x02\x02\x02|\x15\x03' +
    '\x02\x02\x02}{\x03\x02\x02\x02~\x7F\x07\x16\x02\x02\x7F\x17\x03\x02\x02' +
    '\x02\x80\x81\x07\x10\x02\x02\x81\x19\x03\x02\x02\x02\x82\x83\x07\x12\x02' +
    '\x02\x83\x1B\x03\x02\x02\x02\x84\x85\x07\x11\x02\x02\x85\x1D\x03\x02\x02' +
    '\x02\x86\x8E\x05"\x12\x02\x87\x88\x07\n\x02\x02\x88\x8A\x05"\x12\x02' +
    '\x89\x8B\x07\v\x02\x02\x8A\x89\x03\x02\x02\x02\x8A\x8B\x03\x02\x02\x02' +
    '\x8B\x8D\x03\x02\x02\x02\x8C\x87\x03\x02\x02\x02\x8D\x90\x03\x02\x02\x02' +
    '\x8E\x8C\x03\x02\x02\x02\x8E\x8F\x03\x02\x02\x02\x8F\x1F\x03\x02\x02\x02' +
    '\x90\x8E\x03\x02\x02\x02\x91\x92\x07\x1C\x02\x02\x92\xA1\x07\x03\x02\x02' +
    '\x93\x98\x05\x14\v\x02\x94\x95\x07\b\x02\x02\x95\x97\x05\x14\v\x02\x96' +
    '\x94\x03\x02\x02\x02\x97\x9A\x03\x02\x02\x02\x98\x96\x03\x02\x02\x02\x98' +
    '\x99\x03\x02\x02\x02\x99\xA2\x03\x02\x02\x02\x9A\x98\x03\x02\x02\x02\x9B' +
    '\x9D\x05\x14\v\x02\x9C\x9B\x03\x02\x02\x02\x9D\xA0\x03\x02\x02\x02\x9E' +
    '\x9C\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02\x9F\xA2\x03\x02\x02\x02\xA0' +
    '\x9E\x03\x02\x02\x02\xA1\x93\x03\x02\x02\x02\xA1\x9E\x03\x02\x02\x02\xA2' +
    '\xA3\x03\x02\x02\x02\xA3\xA4\x07\x04\x02\x02\xA4!\x03\x02\x02\x02\xA5' +
    '\xA6\x07\x1D\x02\x02\xA6#\x03\x02\x02\x02\xA7\xAA\x05,\x17\x02\xA8\xAA' +
    '\x05&\x14\x02\xA9\xA7\x03\x02\x02\x02\xA9\xA8\x03\x02\x02\x02\xAA%\x03' +
    '\x02\x02\x02\xAB\xAC\x07\f\x02\x02\xAC\xB1\x05\x14\v\x02\xAD\xAE\x07\b' +
    '\x02\x02\xAE\xB0\x05\x14\v\x02\xAF\xAD\x03\x02\x02\x02\xB0\xB3\x03\x02' +
    '\x02\x02\xB1\xAF\x03\x02\x02\x02\xB1\xB2\x03\x02\x02\x02\xB2\xB4\x03\x02' +
    "\x02\x02\xB3\xB1\x03\x02\x02\x02\xB4\xB5\x07\r\x02\x02\xB5'\x03\x02\x02" +
    '\x02\xB6\xB7\x07\x1F\x02\x02\xB7)\x03\x02\x02\x02\xB8\xB9\x07\x0E\x02' +
    '\x02\xB9\xC1\x05"\x12\x02\xBA\xBB\x07\n\x02\x02\xBB\xBD\x05"\x12\x02' +
    '\xBC\xBE\x07\v\x02\x02\xBD\xBC\x03\x02\x02\x02\xBD\xBE\x03\x02\x02\x02' +
    '\xBE\xC0\x03\x02\x02\x02\xBF\xBA\x03\x02\x02\x02\xC0\xC3\x03\x02\x02\x02' +
    '\xC1\xBF\x03\x02\x02\x02\xC1\xC2\x03\x02\x02\x02\xC2+\x03\x02\x02\x02' +
    '\xC3\xC1\x03\x02\x02\x02\xC4\xC5\t\x03\x02\x02\xC5-\x03\x02\x02\x02\x16' +
    '/25AISZboy{\x8A\x8E\x98\x9E\xA1\xA9\xB1\xBD\xC1'
  public static __ATN: ATN
  public static get _ATN(): ATN {
    if (!SPLParser.__ATN) {
      SPLParser.__ATN = new ATNDeserializer().deserialize(
        Utils.toCharArray(SPLParser._serializedATN)
      )
    }

    return SPLParser.__ATN
  }
}

export class QueryContext extends ParserRuleContext {
  public predicate(): PredicateContext | undefined {
    return this.tryGetRuleContext(0, PredicateContext)
  }
  public sorter(): SorterContext | undefined {
    return this.tryGetRuleContext(0, SorterContext)
  }
  public limiter(): LimiterContext | undefined {
    return this.tryGetRuleContext(0, LimiterContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_query
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterQuery) {
      listener.enterQuery(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitQuery) {
      listener.exitQuery(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitQuery) {
      return visitor.visitQuery(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class Predicate_memberContext extends ParserRuleContext {
  public operand(): OperandContext[]
  public operand(i: number): OperandContext
  public operand(i?: number): OperandContext | OperandContext[] {
    if (i === undefined) {
      return this.getRuleContexts(OperandContext)
    } else {
      return this.getRuleContext(i, OperandContext)
    }
  }
  public comparator(): ComparatorContext {
    return this.getRuleContext(0, ComparatorContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_predicate_member
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterPredicate_member) {
      listener.enterPredicate_member(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitPredicate_member) {
      listener.exitPredicate_member(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitPredicate_member) {
      return visitor.visitPredicate_member(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class PredicateContext extends ParserRuleContext {
  public _subPredicate!: PredicateContext
  public predicate(): PredicateContext[]
  public predicate(i: number): PredicateContext
  public predicate(i?: number): PredicateContext | PredicateContext[] {
    if (i === undefined) {
      return this.getRuleContexts(PredicateContext)
    } else {
      return this.getRuleContext(i, PredicateContext)
    }
  }
  public operator(): OperatorContext | undefined {
    return this.tryGetRuleContext(0, OperatorContext)
  }
  public predicate_member(): Predicate_memberContext | undefined {
    return this.tryGetRuleContext(0, Predicate_memberContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_predicate
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterPredicate) {
      listener.enterPredicate(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitPredicate) {
      listener.exitPredicate(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitPredicate) {
      return visitor.visitPredicate(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class SorterContext extends ParserRuleContext {
  public sort_rule(): Sort_ruleContext[]
  public sort_rule(i: number): Sort_ruleContext
  public sort_rule(i?: number): Sort_ruleContext | Sort_ruleContext[] {
    if (i === undefined) {
      return this.getRuleContexts(Sort_ruleContext)
    } else {
      return this.getRuleContext(i, Sort_ruleContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_sorter
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterSorter) {
      listener.enterSorter(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitSorter) {
      listener.exitSorter(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitSorter) {
      return visitor.visitSorter(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class LimiterContext extends ParserRuleContext {
  public operand(): OperandContext[]
  public operand(i: number): OperandContext
  public operand(i?: number): OperandContext | OperandContext[] {
    if (i === undefined) {
      return this.getRuleContexts(OperandContext)
    } else {
      return this.getRuleContext(i, OperandContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_limiter
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterLimiter) {
      listener.enterLimiter(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitLimiter) {
      listener.exitLimiter(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitLimiter) {
      return visitor.visitLimiter(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class Start_pageContext extends ParserRuleContext {
  public INTEGER(): TerminalNode {
    return this.getToken(SPLParser.INTEGER, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_start_page
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterStart_page) {
      listener.enterStart_page(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitStart_page) {
      listener.exitStart_page(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitStart_page) {
      return visitor.visitStart_page(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class Number_per_pageContext extends ParserRuleContext {
  public INTEGER(): TerminalNode {
    return this.getToken(SPLParser.INTEGER, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_number_per_page
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterNumber_per_page) {
      listener.enterNumber_per_page(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitNumber_per_page) {
      listener.exitNumber_per_page(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitNumber_per_page) {
      return visitor.visitNumber_per_page(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class Sort_ruleContext extends ParserRuleContext {
  public operand(): OperandContext {
    return this.getRuleContext(0, OperandContext)
  }
  public order(): OrderContext | undefined {
    return this.tryGetRuleContext(0, OrderContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_sort_rule
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterSort_rule) {
      listener.enterSort_rule(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitSort_rule) {
      listener.exitSort_rule(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitSort_rule) {
      return visitor.visitSort_rule(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class OrderContext extends ParserRuleContext {
  public ORDER(): TerminalNode {
    return this.getToken(SPLParser.ORDER, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_order
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterOrder) {
      listener.enterOrder(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitOrder) {
      listener.exitOrder(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitOrder) {
      return visitor.visitOrder(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class OperandContext extends ParserRuleContext {
  public _subOperand!: OperandContext
  public operand(): OperandContext[]
  public operand(i: number): OperandContext
  public operand(i?: number): OperandContext | OperandContext[] {
    if (i === undefined) {
      return this.getRuleContexts(OperandContext)
    } else {
      return this.getRuleContext(i, OperandContext)
    }
  }
  public prioOperation(): PrioOperationContext | undefined {
    return this.tryGetRuleContext(0, PrioOperationContext)
  }
  public operation(): OperationContext | undefined {
    return this.tryGetRuleContext(0, OperationContext)
  }
  public variable(): VariableContext | undefined {
    return this.tryGetRuleContext(0, VariableContext)
  }
  public fieldName(): FieldNameContext | undefined {
    return this.tryGetRuleContext(0, FieldNameContext)
  }
  public function_evaluation(): Function_evaluationContext | undefined {
    return this.tryGetRuleContext(0, Function_evaluationContext)
  }
  public value(): ValueContext | undefined {
    return this.tryGetRuleContext(0, ValueContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_operand
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterOperand) {
      listener.enterOperand(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitOperand) {
      listener.exitOperand(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitOperand) {
      return visitor.visitOperand(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class ComparatorContext extends ParserRuleContext {
  public COMPARATOR(): TerminalNode {
    return this.getToken(SPLParser.COMPARATOR, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_comparator
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterComparator) {
      listener.enterComparator(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitComparator) {
      listener.exitComparator(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitComparator) {
      return visitor.visitComparator(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class OperatorContext extends ParserRuleContext {
  public OPERATOR(): TerminalNode {
    return this.getToken(SPLParser.OPERATOR, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_operator
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterOperator) {
      listener.enterOperator(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitOperator) {
      listener.exitOperator(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitOperator) {
      return visitor.visitOperator(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class OperationContext extends ParserRuleContext {
  public OPERATION(): TerminalNode {
    return this.getToken(SPLParser.OPERATION, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_operation
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterOperation) {
      listener.enterOperation(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitOperation) {
      listener.exitOperation(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitOperation) {
      return visitor.visitOperation(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class PrioOperationContext extends ParserRuleContext {
  public PRIO_OPERATION(): TerminalNode {
    return this.getToken(SPLParser.PRIO_OPERATION, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_prioOperation
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterPrioOperation) {
      listener.enterPrioOperation(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitPrioOperation) {
      listener.exitPrioOperation(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitPrioOperation) {
      return visitor.visitPrioOperation(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class FieldNameContext extends ParserRuleContext {
  public identifier(): IdentifierContext[]
  public identifier(i: number): IdentifierContext
  public identifier(i?: number): IdentifierContext | IdentifierContext[] {
    if (i === undefined) {
      return this.getRuleContexts(IdentifierContext)
    } else {
      return this.getRuleContext(i, IdentifierContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_fieldName
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterFieldName) {
      listener.enterFieldName(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitFieldName) {
      listener.exitFieldName(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitFieldName) {
      return visitor.visitFieldName(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class Function_evaluationContext extends ParserRuleContext {
  public FUNCTION_NAME(): TerminalNode {
    return this.getToken(SPLParser.FUNCTION_NAME, 0)
  }
  public operand(): OperandContext[]
  public operand(i: number): OperandContext
  public operand(i?: number): OperandContext | OperandContext[] {
    if (i === undefined) {
      return this.getRuleContexts(OperandContext)
    } else {
      return this.getRuleContext(i, OperandContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_function_evaluation
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterFunction_evaluation) {
      listener.enterFunction_evaluation(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitFunction_evaluation) {
      listener.exitFunction_evaluation(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitFunction_evaluation) {
      return visitor.visitFunction_evaluation(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class IdentifierContext extends ParserRuleContext {
  public IDENTIFIER(): TerminalNode {
    return this.getToken(SPLParser.IDENTIFIER, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_identifier
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterIdentifier) {
      listener.enterIdentifier(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitIdentifier) {
      listener.exitIdentifier(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitIdentifier) {
      return visitor.visitIdentifier(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class ValueContext extends ParserRuleContext {
  public primitiveValue(): PrimitiveValueContext | undefined {
    return this.tryGetRuleContext(0, PrimitiveValueContext)
  }
  public list(): ListContext | undefined {
    return this.tryGetRuleContext(0, ListContext)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_value
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterValue) {
      listener.enterValue(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitValue) {
      listener.exitValue(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitValue) {
      return visitor.visitValue(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class ListContext extends ParserRuleContext {
  public operand(): OperandContext[]
  public operand(i: number): OperandContext
  public operand(i?: number): OperandContext | OperandContext[] {
    if (i === undefined) {
      return this.getRuleContexts(OperandContext)
    } else {
      return this.getRuleContext(i, OperandContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_list
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterList) {
      listener.enterList(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitList) {
      listener.exitList(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitList) {
      return visitor.visitList(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class IntegerValueContext extends ParserRuleContext {
  public INTEGER(): TerminalNode {
    return this.getToken(SPLParser.INTEGER, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_integerValue
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterIntegerValue) {
      listener.enterIntegerValue(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitIntegerValue) {
      listener.exitIntegerValue(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitIntegerValue) {
      return visitor.visitIntegerValue(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class VariableContext extends ParserRuleContext {
  public identifier(): IdentifierContext[]
  public identifier(i: number): IdentifierContext
  public identifier(i?: number): IdentifierContext | IdentifierContext[] {
    if (i === undefined) {
      return this.getRuleContexts(IdentifierContext)
    } else {
      return this.getRuleContext(i, IdentifierContext)
    }
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_variable
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterVariable) {
      listener.enterVariable(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitVariable) {
      listener.exitVariable(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitVariable) {
      return visitor.visitVariable(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}

export class PrimitiveValueContext extends ParserRuleContext {
  public DATE(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.DATE, 0)
  }
  public INTEGER(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.INTEGER, 0)
  }
  public FLOAT(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.FLOAT, 0)
  }
  public STRING(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.STRING, 0)
  }
  public BOOL(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.BOOL, 0)
  }
  public NULL(): TerminalNode | undefined {
    return this.tryGetToken(SPLParser.NULL, 0)
  }
  constructor(parent: ParserRuleContext | undefined, invokingState: number) {
    super(parent, invokingState)
  }
  // @Override
  public get ruleIndex(): number {
    return SPLParser.RULE_primitiveValue
  }
  // @Override
  public enterRule(listener: SPLListener): void {
    if (listener.enterPrimitiveValue) {
      listener.enterPrimitiveValue(this)
    }
  }
  // @Override
  public exitRule(listener: SPLListener): void {
    if (listener.exitPrimitiveValue) {
      listener.exitPrimitiveValue(this)
    }
  }
  // @Override
  public accept<Result>(visitor: SPLVisitor<Result>): Result {
    if (visitor.visitPrimitiveValue) {
      return visitor.visitPrimitiveValue(this)
    } else {
      return visitor.visitChildren(this)
    }
  }
}
