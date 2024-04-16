import { ISolangApp, ISolrQuery } from "./solang.types";

import { ajax } from 'rxjs/ajax';

/**
 * Creates a solr query observable from the applications query object.
 * @param app
 */
export const createSolrQueryObs = function(app: ISolangApp) {

  const query: ISolrQuery = {...app.query};

  let params = prepareQuery(query);

  if (app.config?.preprocessQuery) {
    params = app.config?.preprocessQuery(params);
  }

  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(arrayValue => urlParams.append(key, arrayValue))
    }
    else {
      urlParams.append(key, value as string);
    }
  });

  const queryUrl = `${app.endpoint}?${urlParams.toString()}`

  const ajax$ = ajax({
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
    url: queryUrl,
    method: 'GET',
  });

  return ajax$;
}

/**
 * Prepare solr query object parameters.
 * @param query
 */
export const prepareQuery = function(query: ISolrQuery) {

  const params: any = {...query};

  if (params.filter === {}) {
    delete params.filter;
  }

  if (!params.q) params.q = '*';

  // Give us nested list json
  params.wt = 'json';
  // Prepare json.facet
  if (params['json.facet'] && typeof params['json.facet'] === 'object') {
    const json = JSON.stringify(params['json.facet']);
    params['json.facet'] = json;
  }

  if (params.legacy) {
    Object.keys(params.legacy).forEach( key => {
      params[key] = params.legacy[key];
    });
    delete params.legacy;
  }

  return params;
}
