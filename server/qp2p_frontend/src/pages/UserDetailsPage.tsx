import React, { useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { Button } from "@/components/ui/button";
import WalletDetails from "@/components/walletDetails";

const App: React.FC = () => {
  const tabs = [
    "Profile",
    "Wallet Profile",
    "Your Link",
   
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const sessionUser = localStorage.getItem("user");
  const { user } = sessionUser ? JSON.parse(sessionUser) : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg">
        <header className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 text-sm font-medium ${
                activeTab === tab
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </header>

        <div className="p-6">
          {activeTab === "Profile" && <ProfileForm />}
          {activeTab === "Set Token Sell Rate" && (
            <SetTokenRate label="Account Field" />
          )}
          {activeTab === "Your Link" && (
            <YourLink
              userId={user.id}
              handleCopy={handleCopy}
              copied={copied}
            />
          )}
          {activeTab === "Wallet Profile" && (
            <WalletDetails  />
          )}
          {/* {activeTab === "Display" && <DemoFormField label="Display Field" />} */}
        </div>
      </div>
    </div>
  );
};



const YourLink: React.FC<{
  userId: string;
  handleCopy: (text: string) => void;
  copied: boolean;
}> = ({ userId, handleCopy, copied }) => (
  <div>
    <label className="block text-sm font-medium mb-2">Access Link</label>
    <input
      type="text"
      className="w-full border rounded-md px-3 py-2"
      readOnly
      value={`https://qp2p.onrender.com/${userId}`}
      placeholder={`Enter`}
    />
    <Button
      variant="outline"
      className="w-10/12 self-center"
      onClick={() => handleCopy(`https://qp2p.onrender.com/${userId}`)}
    >
      <span>{copied ? "Copied!" : "Copy"}</span>
    </Button>
  </div>
);
const SetTokenRate: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {" "}
      Set Ton Price (per 1 Token)
    </label>
    <input
      type="text"
      className="w-full border rounded-md px-3 py-2"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    <label className="block text-sm font-medium mb-2">
      Set Usdt Price (per 1 Token)
    </label>
    <input
      type="text"
      className="w-full border rounded-md px-3 py-2"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    <label className="block text-sm font-medium mb-2">
      Set Solana Price (per 1 Token)
    </label>
    <input
      type="text"
      className="w-full border rounded-md px-3 py-2"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default App;
