// Helper to call a given function, only once
export default () => {
  let called = false;

  return () => {
    if (!called) {
      called = true;
      cb();
    }
  };
};
