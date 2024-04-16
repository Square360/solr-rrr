import {ISolangApp, ISolangParamList, ISolrQuery} from "../solang.types";
import {getFilterFromApp} from "../store/solang.slice";

export interface IDateRangeFilterConfig {
  // solrField determines the field which will be filtered
  solrField: string;
  // alias is used both as the key for this filter's values in parameter lists and the tag in solr queries (which
  // gives us greater control over the query)
  alias: string;
  // Label used in legend element
  label: string
}

export interface IDateRangeState {
  from?: string;
  to?: string;
  config: IDateRangeFilterConfig;
}

export function dateRangeFilterProcessParams (app: ISolangApp, filterId: string, params: ISolangParamList) {
  const filterState = getFilterFromApp(app, filterId) as IDateRangeState;
  const alias = filterState.config.alias;

  const fromIndex = `${alias}From`;
  const toIndex = `${alias}To`;
  filterState.from = params[ fromIndex ] as string ?? null;
  filterState.to = params[ toIndex ] as string ?? null;
}

export function dateRangeFilterProcessQuery (filterState: IDateRangeState, query: ISolrQuery) {
  const solrField = filterState.config.solrField;

  const fromDate = filterState.from ? new Date(filterState.from).toISOString() : '*';
  const toDate = filterState.to ? new Date(filterState.to).toISOString() : '*';

  const queryValue = `[ ${fromDate} TO ${toDate}]`;
  query.fq.push(`${solrField}:${queryValue}`);
}
