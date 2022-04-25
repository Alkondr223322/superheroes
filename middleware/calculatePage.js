exports.calcPage = (options) => {
    return (options.hash.heroInd < options.hash.page*5) && (options.hash.heroInd >= (options.hash.page-1) * 5);
}