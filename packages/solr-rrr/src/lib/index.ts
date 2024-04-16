import {
  // Redux
  SolangSlice,
  SolangReducer,
  // Helper functions
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  // Filters
  createApp,
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  processFacetFilter,
  processSimpleFilter,
  processCustomFilter,
  processPager,
  processSort
} from './store/solang.slice';

import { SolangEpic }  from './store/solang.epic';

import { createSolrQueryObs, prepareQuery } from "./solang.api";

import FacetCheckbox from "./components/FacetCheckbox/FacetCheckbox";
import SolangFacet from './components/SolangFacet/SolangFacet';
import SimplePager from "./components/SimplePager/SimplePager";
import SortSelect from "./components/SortSelect/SortSelect";
import SortRadio from "./components/SortRadio/SortRadio";
import OptionsList from "./components/OptionsList/OptionsList";

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
} from './store/solang.slice';


export {
  SolangEpic,
  // Redux
  SolangReducer,
  SolangSlice,
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  // Helper functions
  createSolrQueryObs,
  prepareQuery,
  createApp,
  // App Reducers
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  // Filter Reduces
  processFacetFilter,
  processSimpleFilter,
  processCustomFilter,
  processPager,
  processSort,
  // Components
  FacetCheckbox,
  OptionsList,
  SolangFacet,
  SortSelect,
  SortRadio,
  SimplePager
};

// Types
export type {
  ISolangState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload
};
