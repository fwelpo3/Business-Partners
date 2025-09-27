import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const LightBulbIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c.065.21.145.421.24.631a3.75 3.75 0 013.51 2.118a3.75 3.75 0 013.51-2.118c.095-.21.175-.421.24-.631zM15 4.125a3.375 3.375 0 01-3.375-3.375V.75A3.375 3.375 0 0115 4.125zM12 9.75a3.75 3.75 0 013.75-3.75M12 9.75a3.75 3.75 0 00-3.75-3.75M12 9.75v4.5m0-4.5a3.75 3.75 0 00-3.75 3.75m3.75-3.75a3.75 3.75 0 013.75 3.75"
    />
  </svg>
);
