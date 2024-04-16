import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ISolangApp, ISolangParamList, SolangState, ISolrQuery, ISolrResponse, ISolangAppConfig} from "../solang.types";
import { facetFilterProcessParams, facetFilterProcessQuery, IFacetFilterState } from "../filters/FacetFilter";
import { simpleFilterProcessParams, simpleFilterProcessQuery } from "../filters/SimpleFilter";
import { IFilterState } from "../filters/filter";
import { ISimplePagerState, simplePagerProcessParams, simplePagerProcessQuery } from "../filters/SimplePager";
import { ISortState, sortProcessParams, sortProcessQuery } from "../filters/Sort";
import {customFilterProcessParams, customFilterProcessQuery, ICustomFilterState} from "../filters/CustomFilter";
import logger from "../logger";
import { optionsListProcessParams} from "../filters/OptionsList";
import {dateRangeFilterProcessParams, dateRangeFilterProcessQuery, IDateRangeState} from "../filters/DateRangeFilter";

//////////////////////////////////////
// Helper Functions
//////////////////////////////////////

/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
export const getAppFromState = (state: SolangState, appId: string) => {
  let app = state.apps[appId];
  if (!app) {
    // ToDo: Throw Error
    // throw new Error(`App ${appId} doesn't exist!`);
    logger(`App ${appId} doesn't exist!`);
  }
  return app;
}

/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
export const getFilterFromState = (state: SolangState, appId: string, filterAlias: string) => {
  const app = getAppFromState(state, appId);
  return getFilterFromApp(app, filterAlias)
}

export const getFilterFromApp = (app: ISolangApp, filterAlias: string) => {
  const filter = app.filters[filterAlias] ?? null;
  if (!filter) {
    logger(`Filter ${filterAlias} on app ${app.id} doesn't exist!`);
  }
  return filter;

}

export const createEmptySolrQuery = (): ISolrQuery => {
  return {
    q: '*',
    facet: 'true',
    'facet.field': [],
    fq: [],
    legacy: {},
    fl: [],
    start: 0,
    rows: 10
  }
}

export interface ISolangState {
  solang: SolangState
}


/**
 * Detects if the pager must be reset.
 * Any change to the param list not accompanied be a change in page should reset the pager to 0.
 * @param alias
 * @param existingParams
 * @param submittedParams
 */
export const pagerReset = (alias: string, existingParams: ISolangParamList, submittedParams: ISolangParamList): ISolangParamList => {

  if (alias && alias !== "") {
    const filteredExistingParams = Object.fromEntries(
        Object.entries(existingParams).filter(([key, value]) => key !== alias)
    );
    const filteredSubmittedParams = Object.fromEntries(
        Object.entries(submittedParams).filter(([key, value]) => key !== alias)
    );

    if (JSON.stringify(filteredExistingParams) !== JSON.stringify(filteredSubmittedParams)) {
      submittedParams[alias] = '0';
    }
  }

  return submittedParams;
}



//////////////////////////////////////
// Action & Payload interfaces
//////////////////////////////////////

/**
 * Interfaces
 */

export interface ICreateAppPayload {
  id: string;
  endpoint: string;
  config: ISolangAppConfig,
  params: ISolangParamList, // url-like paramerers
  filters: { [key: string]: IFilterState }; // A definition of all filters keyed by alias
}

export interface ISetParamsPayload {
  appId: string,
  params: ISolangParamList
}

export interface ISetParamPayload {
  appId: string,
  key: string,
  value: string | string[]
}

export interface IBuildQueryPayload {
  appId: string,
  query: ISolrQuery
}

export interface iSendQueryPayload {
  appId: string;
  query: ISolrQuery;
}

export interface IResultsReceivedPayload {
  appId: string;
  results: ISolrResponse;
}

export interface IProcessFilterPayload {
  appId: string;
  filter: string;
}

export interface iRefreshResultsPayload {
  appId: string;
}

//////////////////////////////////////
// Solang Slice
//////////////////////////////////////

const initialState: SolangState = {
  config: {},
  apps: {},
};


export const SolangSlice = createSlice({
  name: 'solang',
  initialState,
  reducers: {

    //////////////////////////////////////
    // Application reducers
    //////////////////////////////////////

    /**
     * Create a solr application
     * @param state
     * @param action
     */
    createApp: (state: SolangState, action: PayloadAction<ICreateAppPayload>) => {

      if (!state.apps[action.payload.id]) {
        state.apps[action.payload.id] = {
          ...action.payload,
          query: createEmptySolrQuery(),
        };

      } else {
        throw Error(`Solang app ${action.payload.id} already exists!`);
      }
    },

    //////////////////////////////////////
    // Query lifecycle reducers
    //////////////////////////////////////

    /**
     * Set an application's parameters (eg when a user selects a search option)
     * @param state
     * @param action
     */
    setParams: (state: SolangState, action: PayloadAction<ISetParamsPayload>) => {
      const appId = action.payload.appId;
      const app: ISolangApp = state.apps[appId];

      if ("pagerReset" in app.config) {
        const processedParams = pagerReset(app.config.pagerReset, app.params, action.payload.params);
        app.params = processedParams;
      }
      else {
        app.params = action.payload.params;
      }

      if (app?.config?.setQuery) {
        app.config.setQuery(app.params, 'push');
      }
    },

    /**
     * Update a single parameter in an application
     * @param state
     * @param action
     */
    setParam: (state: SolangState, action: PayloadAction<ISetParamPayload>) => {
      const appId = action.payload.appId;
      const app: ISolangApp = state.apps[appId];

      const newParams = {...app.params}
      newParams[action.payload.key] = action.payload.value;

      if ("pagerReset" in app.config) {
        const processedParams = pagerReset(app.config.pagerReset, app.params, newParams);
        app.params = processedParams;
      }
      else {
        app.params = newParams;
      }

      if (app?.config?.setQuery) {
        app.config.setQuery(app.params);
      }
    },

    /**
     * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
     * filter process functions to build the query before updating via sendQuery.
     * @param state
     * @param action
     */
    buildQuery: (state: SolangState, action: PayloadAction<IBuildQueryPayload>) => {
      logger('buildQuery reducer', action);
      logger('Setting URL params');

      const app = getAppFromState(state, action.payload.appId)
      app.lastQuery = app.query || {};
      app.query = createEmptySolrQuery();
    },

    /**
     * Stores a query. sendQueryEpic will then initiate the solr request and store result in resultsReceived
     * @param state
     * @param action
     */
    sendQuery: (state: SolangState, action: PayloadAction<iSendQueryPayload>) => {
      logger('sendQuery reducer', action);
    },

    /**
     * Updates results from a solr query to the application state
     * @param state
     * @param action
     */
    resultsReceived: (state: SolangState, action: PayloadAction<any>) => {
      logger('resultsReceived', action);
      const app = state.apps[action.payload.appId];
      app.response = action.payload.response.response;
    },

    /**
     * Triggers a
     * @param state
     */
    refreshResults: (state: SolangState, action: PayloadAction<iRefreshResultsPayload>) => {
      logger('refreshingData');
    },

    //////////////////////////////////////
    // Filter reducers
    //////////////////////////////////////

    /**
     * processQueryFacet reducer.
     * @param state
     * @param action
     */
    processFacetFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      if (app) {
        facetFilterProcessParams(app.filters[action.payload.filter] as IFacetFilterState, app.params);
        facetFilterProcessQuery(app.filters[action.payload.filter] as IFacetFilterState, app.query || createEmptySolrQuery());
      }
    },

    /**
     * processSimpleFilter reducer
     * @param state
     * @param action
     */
    processSimpleFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      if (app) {
        simpleFilterProcessParams(app.filters[action.payload.filter] as IFacetFilterState, app.params);
        simpleFilterProcessQuery(app.filters[action.payload.filter] as IFacetFilterState, app.query || createEmptySolrQuery());
      }
    },

    /**
     * processPager reducer
     * @param state
     * @param action
     */
    processPager: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      simplePagerProcessParams(app, action.payload.filter, app.params);
      simplePagerProcessQuery(app.filters[action.payload.filter] as ISimplePagerState, app.query || createEmptySolrQuery());
    },

    processSort: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      sortProcessParams(app, action.payload.filter, app.params);
      sortProcessQuery(app.filters[action.payload.filter] as ISortState, app.query || createEmptySolrQuery());
    },

    processOptionsList: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      optionsListProcessParams(app, action.payload.filter, app.params);
    },

    /**
     * processCustomSearch reducer
     * @param state
     * @param action
     */
    processCustomFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      customFilterProcessParams(app, action.payload.filter, app.params);
      customFilterProcessQuery(app.filters[action.payload.filter] as ICustomFilterState, app.query || createEmptySolrQuery());
    },

    /**
     * processDateRange reducer
     * @param state
     * @param action
     */
    processDateRangeFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      dateRangeFilterProcessParams(app, action.payload.filter, app.params);
      dateRangeFilterProcessQuery(app.filters[action.payload.filter] as IDateRangeState, app.query || createEmptySolrQuery());
    },

  }
});

export const {
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
  processSort,
  processOptionsList,
  processDateRangeFilter
} = SolangSlice.actions;


export const SolangReducer = SolangSlice.reducer;

