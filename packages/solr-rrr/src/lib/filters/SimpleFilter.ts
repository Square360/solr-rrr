import { ISolangParamList, ISolrQuery } from "../solang.types";
import { IFacetFilterState } from "./FacetFilter";

export function simpleFilterProcessParams (filterState: IFacetFilterState, params: ISolangParamList) {
  const alias = filterState.config.alias;

  if ( Array.isArray( params[ alias ] ) ) {
    filterState.value = params[ alias ] as string[];
    filterState.hasValue = true;
  }
  else if ( params[ alias ] ) {
    filterState.value = [ params[ alias ] as string ];
    filterState.hasValue = true;
  }
  else {
    filterState.value = [];
    filterState.hasValue = false;
  }
}

export function simpleFilterProcessQuery (filterState: IFacetFilterState, query: ISolrQuery) {
  const solrField = filterState.config.solrField;
  const field = solrField === 'q' ? '' : `${solrField}:`
  query.q = filterState.hasValue ? `${field}${filterState.value[0]}*` : '*';
}
