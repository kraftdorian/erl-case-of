import {list} from './list';

// Case specification expression
type CaseSpecExpr = unknown;

// Predicate specification expression
type PredicateSpecExpr = unknown | symbol;

// Predicate specification result function
type PredicateSpecResultFn = (expression: unknown) => unknown;

// Predicate specification
type PredicateSpec = [PredicateSpecExpr, PredicateSpecResultFn];

// Executed predicate
type ExecutedPredicate = [number, boolean, PredicateSpecExpr, PredicateSpecResultFn];

// Executed predicate which is used as accumulator
type AccumulativeExecutedPredicate = ExecutedPredicate | [];

// Predicate expression which matches any case expression
const PREDICATE_EXPR_ANY: symbol = Symbol("_");

/**
 * Is passed predicate a valid predicate?
 * @param predicate Predicate to check
 */
function isValidPredicateSpec(predicate: unknown): predicate is PredicateSpec {
  return Array.isArray(predicate) && 2 === predicate.length && "function" === (typeof predicate[1]).toLowerCase()
}

/**
 * Is passed predicate a valid executed predicate?
 * @param predicate Predicate to check
 */
function isValidExecutedPredicate(predicate: unknown): predicate is ExecutedPredicate {
  return Array.isArray(predicate) && "function" === (typeof predicate[3]).toLowerCase();
}

/**
 * Function to handle no matching predicate situation
 * @param caseSpecExpression Expression passed to case specification
 */
function noPredicateMatch(caseSpecExpression: CaseSpecExpr): void {
  throw new Error(`No match for the expression ${caseSpecExpression}`);
}

/**
 * Compares predicate specification expression with case specification expression
 * @param caseSpecExpression Expression passed to case specification
 * @param predicateSpecExpression Expression passed to predicate specification
 */
function comparePredicateSpec(caseSpecExpression: CaseSpecExpr, predicateSpecExpression: PredicateSpecExpr): boolean {
  if (PREDICATE_EXPR_ANY === predicateSpecExpression) {
    return true;
  }
  return JSON.stringify(caseSpecExpression) === JSON.stringify(predicateSpecExpression);
}

/**
 * Executes passed predicate specifications
 * @param predicateSpecs Predicate specifications
 * @param caseSpecExpression Expression passed to case specification
 * @param acc Accumulator
 */
function execArrayPredicateSpecs(predicateSpecs: PredicateSpec[], caseSpecExpression: CaseSpecExpr, acc: ExecutedPredicate[]): ExecutedPredicate[] {
  const [predicateSpec, predicateSpecsTail] = list<PredicateSpec>(predicateSpecs);
  if (undefined === predicateSpec) {
    return acc;
  }
  return execArrayPredicateSpecs(
    predicateSpecsTail,
    caseSpecExpression,
    [
      ...acc,
      [acc.length, comparePredicateSpec(caseSpecExpression, predicateSpec[0]), predicateSpec[0], predicateSpec[1]]
    ]
  );
}

/**
 * Compares two executed predicates
 * @param predicateA First executed predicate to compare
 * @param predicateB Second executed predicate to compare
 */
function compareExecutedPredicates(predicateA: AccumulativeExecutedPredicate, predicateB: AccumulativeExecutedPredicate): AccumulativeExecutedPredicate {
  const [sequenceA, resultA] = predicateA;
  const [sequenceB, resultB] = predicateB;
  if (sequenceA && sequenceB && sequenceA < sequenceB && resultA) {
    return predicateA;
  } else if (resultB) {
    return predicateB;
  }
  return predicateA;
}

/**
 * Iterates over executed predicates to find the matching one
 * @param executedPredicates Executed predicates array where to find the matching one
 * @param acc Accumulator
 */
function findMatchingExecutedPredicate(executedPredicates: ExecutedPredicate[], acc: AccumulativeExecutedPredicate): AccumulativeExecutedPredicate {
  const [predicate, predicatesTail] = list<ExecutedPredicate>(executedPredicates);
  if (undefined === predicate) {
    return acc;
  }
  return findMatchingExecutedPredicate(predicatesTail, compareExecutedPredicates(acc, predicate));
}

/**
 * Creates and executes case specification
 * @param expression Case specification expression
 * @param predicateSpecs Predicate specifications
 */
function caseSpecification(expression: CaseSpecExpr, predicateSpecs: PredicateSpec[]): unknown {
  const executedPredicatesArray = execArrayPredicateSpecs(predicateSpecs, Object.freeze(expression), []);
  const matchingPredicate = findMatchingExecutedPredicate(executedPredicatesArray, []);
  if (isValidExecutedPredicate(matchingPredicate)) {
    return matchingPredicate[3](expression);
  } else {
    return noPredicateMatch(expression);
  }
}

export {
  CaseSpecExpr,
  PredicateSpecExpr,
  PredicateSpecResultFn,
  PredicateSpec,
  ExecutedPredicate,
  AccumulativeExecutedPredicate,
  PREDICATE_EXPR_ANY,
  isValidPredicateSpec,
  isValidExecutedPredicate,
  caseSpecification
};