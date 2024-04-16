import {IFilterState} from "./filter";
import {ISolangApp, ISolangParamList, ISolrQuery} from "../solang.types";
import {getFilterFromApp} from "../store/solang.slice";

/*
 * CustomFilter allows us to create a callback for adding custom queries into the q parameter.
 * This is useful for fine tuning text searches to add wildcards / quotes etc.
 */

export type iCustomFilterCallback = (value: string) => string;

export interface ICustomFilterState extends IFilterState {
  // Filter config
  config: {
    alias: string,
    process: iCustomFilterCallback;
  };
}

export function customFilterProcessParams (app: ISolangApp, filterId: string, params: ISolangParamList) {

  const filterState = getFilterFromApp(app, filterId);
  const alias = filterState.config.alias;

  if ( params[ alias ] ) {
    filterState.value = params[ alias ] as string;
  }
  else {
    filterState.value = '';
  }
}

export const customFilterProcessQuery = function (filterState: ICustomFilterState, query: ISolrQuery) {
  const translatedValue = filterState.config.process(filterState.value);
  query.q = translatedValue;
}

