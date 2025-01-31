import { format } from "date-fns";

interface Transaction {
  name: string;
  token: string;
  quantity: number;
  status: string;
  amount: number;
  createdAt: string; // ISO date string
}

interface ChartData {
  month: string;
  Received: number;
  sent: number;
}

export function formatDataForBarChart(transactions: Transaction[]): ChartData[] {
  const monthMap: { [key: string]: { Received: number; sent: number } } = {};

  transactions.forEach((transaction) => {
    const month = format(new Date(transaction.createdAt), "MMMM");

    if (!monthMap[month]) {
      monthMap[month] = { Received: 0, sent: 0 };
    }

    // Example logic: Aggregate based on conditions
    if (transaction.status === "Received") {
      monthMap[month].Received += 1
    //   transaction.quantity;
    } else if (transaction.status === "sent") {
      monthMap[month].sent += 1;
    }
  });

  // Convert the monthMap object to an array
  return Object.entries(monthMap).map(([month, data]) => ({
    month,
    Received: data.Received,
    sent: data.sent,
  }));
}

// Example usage:
// const transactions: Transaction[] = [
//   {
//     name: "Alice",
//     token: "desktop",
//     quantity: 100,
//     status: "completed",
//     amount: 200,
//     createdAt: "2025-01-02",
//   },
//   {
//     name: "Bob",
//     token: "mobile",
//     quantity: 50,
//     status: "completed",
//     amount: 100,
//     createdAt: "2025-01-15",
//   },
//   {
//     name: "Charlie",
//     token: "desktop",
//     quantity: 120,
//     status: "completed",
//     amount: 300,
//     createdAt: "2025-02-10",
//   },
//   {
//     name: "David",
//     token: "mobile",
//     quantity: 70,
//     status: "completed",
//     amount: 150,
//     createdAt: "2025-02-18",
//   },
// ];

// const chartData = formatDataForBarChart(transactions);
// console.log(chartData);
