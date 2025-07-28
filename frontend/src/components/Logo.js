import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <img 
        src="https://customer-assets.emergentagent.com/job_karthigames/artifacts/944govrn_31CB2BE4-F711-4502-BCEE-9C59493726CF.png"
        alt="Karthikeya's Games Galaxy"
        className="h-12 w-12 lg:h-14 lg:w-14"
      />
      <div className="flex flex-col">
        <span className="text-xl lg:text-2xl font-bold text-gaming-text">KGG</span>
        <span className="text-xs lg:text-sm text-gaming-text-secondary font-medium">Games Galaxy</span>
      </div>
    </div>
  );
};

export default Logo;