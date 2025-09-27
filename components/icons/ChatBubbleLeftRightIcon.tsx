import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.241c-1.12.072-2.227.527-3.006 1.317l-4.425 4.425a.75.75 0 01-1.06 0l-4.425-4.425a4.5 4.5 0 01-3.006-1.317L1.98 17.093c-1.133-.093-1.98-1.057-1.98-2.192v-4.286c0-.97.616-1.813 1.5-2.097M16.5 6.75v3.75m0-3.75a4.5 4.5 0 014.5 4.5v3.75m-18 0V11.25a4.5 4.5 0 014.5-4.5v3.75m1.5-4.5h.008v.008H8.25v-.008zm3.75 0h.008v.008H12v-.008zm3.75 0h.008v.008H15.75v-.008z" />
  </svg>
);
