import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PencilSquareIcon: React.FC<IconProps> = (props) => (
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
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.82a2.25 2.25 0 01-1.897 1.13l-2.685.8.8-2.685a2.25 2.25 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125m-7.5 7.875L9 15m0 0l-3.75-3.75M9 15v-3.75m3.75 3.75H16.5m-3.75-3.75h3.75m-3.75 0L15 8.25m-3.75 3.75L9 15"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// A slightly different icon that might fit better
export const PencilSquareIconAlt: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.82a2.25 2.25 0 01-1.897 1.13l-2.685.8.8-2.685a2.25 2.25 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M12 15v5.25a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V7.5a.75.75 0 01.75-.75H9" />
    </svg>
);
