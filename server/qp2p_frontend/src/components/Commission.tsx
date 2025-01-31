import React from 'react';

const Commission: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Earn Up To 40% Commission On Their Trading Fees!</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md">Start Affiliate</button>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="text-lg font-bold">Senior Level</h3>
            <p className="text-gray-600">Get 40% commission on every trade.</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="text-lg font-bold">Middle Level</h3>
            <p className="text-gray-600">Get 25% commission on trading.</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="text-lg font-bold">Junior Level</h3>
            <p className="text-gray-600">Get 15% commission on trading.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Commission;
