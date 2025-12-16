"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProductDetails = exports.fetchSalesReport = exports.fetchProductReviews = exports.fetchProductCatalog = void 0;
var customErrors_1 = require("./customErrors");
/**
 * simulates fetching a list of products with a 1-second delay
 * has a 20% chance of failure (NetworkError)
 */
var fetchProductCatalog = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (Math.random() < 0.8) {
                // simulate successful response
                var products = [
                    { id: 1, name: 'MacBook Pro 16"', price: 2499 },
                    { id: 2, name: "Sony WH-1000XM5 Headphones", price: 399 },
                    { id: 3, name: "iPhone 15 Pro", price: 999 },
                    { id: 4, name: "Samsung 4K Monitor", price: 599 },
                    { id: 5, name: "Logitech MX Keys", price: 129 },
                ];
                resolve(products);
            }
            else {
                reject(new customErrors_1.NetworkError("Failed to fetch product catalog: Network timeout"));
            }
        }, 1000);
    });
};
exports.fetchProductCatalog = fetchProductCatalog;
/**
 * fetching reviews for a specific product with a 1.5-second delay
 * has a 25% chance of failure (DataError if product doesn't exist, NetworkError otherwise)
 */
var fetchProductReviews = function (productId) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var random = Math.random();
            if (random < 0.75) {
                // simulate successful response with mock reviews
                var mockReviews = [
                    {
                        id: 1,
                        productId: productId,
                        author: "Alex Johnson",
                        rating: 5,
                        comment: "Excellent product! Highly recommended.",
                        date: "2024-01-15",
                    },
                    {
                        id: 2,
                        productId: productId,
                        author: "Sam Wilson",
                        rating: 4,
                        comment: "Good quality, but delivery was slow.",
                        date: "2024-01-10",
                    },
                    {
                        id: 3,
                        productId: productId,
                        author: "Taylor Smith",
                        rating: 3,
                        comment: "Average product. Does what it says.",
                        date: "2024-01-05",
                    },
                ];
                // soooooometimes return empty reviews for certain products
                if (productId === 3) {
                    resolve([]); // product has no reviews yet
                }
                else {
                    resolve(mockReviews);
                }
            }
            else if (random < 0.85) {
                reject(new customErrors_1.DataError("Failed to fetch reviews: Product ID ".concat(productId, " not found")));
            }
            else {
                reject(new customErrors_1.NetworkError("Failed to fetch reviews for product ID ".concat(productId, ": Server error")));
            }
        }, 1500);
    });
};
exports.fetchProductReviews = fetchProductReviews;
/**
 * simulates fetching sales report with a 1-second delay
 */
var fetchSalesReport = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (Math.random() < 0.85) {
                // simulate successful response
                var report = {
                    totalSales: 85420.5,
                    unitsSold: 342,
                    averagePrice: 249.77,
                    topSellingProduct: 'MacBook Pro 16"',
                    period: "January 2024",
                };
                resolve(report);
            }
            else {
                reject(new customErrors_1.NetworkError("Failed fetching sales report: Database connection failed"));
            }
        }, 1000);
    });
};
exports.fetchSalesReport = fetchSalesReport;
/**
 * additional function: fetch product details by ID
 */
var fetchProductDetails = function (productId) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (Math.random() < 0.9) {
                var products = [
                    { id: 1, name: 'MacBook Pro 16"', price: 2499 },
                    { id: 2, name: "Sony WH-1000XM5 Headphones", price: 399 },
                    { id: 3, name: "iPhone 15 Pro", price: 999 },
                    { id: 4, name: "Samsung 4K Monitor", price: 599 },
                    { id: 5, name: "Logitech MX Keys", price: 129 },
                ];
                var product = products.find(function (p) { return p.id === productId; });
                if (product) {
                    resolve(product);
                }
                else {
                    reject(new customErrors_1.DataError("Product with ID ".concat(productId, " not found")));
                }
            }
            else {
                reject(new customErrors_1.NetworkError("Failed to fetch product details"));
            }
        }, 800);
    });
};
exports.fetchProductDetails = fetchProductDetails;
