import { request } from "https";
import dotenv from "dotenv";
dotenv.config()
const getBanks = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/bank",
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    };

    const req = request(options, (res) => {
      let data = "";

      // Collect response data
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Handle response completion
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData); // Return successful response
          } else {
            reject(parsedData); // Return API error response
          }
        } catch (error) {
          reject({ message: "Invalid JSON response", error });
        }
      });
    });

    // Handle request errors
    req.on("error", (error) => {
      reject({ message: "Request failed", error });
    });

    req.end(); // Finalize request
  });
};


const getBank= async (req, res) => {
  try {
    const banks = await getBanks(); // Fetch banks
    res.status(200).json(banks); // Send as response
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banks",
      error: error.message || error,
    });
  }
};

// Example usage
// (async () => {
//   try {
//     const banks = await getBanks();
//     console.log("Banks:", banks);
//   } catch (error) {
//     console.error("Error retrieving banks:", error);
//   }
// })();

export default getBank;
