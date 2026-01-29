// Redis configuration removed

// Mock client to prevent import errors
const redisClient = {
  on: () => {},
  connect: async () => {},
  set: async () => {},
  get: async () => {},
  del: async () => {}
};

// Helper function to set data in cache with expiration
const setCache = async () => true;

// Helper function to get data from cache
const getCache = async () => null;

// Helper function to delete cache
const deleteCache = async () => true;

export { redisClient, setCache, getCache, deleteCache };