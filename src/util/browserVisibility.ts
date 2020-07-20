/**
 * Functionality to help keep track of browser visibility.
 * This will allow for callbacks to be triggerd when the window or tab
 * are unfocused and then refocused.
 */

export const browserVisibility = (
  handleChangeCallback: (isHidden: boolean) => void
): void => {
  // Warn if the browser doesn't support addEventListener or the Page Visibility API
  // Set the name of the hidden property and the change event for visibility
  let hidden, visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  }

  if (
    typeof document.addEventListener === 'undefined' ||
    hidden === undefined
  ) {
    console.warn('This browser does not support event listeners.');
  } else {
    // Handle page visibility change
    document.addEventListener(
      visibilityChange,
      () => {
        const isHidden: boolean = document[hidden];
        handleChangeCallback(isHidden);
      },
      false
    );
  }
};
