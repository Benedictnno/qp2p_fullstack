import dotenv from "dotenv";
import https from "https";
dotenv.config();

const resolveBankAccount = (accountNumber, bankCode) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SECRET}`,
      },
      timeout: 5000, // 5 seconds timeout
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(parsedData);
          }
        } catch (error) {
          reject({ message: "Invalid JSON response", error });
        }
      });
    });

    req.on("error", (error) => {
      if (error.code === "ECONNRESET") {
        reject({ message: "Connection reset by server", error });
      } else {
        reject({ message: "Request failed", error });
      }
    });

    req.on("timeout", () => {
      req.destroy();
      reject({ message: "Request timed out" });
    });

    req.end();
  });
};

// resolveBankAccount("", "");
const createTransferRecipient = (recipientDetails) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify(recipientDetails);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transferrecipient",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SECRET}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData); // Resolve with successful response
          } else {
            reject(parsedData); // Reject with API error response
          }
        } catch (error) {
          reject({ message: "Invalid JSON response", error });
        }
      });
    });

    req.on("error", (error) => {
      reject({ message: "Request failed", error });
    });

    req.write(params);
    req.end();
  });
};

const resolveAcct = async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  
  // Validate input
  
  if (!accountNumber || !bankCode) {
    return res
      .status(400)
      .json({ message: "Account number and bank code are required." });
  }

  try {
    
  
    const result = await resolveBankAccount(accountNumber, bankCode);
    const transferRecipient = await createTransferRecipient({
      type: "nuban",
      name: result.data.account_name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "NGN",
    });

    res.status(200).json({ result, transferRecipient }); // Send the resolved account details
  } catch (error) {
    res.status(500).json({
      message: "Failed to resolve bank account",
      error: error.message || error,
    });
  }
};
// Example Usage
//  resolveBankAccount("7073502362", "999992")
//   .then((response) => {
//     console.log("Account Details:", response);
//   })
//   .catch((error) => {
//     console.error("Error resolving account:", error);
//   });

export { resolveAcct };
