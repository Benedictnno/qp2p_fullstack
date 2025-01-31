import { AppDispatch, RootState } from "@/States/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCommasToNumber } from "@/utils/formatNumbers";
import { getAllBanks, verifyBank } from "@/States/thunks/Banks";
import { sendFiat } from "@/States/thunks/SendFiat";

interface BuyerUserData {
  userData: {
    tonRate: number;
    usdtRate: number;
    user: string; // Assuming this is a vendor ID or identifier
  };
  loading: boolean;
}

type FormData = {
  coin: string;
  sendersAddress: string;
  amount: string;
};

function SellCrypto() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [receivingCoin, setReceivingCoin] = useState<string>("");
  const [receivingBalance, setReceivingBalance] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [acctData, setAcctData] = useState({
    acctNumber: "",
    bankCode: "",
  });

  const dispatch: AppDispatch = useDispatch();
  const {
    userData: { user, tonRate, usdtRate },
  } = useSelector(
    (state: RootState) => state.getBuyerUserData as BuyerUserData
  );

  const schema: ZodType<FormData> = z.object({
    coin: z.string(),
    sendersAddress: z.string(),
    amount: z.string(),
  });

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const getWalletAddress = async () => {
    const wallet = await axios.get(
      `http://localhost:5000/api/v1/crypto/TonAddress/${user}`
    );

    setWalletAddress(wallet.data.walletAddress);
  };

 
  useEffect(() => {
    getWalletAddress();
    dispatch(getAllBanks());
  }, []);
  const { allBanks } = useSelector((state: RootState) => state.AllBanks);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAcctData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitBankDEetails = () => {
    dispatch(
      verifyBank({
        accountNumber: acctData.acctNumber,
        bankCode: acctData.bankCode,
      })
    );
  };

  const { verifiedBank } = useSelector((state: RootState) => state.verifyBank);
  
 const submitData = (data: FormData) => {
    console.log(data);
    if (data.coin === "TON") {
      setReceivingBalance(tonRate * Number(data.amount));
      dispatch(
        sendFiat({
          coin: receivingCoin,
          amount: Number(data.amount),
          ReceivingWalletAddress: walletAddress,
          sendersAddress: data.sendersAddress,
          vendorId: user,
          recipient: verifiedBank.transferRecipient.data.recipient_code,
        })
      );
    } else {
      setReceivingBalance(usdtRate * Number(data.amount));
    }
    setReceivingCoin(data.coin);
  };

  console.log(verifiedBank);
  
  return (
    <div>
      <div>
        <h2 className="mb-4">Vendor Selling Rates:</h2>
        <div className="flex justify-between mb-4">
          <h2>Ton: NGN {tonRate}</h2>
          <h2>USDT: NGN {usdtRate}</h2>
        </div>
      </div>
      <div className="mb-4">
        <label>I want to sell</label>
        <select
          required
          {...register("coin")}
          className="block w-full px-4 py-2 border rounded-lg"
        >
          <option value="TON">Toncoin (TON)</option>
          <option value="USDT">Tether (USDT)</option>
        </select>
      </div>
      <label>Amount of Ton being sent </label>
      <input
        type="number"
        required
        {...register("amount")}
        placeholder="eg 5.4 ton"
        className="block w-full px-4 py-2 border rounded-lg"
      />
      <label>Wallet address you will be sending from </label>
      <input
        type="text"
        required
        {...register("sendersAddress")}
        placeholder="wallet address you'll sending from "
        className="block w-full px-4 py-2 border rounded-lg"
      />
      <p>You'll receive {addCommasToNumber(receivingBalance)} NGN</p>
      <div className="mb-4">
        <label>Select Bank</label>
        <select
          required
          name="bankCode"
          value={acctData.bankCode}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-lg"
        >
          {allBanks?.map((bank: any) => {
            return (
              <option value={bank.code}>
                {bank.name} ({bank.slug})
              </option>
            );
          })}
        </select>
      </div>
      <input
        type="number"
        required
        name="acctNumber"
        value={acctData.acctNumber}
        onChange={handleChange}
        className="block w-full px-4 py-2 border rounded-lg"
      />
      <button onClick={submitBankDEetails}>Verify bank details</button>
      {verifiedBank ? (
        <p>{verifiedBank?.result?.data?.account_name}</p>
      ) : (
        <p>Please select a bank</p>
      )}
      <p onClick={() => handleCopy(walletAddress)} >
        {walletAddress} <span>{copied ? "Copied!" : "Copy"}</span>
      </p>
      <button onClick={handleSubmit(submitData)}>I have sent it</button>
    </div>
  );
}

export default SellCrypto;
