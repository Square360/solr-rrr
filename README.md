# Solr RRR

Solr + Reactive + Redux + React

## What?

This is a framework for building applications which interact with a solr backend.
It uses [Redux Observable](https://redux-observable.js.org/) to provide responsive asynchronous operation.
    
## Instructions

The test site `sites/solr-test` provides a local site with which to test the components. The library itself is 
contained in `packages/solr-rrr`

To develop applications we recommend: 
1. Run the test site `yarn dev` (in site directory) to test the components in context. 
2. Concurrently compile the library with `yarn watch_build` (in library directory).

Once you have committed changes back to the repo, publish to npm by running `npm publish` from the library directory.

