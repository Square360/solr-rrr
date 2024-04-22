import {
  // Redux
  SolangSlice,
  SolangReducer,
  // Helper functions
  getAppFromState,
  getFilterFromState,
  getFilterFromApp,
  createEmptySolrQuery,

  // Filters
  createApp,
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  processDateRangeFilter,
  processFacetFilter,
  processOptionsList,
  processSimpleFilter,
  processCustomFilter,
  processPager,
  processSort
} from './lib/store/solang.slice';

import {
  facetFilterGetCountsFromAppState,
  IFacetFilterState,
} from './lib/filters/FacetFilter.ts';

import { SolangEpic }  from './lib/store/solang.epic';

import { createSolrQueryObs, prepareQuery } from "./lib/solang.api";
import DateRange from "./lib/components/DateRange/DateRange.tsx";
import FacetCheckbox from "./lib/components/FacetCheckbox/FacetCheckbox";
import SolangFacet from './lib/components/SolangFacet/SolangFacet';
import SimplePager from "./lib/components/SimplePager/SimplePager";
import SortSelect from "./lib/components/SortSelect/SortSelect";
import SortRadio from "./lib/components/SortRadio/SortRadio";
import OptionsList from "./lib/components/OptionsList/OptionsList";

import {
  // Types
  ISolangState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload
} from './lib/store/solang.slice';

import {
  ISolrQuery,
  ISolangParamList,
  ISolangAppConfig,
  ISolangApp,
  ISolrFacetQueries,
  ISolrFacetField,
  ISolrFacetFields,
  ISolrFacetCounts,
  ISolrResponse,
  SolangAppList,
  SolangState,
} from './lib/solang.types.ts'

export {
  SolangEpic,
  // Redux
  SolangReducer,
  SolangSlice,
  getAppFromState,
  getFilterFromState,
  getFilterFromApp,
  createEmptySolrQuery,
  // Helper functions
  createSolrQueryObs,
  prepareQuery,
  createApp,
  facetFilterGetCountsFromAppState,
  // App Reducers
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  // Filter Reduces
  processFacetFilter,
  processDateRangeFilter,
  processOptionsList,
  processSimpleFilter,
  processCustomFilter,
  processPager,
  processSort,
  // Components
  FacetCheckbox,
  DateRange,
  OptionsList,
  SolangFacet,
  SortSelect,
  SortRadio,
  SimplePager
};

// Types
export type {
  ISolrQuery,
  ISolangState,
  ISolangParamList,
  IFacetFilterState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload,
  ISolangAppConfig,
  ISolangApp,
  ISolrFacetQueries,
  ISolrFacetField,
  ISolrFacetFields,
  ISolrFacetCounts,
  ISolrResponse,
  SolangAppList,
  SolangState,
};
