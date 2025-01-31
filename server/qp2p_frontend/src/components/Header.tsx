import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-50 py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Become <span className="text-blue-600">CryptoBrains</span> Affiliate And Earn
        </h1>
        <p className="text-gray-600 mt-4">
          Become a CryptoBrains Affiliate Member and earn up to 40% commission on every user who trades.
        </p>
        <div className="mt-8 space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md">Join Today</button>
          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md">Already Affiliate</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
