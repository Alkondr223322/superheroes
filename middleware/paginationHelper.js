"use strict";
exports.createPagination = (pagination, options) => {
  // Create pagination buttons
  if (!pagination) {
    return "";
  }

  var limit = pagination.limit;
  var n = 1;
  var page = parseInt(pagination.page || 0);
  var leftText = '<span aria-hidden="true">&laquo;</span>';
  var rightText = '<span aria-hidden="true">&raquo;</span>';
  var paginationClass = "pagination";

  var pageCount = Math.ceil(pagination.totalRows / pagination.limit);

  var template = '<ul class="' + paginationClass + '">';

  // ========= Previous Button ===============
  if (page === 1) {
    n = 1;
    template =
      template +
      '<li class="page-item disabled"><a class="page-link" href="?page=' +
      n +
      '" aria-label="Previous">' +
      leftText +
      "</a></li>";
  } else {
    if (page <= 1) {
      n = 1;
    } else {
      n = page - 1;
    }
    template =
      template +
      '<li class="page-item"><a class="page-link" href="?page=' +
      n +
      '" aria-label="Previous">' +
      leftText +
      "</a></li>";
  }

  // ========= Page Numbers Middle ======
  var i = 0;
  var leftCount = Math.ceil(limit / 2) - 1;
  var rightCount = limit - leftCount - 1;
  if (page + rightCount > pageCount) {
    leftCount = limit - (pageCount - page) - 1;
  }
  if (page - leftCount < 1) {
    leftCount = page - 1;
  }
  var start = page - leftCount;

  while (i < limit && i < pageCount) {
    n = start;
    if (start === page) {
      template =
        template +
        '<li class="page-item active"><a class="page-link" href="?page=' +
        n +
        '">' +
        n +
        "</a></li>";
    } else {
      template =
        template +
        '<li class="page-item"><a class="page-link" href="?page=' +
        n +
        '">' +
        n +
        "</a></li>";
    }

    start++;
    i++;
  }

  // ========== Next Button ===========
  if (page === pageCount) {
    n = pageCount;
    template =
      template +
      '<li class="page-item disabled"><a class="page-link" href="?page=' +
      n +
      '" aria-label="Next">' +
      rightText +
      "</i></a></li>";
  } else {
    if (page >= pageCount) {
      n = pageCount;
    } else {
      n = page + 1;
    }
    template =
      template +
      '<li class="page-item"><a class="page-link" href="?page=' +
      n +
      '" aria-label="Next">' +
      rightText +
      "</a></li>";
  }
  template = template + "</ul>";
  return template;
};
