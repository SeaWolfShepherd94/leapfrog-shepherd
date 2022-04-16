import {
  AverageProjection,
  CountDistinctProjection,
  CountProjection,
  MaxProjection,
  MinProjection,
  SumProjection
} from '@physion/leapfrog-ts-api/dist/queryLanguage';

export function isAggregation(p: any): string {
  switch (true) {
    case p instanceof AverageProjection:
      return 'average';
    case p instanceof CountDistinctProjection:
      return 'count-distinct';
    case p instanceof CountProjection:
      return 'count';
    case p instanceof MaxProjection:
      return 'max';
    case p instanceof MinProjection:
      return 'min';
    case p instanceof SumProjection:
      return 'sum';
    default:
      return 'none';
  }
}

export const dataCategories = [
  {
    Undefined: [true, true, true, true, true]
  },
  {
    String: [false, true, true, true, false]
  },
  {
    Number: [false, false, false, false, false]
  },
  {
    Time: [false, true, false, false, false]
  },
  {
    Boolean: [false, false, true, true, false]
  }
];
