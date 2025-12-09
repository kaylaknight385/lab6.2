import { NetworkError, DataError, ValidationError } from "./customErrors";

// defining interface
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SalesReport {
  totalSales: number;
  unitsSold: number;
  averagePrice: number;
  topSellingProduct: string;
  period: string;
}

/**
 * simulates fetching a list of products with a 1-second delay
 * has a 20% chance of failure (NetworkError)
 */
export const fetchProductCatalog = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        // simulate successful response
        const products: Product[] = [
          { id: 1, name: 'MacBook Pro 16"', price: 2499 },
          { id: 2, name: "Sony WH-1000XM5 Headphones", price: 399 },
          { id: 3, name: "iPhone 15 Pro", price: 999 },
          { id: 4, name: "Samsung 4K Monitor", price: 599 },
          { id: 5, name: "Logitech MX Keys", price: 129 },
        ];
        resolve(products);
      } else {
        reject(
          new NetworkError("Failed to fetch product catalog: Network timeout")
        );
      }
    }, 1000);
  });
};

/**
 * fetching reviews for a specific product with a 1.5-second delay
 * has a 25% chance of failure (DataError if product doesn't exist, NetworkError otherwise)
 */
export const fetchProductReviews = (productId: number): Promise<Review[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();

      if (random < 0.75) {
        // simulate successful response with mock reviews
        const mockReviews: Review[] = [
          {
            id: 1,
            productId,
            author: "Alex Johnson",
            rating: 5,
            comment: "Excellent product! Highly recommended.",
            date: "2024-01-15",
          },
          {
            id: 2,
            productId,
            author: "Sam Wilson",
            rating: 4,
            comment: "Good quality, but delivery was slow.",
            date: "2024-01-10",
          },
          {
            id: 3,
            productId,
            author: "Taylor Smith",
            rating: 3,
            comment: "Average product. Does what it says.",
            date: "2024-01-05",
          },
        ];

        // soooooometimes return empty reviews for certain products
        if (productId === 3) {
          resolve([]); // product has no reviews yet
        } else {
          resolve(mockReviews);
        }
      } else if (random < 0.85) {
        reject(
          new DataError(
            `Failed to fetch reviews: Product ID ${productId} not found`
          )
        );
      } else {
        reject(
          new NetworkError(
            `Failed to fetch reviews for product ID ${productId}: Server error`
          )
        );
      }
    }, 1500);
  });
};

/**
 * simulates fetching sales report with a 1-second delay
 */
export const fetchSalesReport = (): Promise<SalesReport> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.85) {
        // simulate successful response
        const report: SalesReport = {
          totalSales: 85420.5,
          unitsSold: 342,
          averagePrice: 249.77,
          topSellingProduct: 'MacBook Pro 16"',
          period: "January 2024",
        };
        resolve(report);
      } else {
        reject(
          new NetworkError(
            "Failed fetching sales report: Database connection failed"
          )
        );
      }
    }, 1000);
  });
};

/**
 * additional function: fetch product details by ID
 */
export const fetchProductDetails = (productId: number): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        const products: Product[] = [
          { id: 1, name: 'MacBook Pro 16"', price: 2499 },
          { id: 2, name: "Sony WH-1000XM5 Headphones", price: 399 },
          { id: 3, name: "iPhone 15 Pro", price: 999 },
          { id: 4, name: "Samsung 4K Monitor", price: 599 },
          { id: 5, name: "Logitech MX Keys", price: 129 },
        ];

        const product = products.find((p) => p.id === productId);

        if (product) {
          resolve(product);
        } else {
          reject(new DataError(`Product with ID ${productId} not found`));
        }
      } else {
        reject(new NetworkError("Failed to fetch product details"));
      }
    }, 800);
  });
};
