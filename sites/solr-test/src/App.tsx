import { useAppSelector, useAppDispatch } from "./store/hooks";
import {RootState} from "./store/store";

import { TestSolang } from "./components/TestSolang/TestSolang";
import {ArrayParam, StringParam, useQueryParams, withDefault} from "use-query-params";
import {
  createApp,
  getAppFromState,
  processCustomFilter,
  processFacetFilter,
  processDateRangeFilter,
  processOptionsList,
  processPager,
  processSort,
  refreshResults,
  ISolrQuery
} from "solr-rrr";

function App() {

  // Get the dispatch to apply changes to state such as updating parameters.
  const dispatch = useAppDispatch();

  // We get a search application from the app state, note the searchApp identifier.
  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );

  // Setup the listener for our application parameters on the application route.
  // Any parameters must be registered here if we want to see them in the app.
  const [queryParams, setQuery] = useQueryParams({
    searchText: withDefault(StringParam, ''),
    country: withDefault(ArrayParam, []),
    city: withDefault(ArrayParam, []),
    page: withDefault(StringParam, '0'),
    sort: withDefault(StringParam, ''),
    publishedTo: withDefault(StringParam, ''),
    publishedFrom: withDefault(StringParam, ''),
  });

  // A custom function we will use to preprocess the query before it is sent to the server.
  const preprocessQuery = (query: ISolrQuery) => {
    if (import.meta.env.NODE_ENV === 'production') {
      const newQuery = {...query};
      newQuery.s = query.q;
      delete newQuery.q;
      return newQuery;
    }
    else {
      return query;
    }
  }

  // We define all the filter processors we will use here. Each processor can:
  //  1. React to parameter changes (and update it's internal state)
  //  2. Make changes to the query on the basis of the parameters (& state).
  // Each processor defines a specific filter type (processQueryActions) which contains the functionality
  // and some configuration which typically determines the solr fields, the URL alias and other behaviours.
  if (!searchApp) {
    const searchFilters = {
      searchText: {
        config: {
          process: (value: string) => (!value || value === '') ? '*:*' : `first_name_s:((${value}) OR (${value}*))`,
          alias: 'searchText',
        },
        processQueryActions: [processCustomFilter.type],
        value: queryParams.searchText || ''
      },
      options: {
        config: {
          map: {
            searchText : 'Keywords',
            city: 'City',
            country: 'Country',
          }
        },
        processQueryActions: [processOptionsList.type]
      },
      published: {
        config: {
          alias: 'published',
          solrField: 'date_dt',
        },
        processQueryActions: [processDateRangeFilter.type]
      },
      country: { // type: facet filter
        config: {
          solrField: 'country_s',
          alias: 'country',
          label: 'Country',
          minCount: 1,
          sortAlpha: true,
          excludeTag: true,
        },
        processQueryActions: [
          processFacetFilter.type
        ],
        value: queryParams['country']
      },
      city: { // type: facet filter
        config: {
          solrField: 'city_s',
          alias: 'city',
          label: 'City',
          sortAlpha: true,
          minCount: 1
        },
        processQueryActions: [processFacetFilter.type],
        value: queryParams.city
      },
      page: {
        config: {
          rows: 10,
          alias: 'page',
        },
        processQueryActions: [processPager.type],
        value: queryParams.page || 0
      },
      sort: {
        config: {
          alias: 'sort',
          options: [
            {label: 'Relevance', value: ''},
            {label: 'A-Z', value: 'last_name_t asc'},
            {label: 'Z-A ', value: 'last_name_t desc'},
          ],
        },
        processQueryActions: [processSort.type],
        value: '',
      },
    };

    // Create our application
    dispatch(createApp({
      id: 'searchApp',
      endpoint: import.meta.env.VITE_SOLR_ENDPOINT as string,
      config: {
        setQuery: setQuery,
        preprocessQuery: preprocessQuery,
        // Specify a pager alias to reset page to zero on parameter changes
        pagerReset: 'page',
      },
      params: queryParams as any,
      filters: searchFilters,
    }));

    // Get initial results list when app loads
    dispatch(refreshResults({appId: 'searchApp'}));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solang Test</h1>
      </header>
      <TestSolang></TestSolang>
    </div>
  );
}

export default App;
