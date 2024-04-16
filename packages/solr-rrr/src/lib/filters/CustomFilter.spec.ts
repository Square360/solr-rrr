import {createEmptySolrQuery} from "../store/solang.slice";
import {customFilterProcessParams, customFilterProcessQuery} from "./CustomFilter";

describe('SimpleFilter', () => {

  const APP_ID = 'test_app';
  const F_ALIAS = 'simplefilter';

  const createInitState = () => {
    return {
      config: {},
      apps: {
        [APP_ID]: {
          id: APP_ID,
          query: createEmptySolrQuery(),
          endpoint: 'http://localhost:8983/solr/solang/',
          params: {},
          filters: {
            [F_ALIAS]: {
              config: {
                alias: F_ALIAS,
              },
              processQueryActions: [],
              value: []
            }
          },
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
    }
  };

  it('should default value to empty string', () => {
    const state = createInitState();
    const app = state.apps[APP_ID];
    customFilterProcessParams(app, F_ALIAS, {});
    expect(app.filters[F_ALIAS].value).toEqual('');
  });

  it('should extract value from parameters', () => {
    const state = createInitState();
    const app = state.apps[APP_ID];
    const params = {
      [F_ALIAS]: 'some value'
    }
    customFilterProcessParams(app, F_ALIAS, params);
    expect(app.filters[F_ALIAS].value).toEqual('some value');
  });

  it('should use custom function to process query', () => {
    const filterState = {
      config: {
        alias: F_ALIAS,
        process: (value: string) => `${value}*`
      },
      processQueryActions: [],
      value: 'text'
    };
    const query = createEmptySolrQuery();
    customFilterProcessQuery(filterState, query);
    expect(query.q).toEqual('text*');
  });

})

