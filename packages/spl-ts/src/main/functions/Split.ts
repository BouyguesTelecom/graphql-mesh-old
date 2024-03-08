import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Split implements EvaluateFunctionOperand {
  functionName = 'SPLIT'

  evaluateFunction(operandParameterSupplier: (a: number) => object): any[] {
    return Array.from(
      operandParameterSupplier(0).toString().split(operandParameterSupplier(1).toString())
    )
  }
}
