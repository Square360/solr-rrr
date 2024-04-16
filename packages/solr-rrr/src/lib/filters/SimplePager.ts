import { ISolangApp, ISolangParamList, ISolrQuery, SolangState } from "../solang.types";
import { getAppFromState, getFilterFromApp } from "../store/solang.slice";
import { IFilterState } from "./filter";

export interface ISimplePagerConfig {
  rows: number;
};

export interface ISimplePagerState extends IFilterState {
  // Filter config
  config: ISimplePagerConfig;
  // The currently filter value
  value: number;
}

export function simplePagerProcessParams (app: ISolangApp, filterId: string, params: ISolangParamList) {

  const filter = getFilterFromApp(app, filterId);
  const alias = filter.config.alias;
  let value: any;

  if ( Array.isArray( params[ alias ] ) ) {
    value = params[ alias ][0];
  }
  else if ( params[ alias ] ) {
    value = params[ alias ];
  }
  else {
    value = 0;
  }

  filter.value = (typeof value === 'string') ? parseInt(value) : value;
}

export function simplePagerProcessQuery (filterState: ISimplePagerState, query: ISolrQuery) {
  query.start = filterState.value * filterState.config.rows;
  query.rows = filterState.config.rows;
}


export function getCountFromResponse (state: SolangState, appId: string) {
  const app = getAppFromState(state, appId);
  return app.response?.response.numFound || 0;
}
