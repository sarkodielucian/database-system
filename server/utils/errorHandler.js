// Global error handler middleware for returning arrays on errors
const handleArrayResponse = (res, data, error) => {
    if (error) {
        console.error('Error:', error);
        return res.json([]);  // Return empty array instead of error object
    }
    return res.json(data || []);
};

module.exports = { handleArrayResponse };
