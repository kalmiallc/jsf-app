export function getUrlQuery() {
  const queryDict = {};
  location.search.substr(1)
    .split('&')
    .forEach(function (item) { queryDict[decodeURIComponent(item.split('=')[0])] = decodeURIComponent(item.split('=')[1]); });
  delete queryDict[''];
  return queryDict;
}
