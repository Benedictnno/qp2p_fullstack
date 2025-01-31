
import { useEffect } from "react";
import { DateFormater } from "@/utils/Date.tsx";
import { useDispatch, useSelector } from "react-redux";
import { transactions } from "@/States/thunks/transactions";
import { AppDispatch, RootState } from "@/States/store";
import { addCommasToNumber } from "@/utils/formatNumbers";

function TransactionHistory() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(transactions());
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const { history, error, loading } = useSelector(
    (state: RootState) => state.transactions
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching transactions: {error}</div>;
  }

  const sortedHistory = [...history]?.sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Sender's Name
            </th>
            <th scope="col" className="px-6 py-3">
              Token
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Fiat Amount (NGN)
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory?.length ? (
            sortedHistory.map((item, index) => (
              <tr
                key={index} // Replace with a unique identifier
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.token || "N/A"}</td>
                <td className="px-6 py-4">{item.quantity || "N/A"}</td>
                <td className="px-6 py-4">{item.status || "N/A"}</td>
                <td className="px-6 py-4">
                  {addCommasToNumber(item.amount) || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {DateFormater(item.createdAt) || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
