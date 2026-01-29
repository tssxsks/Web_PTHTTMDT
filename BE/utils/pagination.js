/**
 * Helper function for pagination
 * @param {number} page - Current page (default: 1)
 * @param {number} limit - Results per page (default: 10)
 * @param {number} totalItems - Total number of items
 * @returns {Object} - Pagination details
 */
const getPagination = (page = 1, limit = 10, totalItems) => {
  // Convert string params to numbers
  page = parseInt(page);
  limit = parseInt(limit);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);
  
  // Calculate skip value for database
  const skip = (page - 1) * limit;
  
  return {
    page,
    limit,
    skip,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

export { getPagination };