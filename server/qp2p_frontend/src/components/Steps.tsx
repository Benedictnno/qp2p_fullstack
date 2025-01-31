import React from 'react';

const steps = [
  { title: 'Create New Id Affiliate Program', description: 'Start Now' },
  { title: 'Promote CryptoBrains Website', description: 'Start Now' },
  { title: 'Wait For User Do Trading', description: 'Start Now' },
  { title: 'Claim Your Final Commission', description: 'Start Now' },
];

const Steps: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
