import { useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getAppFromState,
  getFilterFromApp,
  setParams,
  ISolangParamList,
  SimplePager,
  SortSelect,
  FacetCheckbox,
  facetFilterGetCountsFromAppState,
  IFacetFilterState,
  SortRadio,
  OptionsList,
  DateRange,
} from 'solr-rrr';
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson.tsx";

import { RootState } from "../../store/store";

import './TestSolang.scss';
import FullPager from "solr-rrr/src/lib/components/FullPager/FullPager.tsx";


export const TestSolang = () => {

  const dispatch = useAppDispatch();

  // Application ID
  const APP_ID = 'searchApp';
  // Custom search field alias
  const FILTER_KEY = 'searchText';
  // Items per page
  const NUM_ROWS = 10;

  // Entire search application state
  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, APP_ID) );
  // Results
  const results = (searchApp && searchApp.response) ? searchApp.response.response.docs : [];
  // All facet counts
  // const facetCounts = (searchApp && searchApp.response && searchApp.response.facet_counts) ? searchApp.response.facet_counts : [];

  // Pagination
  const offset = searchApp.response?.response.start || 0;
  const numFound = searchApp.response?.response.numFound || 0;
  const currentPage = Math.ceil(offset / NUM_ROWS);
  // const numPages = Math.ceil(numFound / NUM_ROWS);

  const searchParameter = useAppSelector((state: RootState) => {
    const app = getAppFromState(state.solang, APP_ID);
    return app ? app.params[FILTER_KEY] : 'undefined';
  });

  const [getSearchString, setSearchString] = useState(searchParameter);

  const updateParams = (e: any) => {
    e.preventDefault();
    const params: ISolangParamList = {...searchApp.params};
    params[FILTER_KEY] = getSearchString;
    dispatch(setParams({appId: APP_ID, params: params}));
  }

  const resetParams = () => {
    dispatch(setParams({appId: APP_ID, params: {}}));
  }

  const today = new Date().toISOString();
  const todayAsYYYYMM = today.substring(0,7);

  return (
    <div className={'TestSolang'}>
      <PrettyPrintJson data={searchApp.params}/>

      <div className={'row'}>
        <label htmlFor='val'>Param value:</label>
        <input
          id='val'
          aria-label="Set increment amount"
          defaultValue={searchParameter}
          onChange={(e) => setSearchString(e.target.value)}
        />

        <button
          aria-label="Decrement value"
          onClick={updateParams}
        >
          Set as param
        </button>

        <button onClick={resetParams}>Reset</button>

      </div>

      <div><strong>Internal param value:</strong> {getSearchString}</div>
      <div><strong>Solang value:</strong> {searchParameter}</div>

      <DateRange
        appId={APP_ID} alias={'published'}
        id="published-date"
        type='month'
        minFrom={'1960-01'}
        maxFrom={todayAsYYYYMM}
        minTo={'1960-01'}
        maxTo={todayAsYYYYMM}
      ></DateRange>
      <FacetCheckbox
        appId={APP_ID}
        filterState={getFilterFromApp(searchApp, 'country') as IFacetFilterState}
        facetCounts={facetFilterGetCountsFromAppState(searchApp, 'country')}
        expandable={5}
        />

      <p>Showing {results.length} of {numFound} results. Page {currentPage}</p>

      <OptionsList appId={APP_ID} alias={'options'}></OptionsList>

      <label htmlFor="sort_a">Sort</label>
      <SortSelect appId={APP_ID} alias={'sort'} id="sort_a"/>

      <label>Sort Radio</label>
      <SortRadio appId={APP_ID} alias="sort" inputName={'sort-radio'}></SortRadio>

      { results && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.first_name_s} {item.last_name_s}</li>
          ))}
        </ul>
      )}

      <FullPager appId={APP_ID} alias={'page'} text={{next: '++', prev: '--'}}/>

      <SimplePager appId={APP_ID} alias={'page'}/>

      <PrettyPrintJson data={searchApp.query}/>

    </div>
  );
}
