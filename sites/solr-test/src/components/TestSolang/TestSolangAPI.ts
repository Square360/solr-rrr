// A mock function to mimic making an async request for data
export function mockQuerySolr(query: any = {}) {
  return new Promise<{}>((resolve) =>
    setTimeout(() => resolve({ data: {results: [
          {
            name: 'Michael',
            surname: 'Barrymore'
          },
          {
            name: 'Kenny',
            surname: 'Everett'
          }
    ]} }), 500)
  );
}
