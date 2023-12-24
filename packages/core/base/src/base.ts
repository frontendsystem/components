function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  customEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (!checkForDefaultPrevented || !(event as Event).defaultPrevented) {
      return customEventHandler?.(event);
    }
  };
}

export { composeEventHandlers };
