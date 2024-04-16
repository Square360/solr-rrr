/**
 * ToDo: We still have to expand on the ISolrQuery interface
 */
import { IFilterState } from "./filters/filter";

export interface ISolrQuery {
  q?: string;
  s?: string;                   // Alternative for q used in drupal solang
  facet?: 'true' | 'false';
  'facet.field': string[];
  fq: string[];
  wt?: string;
  'json.facet'?: string | {};
  'json.nl'?: string;
  start: number;
  rows: number;
  sort?: string;
  fl: string[];
  // Allows for use of field-value-facet parameters while maintaining strict typing. These must be moved into the
  // top-level of the query before sending to Solr
  // https://solr.apache.org/guide/8_1/faceting.html#field-value-faceting-parameters
  // See JSON Facet API for an alternative https://solr.apache.org/guide/8_1/json-facet-api.html
  legacy: { [key: string]: string | string[] }
}

/**
 * Defines possible parameters for a single search application. These should be compatible with URL query values.
 */
export interface ISolangParamList { [key: string]: string | string[] }


/**
 * Configuration object for Solang Application
 */
export interface ISolangAppConfig {
  externalParams?: boolean;
  setQuery?: any;
  preprocessQuery?: (query: ISolrQuery) => ISolrQuery;
  pagerReset: string;
}

/**
 * Default configuration for Solang Application
 */
export const SolangAppConfigDefaults: ISolangAppConfig = {
  externalParams: false,
  pagerReset: ""
}

/**
 * ISolangApp contains config, parameters, filters & results pertaining to a single solang application.
 */
export interface ISolangApp {
  // Unique identifier for this solang micro app.
  id: string;
  // Solr endpoint
  endpoint?: string;
  // Currently unused
  status?: 'idle' | 'loading' | 'failed',
  // Search configurations
  config: ISolangAppConfig,
  // Current search parameters. Parameters define the current search {search: scotland, category: news}
  params: ISolangParamList, // url-like paramerers
  filters: { [key: string]: IFilterState };
  response?: ISolrResponse,
  query: ISolrQuery,
  lastQuery?: {},
}


export interface ISolrFacetQueries { [key: string]: number };
export interface ISolrFacetField { [key: string]: number };
export interface ISolrFacetFields { [key: string]: ISolrFacetField };

export interface ISolrFacetCounts {
  facet_queries: ISolrFacetQueries,
  facet_fields: ISolrFacetFields,
  facet_ranges: any,
  facet_intervals: any,
  facet_heatmaps: any
}

export interface ISolrResponse {
  responseHeader: any,
  response: {
    numFound: number;
    start: number;
    numFoundExact?: boolean;
    docs: any[];
  },
  facet_counts?: ISolrFacetCounts
  "highlighting"?: any;
  "debug"?: any;
}

export interface SolangAppList { [key: string]: ISolangApp }

/**
 * State definition for the redux slice
 */
export interface SolangState {
  config: {}
  apps: SolangAppList
}


