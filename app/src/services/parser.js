export const parseSearchParams = createParser('=', '&');

function createParser(keyValueSeparator, entrySeparator) {
  return function (string) {
    if (!string) return undefined;
    let result = {};

    let entries = string.split(entrySeparator);
    for (let i = 0; i < entries.length; ++i) {
      let keyValue = entries[i].split(keyValueSeparator);
      let key = decodeURIComponent(keyValue[0].trim());

      let value = undefined;
      if (keyValue.length > 1) {
        value = decodeURIComponent(keyValue[1].trim());
      }

      result[key] = value;
    }

    return result;
  };
}
