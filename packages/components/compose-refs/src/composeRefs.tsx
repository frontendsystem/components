import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

// callback refs & RefObject(s) are taken care of.

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    // why !ref cannot be used??
    (ref as React.MutableRefObject<T>).current = value;
  }
}

// compose refs together
function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

// custom hook to compose refs

function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };