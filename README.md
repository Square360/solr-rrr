# Solr RRR

Solr + Reactive + Redux + React

## What?

This is a framework for building applications which interact with a solr backend.
It uses uses [Redux Observable](https://redux-observable.js.org/) to provide responsive asynchronous operation.

## Instructions

The test site `sites/solr-test` provides a local site with which to test the components. The library itself is 
contained in `packages/solr-rrr`

Compile the library with `yarn build` (in library directory).

Run the test site `yarn dev` (in site directory) to test the components in context.

From the library directory, `npm publish` to push any changes to the repository.


