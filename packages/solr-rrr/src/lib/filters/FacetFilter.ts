import { filterProcessParams, IFacetOption, IFilterState } from "./filter";
import {ISolangApp, ISolangParamList, ISolrQuery, SolangState} from "../solang.types";
import {getAppFromState, getFilterFromApp} from "../store/solang.slice";

export interface IFacetFilterConfig {
  // solrField determines the field which will be filtered
  solrField: string;
  // alias is used both as the key for this filter's values in parameter lists and the tag in solr queries (which
  // gives us greater control over the query)
  alias: string;
  // Label used in legend element
  label: string
  // Maps to the solr option {!ex=tagname} see: https://solr.apache.org/guide/7_0/faceting.html#tagging-and-excluding-filters
  excludeTag: boolean;
  // If false, will be sorted numerically by count (facet.sort)
  sortAlpha: boolean;
  // Limit the number of possible facets returned (facet.limit)
  limit: number;
  // Limit returned facets by the count (facet.mincount)
  minCount: number;
  // If true will combine multiple options using logical OR when filtering results
  isOr?: boolean;
  // If provided, an extra facet option will be created representing documents with NO VALUE for the field. The string
  // will be used as the label for the facet option. (facet.missing)
  missingLabel?: string;
};

export interface IFacetFilterState extends IFilterState {
  // Filter config
  config: IFacetFilterConfig;
  // The currently filter value
  value: string[];
  // The available facetOptions
  options: IFacetOption[];
  // Boolean indicating whether filter has a selected value - ToDo: do we need hasValue?
  hasValue: boolean
}

export const facetFilterProcessParams = function (filterState: IFacetFilterState, params: ISolangParamList) {
  filterProcessParams(filterState, params);
}

export const facetFilterProcessQuery = function (filterState: IFacetFilterState, query: ISolrQuery) {
  facetFilterAddFacetField(filterState.config, query);
  facetFilterAddQuery(filterState, query);
}

/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
export function facetFilterAddFacetField ( config: IFacetFilterConfig, query: ISolrQuery ) {

  if ( config.excludeTag === true ) {
    query['facet.field'].push( `{!ex=${config.alias}}${config.solrField}` );
  }
  else {
    query['facet.field'].push( `${config.solrField}` );
  }

  if ( config.sortAlpha ) {
    query.legacy[`f.${config.solrField}.facet.sort`] = 'index';
  }

  if ( config.missingLabel ) {
    query.legacy[`f.${config.solrField}.facet.missing`] = 'true';
  }

  if ( config.limit ) {
    query.legacy[`f.${config.solrField}.facet.limit`] = config.limit.toString();
  }

  if ( config.minCount ) {
    query.legacy[`f.${config.solrField}.facet.mincount`] = (config.minCount === undefined) ? '1' : config.minCount.toString();
  }
}


export function facetFilterAddQuery (filterState: IFacetFilterState, query: ISolrQuery) {

  if (filterState.value.length > 0) {
    const join = (filterState.config.isOr === true) ? ' OR ' : ' ';

    const options = filterState.value.map(
      option => facetFilterProcessOption(filterState.config, option)
    ).join(join);

    query.fq.push(`{!tag='${filterState.config.alias}'}${options}`);
  }

}

/**
 * Processes an option value before adding to query (converts to empty if required)
 * @param option
 */
function facetFilterProcessOption (config: IFacetFilterConfig, option: string) {
  if ( config.missingLabel && option === config.missingLabel) {
    return facetFilterGetMissingFragment(config);
  }
  return `(${config.solrField}:"${option}")`;
}


/**
 * Returns the equivalent filter fragment for selecting items without a value.
 */
function facetFilterGetMissingFragment (config: IFacetFilterConfig) {
  return `(*:* NOT ${config.solrField}:*)`;
}

export interface IFormattedFacetOption {value: string, count: number};

/**
 * Returns possible facet options for the given filter.
 * @param state
 * @param appId
 * @param filterAlias
 */
export const facetFilterGetCountsFromState = (state: SolangState, appId: string, filterAlias: string): IFormattedFacetOption[] => {
  const app = getAppFromState(state, appId);
  return facetFilterGetCountsFromAppState(app, filterAlias);
}



export const facetFilterGetCountsFromAppState = (app: ISolangApp, filterAlias: string): IFormattedFacetOption[] => {
  const filter = getFilterFromApp(app, filterAlias);
  let facetOptions: { [key: string]: number } = {};

  // Add pre-selected values into array
  filter.value.forEach((value: string) => {
    facetOptions[value] = 0;
  });

  // Add returned facet options into array
  if (app.response && app.response.facet_counts ) {
    const solrField: string = filter.config.solrField;
    if (app.response.facet_counts.facet_fields[solrField]) {
      const counts = app.response.facet_counts.facet_fields[solrField];
      // NB We are expecting flat array of label1, count1, label2, count2, ...
      for (let i=0; i < counts.length; i+=2) {
        const key = counts[i];
        const count = counts[i+1];
        facetOptions[key] = counts[count];
      }
    }
  }

  const formattedFacetOptions: IFormattedFacetOption[] = Object.keys(facetOptions).map( (value: string) => {
    return {value: value, count: facetOptions[value]}
  });

  const sortedFacetOptions: IFormattedFacetOption[] = formattedFacetOptions.sort( (a: IFormattedFacetOption, b: IFormattedFacetOption) => {

    if (filter.config.sortAlpha) {
      if (a.value < b.value) return -1;
      else if (a.value > b.value) return 1;
      else return 0;
    }
    else {
      if (a.count < b.count) return -1;
      else if (a.count > b.count) return 1;
      else return 0;
    }
  });

  return sortedFacetOptions;
}
