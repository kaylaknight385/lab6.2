"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import everything we need
var apiSimulator_1 = require("./apiSimulator");
var customErrors_1 = require("./customErrors");
console.log("starting api simulator application");
console.log("==================================");
/*
    display product information in a nice format
    this function takes a product and its reviews and shows them
*/
var showproductinfo = function (product, reviews) {
    console.log("product: ".concat(product.name));
    console.log("  price: $".concat(product.price));
    console.log("  id: ".concat(product.id));
    if (reviews.length === 0) {
        console.log("  reviews: no reviews yet");
    }
    else {
        console.log("  reviews (".concat(reviews.length, " total):"));
        // calculate average rating
        var totalrating = reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
        var averagerating = totalrating / reviews.length;
        console.log("  average rating: ".concat(averagerating.toFixed(1), " out of 5"));
        // show each review
        reviews.forEach(function (review) {
            console.log("    - \"".concat(review.comment, "\""));
            console.log("      by ".concat(review.author, ", rating: ").concat(review.rating, "/5"));
        });
    }
    console.log(""); // empty line for spacing
};
/*
    display sales report in a nice format
*/
var showSalesReport = function (report) {
    console.log("sales report:");
    console.log("=============");
    console.log("  time period: ".concat(report.period));
    console.log("  total sales: $".concat(report.totalSales.toFixed(2)));
    console.log("  items sold: ".concat(report.unitsSold));
    console.log("  average price: $".concat(report.averagePrice.toFixed(2)));
    console.log("  most popular: ".concat(report.topSellingProduct));
    console.log("=============");
    console.log(""); // empty line
};
/*
    handle errors properly
    this function decides what message to show based on error type
*/
var handleerror = function (error, where) {
    if (error instanceof customErrors_1.NetworkError) {
        console.log("network problem (".concat(where, "): ").concat(error.message));
        console.log("  tip: check your internet connection and try again");
    }
    else if (error instanceof customErrors_1.DataError) {
        console.log("data problem (".concat(where, "): ").concat(error.message));
        console.log("  tip: the requested information might not exist");
    }
    else if (error instanceof Error) {
        console.log("error (".concat(where, "): ").concat(error.message));
    }
    else {
        console.log("unknown problem (".concat(where, "): ").concat(String(error)));
    }
};
/*
    main application logic
    this is where we run our program
*/
var runprogram = function () {
    console.log("step 1: getting product list...");
    // first, get all products
    (0, apiSimulator_1.fetchProductCatalog)()
        .then(function (products) {
        console.log("success! found ".concat(products.length, " products"));
        console.log(""); // empty line
        // for each product, get its reviews
        var reviewpromises = products.map(function (product) {
            return (0, apiSimulator_1.fetchProductReviews)(product.id)
                .then(function (reviews) { return ({
                product: product,
                reviews: reviews
            }); })
                .catch(function (error) {
                handleerror(error, "getting reviews for ".concat(product.name));
                // if we can't get reviews, show product without reviews
                return {
                    product: product,
                    reviews: []
                };
            });
        });
        // wait for all reviews to load
        return Promise.all(reviewpromises);
    })
        .then(function (productswithreviews) {
        // show all products and their reviews
        console.log("product catalog:");
        console.log("===============");
        console.log("");
        productswithreviews.forEach(function (_a) {
            var product = _a.product, reviews = _a.reviews;
            showproductinfo(product, reviews);
        });
        // now get the sales report
        console.log("step 2: getting sales report...");
        return (0, apiSimulator_1.fetchSalesReport)();
    })
        .then(function (salesReport) {
        showSalesReport(salesReport);
    })
        .catch(function (error) {
        handleerror(error, "main program");
        console.log("program stopped because of an error.");
    })
        .finally(function () {
        // this always runs, whether there was an error or not
        console.log("==================================");
        console.log("all api calls have been completed");
        console.log("program finished");
        console.log("==================================");
    });
};
// start it uppp
runprogram();
