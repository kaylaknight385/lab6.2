// import everything we need
import { 
    getProductCatalog, 
    getProductReviews, 
    getSalesReport,
    Product,
    Review,
    SalesReport
} from './apiSimulator';
import { NetworkError, DataError } from './customErrors';

console.log("starting api simulator application");
console.log("==================================");

/*
    display product information in a nice format
    this function takes a product and its reviews and shows them
*/
const showproductinfo = (product: Product, reviews: Review[]): void => {
    console.log(`product: ${product.name}`);
    console.log(`  price: $${product.price}`);
    console.log(`  id: ${product.id}`);
    
    if (reviews.length === 0) {
        console.log(`  reviews: no reviews yet`);
    } else {
        console.log(`  reviews (${reviews.length} total):`);
        // calculate average rating
        const totalrating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averagerating = totalrating / reviews.length;
        console.log(`  average rating: ${averagerating.toFixed(1)} out of 5`);
        
        // show each review
        reviews.forEach(review => {
            console.log(`    - "${review.comment}"`);
            console.log(`      by ${review.author}, rating: ${review.rating}/5`);
        });
    }
    console.log(""); // empty line for spacing
};

/*
    display sales report in a nice format
*/
const showSalesReport = (report: SalesReport): void => {
    console.log("sales report:");
    console.log("=============");
    console.log(`  time period: ${report.period}`);
    console.log(`  total sales: $${report.totalSales.toFixed(2)}`);
    console.log(`  items sold: ${report.unitsSold}`);
    console.log(`  average price: $${report.averagePrice.toFixed(2)}`);
    console.log(`  most popular: ${report.topSellingProduct}`);
    console.log("=============");
    console.log(""); // empty line
};

/*
    handle errors properly
    this function decides what message to show based on error type
*/
const handleerror = (error: unknown, where: string): void => {
    if (error instanceof NetworkError) {
        console.log(`network problem (${where}): ${error.message}`);
        console.log("  tip: check your internet connection and try again");
    } else if (error instanceof DataError) {
        console.log(`data problem (${where}): ${error.message}`);
        console.log("  tip: the requested information might not exist");
    } else if (error instanceof Error) {
        console.log(`error (${where}): ${error.message}`);
    } else {
        console.log(`unknown problem (${where}): ${String(error)}`);
    }
};

/*
    main application logic
    this is where we run our program
*/
const runprogram = (): void => {
    console.log("step 1: getting product list...");
    
    // first, get all products
    getProductCatalog()
        .then((products: Product[]) => {
            console.log(`success! found ${products.length} products`);
            console.log(""); // empty line
            
            // for each product, get its reviews
            const reviewpromises = products.map(product => 
                getProductReviews(product.id)
                    .then(reviews => ({
                        product,
                        reviews
                    }))
                    .catch(error => {
                        handleerror(error, `getting reviews for ${product.name}`);
                        // if we can't get reviews, show product without reviews
                        return {
                            product,
                            reviews: [] as Review[]
                        };
                    })
            );
            
            // wait for all reviews to load
            return Promise.all(reviewpromises);
        })
        .then((productswithreviews) => {
            // show all products and their reviews
            console.log("product catalog:");
            console.log("===============");
            console.log("");
            
            productswithreviews.forEach(({ product, reviews }) => {
                showproductinfo(product, reviews);
            });
            
            // now get the sales report
            console.log("step 2: getting sales report...");
            return getSalesReport();
        })
        .then((salesReport: SalesReport) => {
            showSalesReport(salesReport);
        })
        .catch((error: unknown) => {
            handleerror(error, "main program");
            console.log("program stopped because of an error.");
        })
        .finally(() => {
            // this always runs, whether there was an error or not
            console.log("==================================");
            console.log("all api calls have been completed");
            console.log("program finished");
            console.log("==================================");
        });
};

// start it uppp
runprogram();