import { ISortState, sortProcessParams, sortProcessQuery } from "./Sort";
import { createEmptySolrQuery } from "../store/solang.slice";
import { SolangState } from "../solang.types";

describe('Sort Filter ', () => {

  const APP_ID = 'test_app';
  const F_ALIAS = 'f_alias';

  const createInitState = () => {
    return {
      config: {},
      apps: {
        [APP_ID]: {
          id: APP_ID,
          query: createEmptySolrQuery(),
          endpoint: 'http://localhost:8983/solr/solang/',
          params: {},
          filters: {},
          response: {
            responseHeader: {},
            response: {
              numFound: 0,
              start: 0,
              docs: []
            },
          }
        }
      }
    } as SolangState;
  }

  // default to score

  it('should fallback filter value to empty string', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];
    app.filters[F_ALIAS] = {
      config: {
        alias: F_ALIAS,
        options: [
          {
            label: 'Relevance',
            value: 'score'
          },
        ],
      },
      processQueryActions: [],
      value: ''
    };

    const params = {};
    sortProcessParams(app, F_ALIAS, params);
    expect(app.filters[F_ALIAS].value).toEqual('');
  });

  it('should fallback query to undefined', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];
    app.filters[F_ALIAS] = {
      config: {
        alias: F_ALIAS,
        options: [
          {
            label: 'Relevance',
            value: 'score'
          },
        ],
      },
      processQueryActions: [],
      value: ''
    };
    const params = {};
    const query = createEmptySolrQuery();

    sortProcessParams(app, F_ALIAS, params);
    sortProcessQuery(app.filters[F_ALIAS], query);


    expect(query.sort).toEqual(undefined);

  });

  it('should apply custom default if defined', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];

    app.filters[F_ALIAS] = {
      config: {
        alias: F_ALIAS,
        default: 'Alpha',
        options: [
          {
            label: 'Relevance',
            value: 'score'
          },
          {
            label: 'Alpha',
            value: 't_name asc'
          },
        ],
      },
      processQueryActions: [],
      value: []
    };

    const params = {};
    const query = createEmptySolrQuery();

    sortProcessParams(app, F_ALIAS, params);
    sortProcessQuery(app.filters[F_ALIAS], query);

    expect(query.sort).toEqual('t_name asc');

  });

  it('should apply sort chosen in params', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];

    app.filters[F_ALIAS] = {
      config: {
        alias: F_ALIAS,
        default: 'Relevance',
        options: [
          {
            label: 'Relevance',
            value: 'score'
          },
          {
            label: 'Alpha',
            value: 't_name asc'
          }
        ],
      },
      processQueryActions: [],
      value: []
    };

    const params = {
      [F_ALIAS]: 't_name asc'
    };
    const query = createEmptySolrQuery();

    sortProcessParams(app, F_ALIAS, params);
    sortProcessQuery(app.filters[F_ALIAS], query);

    expect(query.sort).toEqual('t_name asc');

  });
});
