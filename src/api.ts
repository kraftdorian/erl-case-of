import {
  CaseSpecExpr,
  PredicateSpec,
  PredicateSpecExpr,
  PredicateSpecResultFn,
  PREDICATE_EXPR_ANY,
  caseSpecification
} from './lib';

// Case API interface
interface CaseAPI {
  of(...predicateSpecs: PredicateSpec[]): unknown;
}

// Case API root function
type CaseAPIFn = (expression: CaseSpecExpr) => CaseAPI;

// Case API expression function
type CaseAPIExprFn = (predicateSpecExpr: PredicateSpecExpr, predicateSpecResultFn: PredicateSpecResultFn) => PredicateSpec;

// Case API any expression function
type CaseAPIAnyExprFn = (predicateSpecResultFn: PredicateSpecResultFn) => PredicateSpec;

/**
 * Creates and executes provided case specification
 * @param expression Expression to match
 */
const _case: CaseAPIFn = (expression: CaseSpecExpr) => ({
  of: (...predicateSpecs: PredicateSpec[]) => caseSpecification(expression, predicateSpecs)
});

/**
 * Creates case API compatible expression
 * @param predicateSpecExpr Predicate specification expression
 * @param predicateSpecResultFn Predicate specification result function
 */
const _expr: CaseAPIExprFn = (predicateSpecExpr: PredicateSpecExpr, predicateSpecResultFn: PredicateSpecResultFn) => ([predicateSpecExpr, predicateSpecResultFn]);

/**
 * Creates case API compatible any match expression
 * @param predicateSpecResultFn Predicate specification result function
 */
const _any: CaseAPIAnyExprFn = (predicateSpecResultFn: PredicateSpecResultFn) => _expr(PREDICATE_EXPR_ANY, predicateSpecResultFn);

export {_case, _expr, _any}