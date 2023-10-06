const debounce = (callback, delay) => {
  let timeout;

  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback();
    }, delay);
  };
};

const debouncedClick = debounce(() => {
  console.log('Clicked');
}, 1000);

debouncedClick();