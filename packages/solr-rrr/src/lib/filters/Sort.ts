
import { ISolangApp, ISolangParamList, ISolrQuery } from "../solang.types";
import { getFilterFromApp } from "../store/solang.slice";
import { IFilterState } from "./filter";

export interface ISortConfig {
  alias: string;
  options: Array<{ label: string, value: string}>;
  default?: string
};

export interface ISortState extends IFilterState {
  // Filter config
  config: ISortConfig;
  // The current filter value
  value?: string;
}

export function sortProcessParams (app: ISolangApp, filterId: string, params: ISolangParamList) {

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
    value = '';
  }

  filter.value = value;

}

export function sortProcessQuery (filterState: ISortState, query: ISolrQuery) {
  if (filterState.value !== '') {
    const sortItem = filterState.config.options.find( i => i.value === filterState.value);
    if (sortItem) {
      query.sort = sortItem.value;
    }
  }
  else {
    if (filterState.config.default) {
      const sortItem = filterState.config.options.find( i => i.label === filterState.config.default);
      if (sortItem) {
        query.sort = sortItem.value;
      }
    }
  }
}
