exports.calcPage = (options) => {
  //determine which superheroes we should display
  return (
    options.hash.heroInd < options.hash.page * 5 &&
    options.hash.heroInd >= (options.hash.page - 1) * 5
  );
};
