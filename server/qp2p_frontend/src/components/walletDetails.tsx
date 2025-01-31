import { AppDispatch, RootState } from "@/States/store";
import { TonAddress, TonMnemonics } from "@/States/thunks/CryptoDetails";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";

function WalletDetails() {
  const dispatch: AppDispatch = useDispatch();
  const [copied, setCopied] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.login);

  // Retrieve the saved user from sessionStorage, fallback to Redux user if null
  const Id = useMemo(() => {
    const User = localStorage.getItem("user");
    return User ? JSON.parse(User) : user;
  }, [user]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  useEffect(() => {
    dispatch(TonAddress(Id.user.id));
    dispatch(TonMnemonics());
  }, []);

  const {
    walletAddress,
    loading: walletLoading,
    error: walletError,
  } = useSelector((state: RootState) => state.tonAddress);
  const {
    mnemonics,
    loading: mnemonicsLoading,
    error: mnemonicsError,
  } = useSelector((state: RootState) => state.tonMnemonics);

  const mnemonicsArray = mnemonics ? mnemonics.split(" ") : [];

  return (
    <div className="flex flex-col justify-items-center items-center">
      <h1 className="block font-medium mb-2">Ton Wallet Details</h1>

      {/* Wallet Address */}
      {walletLoading ? (
        <p>Loading wallet address...</p>
      ) : walletError ? (
        <p className="error-text">Failed to fetch wallet address</p>
      ) : (
        <h3 className="wallet-address">
          Wallet Address : {walletAddress || "No address available"}
          <Button
            variant="outline"
            className="ml-2 self-center"
            onClick={() => handleCopy(walletAddress)}
          >
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </h3>
      )}

      {/* Mnemonics */}
      {mnemonicsLoading ? (
        <p>Loading mnemonics...</p>
      ) : mnemonicsError ? (
        <p className="error-text">Failed to fetch mnemonics</p>
      ) : (
        <div className=" flex flex-col justify-items-center items-center w-full my-5">
          <h1 className="block font-medium my-3">Ton Wallet Mnemonic</h1>
          {mnemonicsArray.length > 0 ? (
            <ol
              type="1"
              className="grid grid-cols-4 max-sm:grid-cols-3 gap-4 self-center"
            >
              {mnemonicsArray.map((word, index) => (
                <li key={index}>
                  {index + 1} {word}
                </li>
              ))}
            </ol>
          ) : (
            <p>No mnemonics available</p>
          )}
          <Button
            variant="outline"
            className="w-8/12 my-3 self-center"
            onClick={() => handleCopy(mnemonics)}
          >
            <span>{copied ? "Copied!" : "Copy All"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default WalletDetails;
