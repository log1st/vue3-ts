export const arrayFrom = (source: Array<any> | any) => (
  source instanceof Array ? source : [source]
);

export const getDeepField = (
  object: Record<any, any>,
  field: any,
  delimiter = '.',
) => field.split(delimiter).reduce((acc: any, cur: any) => acc?.[cur], object);

export const isEqual = (a: any, b: any) => {
  let typeofa; let typeofb; let i; let len; let
    key;

  if (a === b) return true;

  // eslint-disable-next-line no-param-reassign
  typeofa = a === null ? 'null' : typeof (a = a ? a.valueOf() : a);
  // eslint-disable-next-line no-param-reassign
  typeofb = b === null ? 'null' : typeof (b = b ? b.valueOf() : b);

  if (typeofa !== typeofb) return false;

  // eslint-disable-next-line default-case
  switch (typeofa) {
    case 'string':
    case 'boolean':
    case 'number':
    case 'functon':
    case 'undefined':
    case 'null':
      return a === b;
  }

  // Convert the native type to a string. This allows us to test
  // if either a or b are Arrays and then handle accordingly.
  typeofa = ({}).toString.call(a);
  typeofb = ({}).toString.call(b);

  if (typeofa === typeofb) {
    // Compare the items of two arrays
    if (typeofa === '[object Array]') {
      if (a?.length !== b?.length) return false;

      len = a?.length;
      for (i = 0; i < len; i += 1) {
        if (!isEqual(a[i], b[i])) return false;
      }
      // Compare the keys of two objects
    } else {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (key in a) {
        if (!(key in b)) return false;

        if (!isEqual(a[key], b[key])) return false;
      }
    }
  } else {
    return false;
  }

  return true;
};
