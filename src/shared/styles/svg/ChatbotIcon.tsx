import React from 'react';

export const ChatbotIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="animate-bounce"
    >
      <path d="M8.5 10A1.5 2 0 1 0 8.5 14 1.5 2 0 1 0 8.5 10z"></path>
      <path d="M15.5 10A1.5 2 0 1 0 15.5 14 1.5 2 0 1 0 15.5 10z"></path>
      <path d="M8 16H16V18H8z"></path>
      <path d="m21,11v-3c0-1.1-.9-2-2-2h-6v-1.39c.3-.27.5-.67.5-1.11,0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5c0,.44.2.84.5,1.11v1.39h-6c-1.1,0-2,.9-2,2v3c-.55,0-1,.45-1,1v4c0,.55.45,1,1,1v3c0,1.1.9,2,2,2h14c1.1,0,2-.9,2-2v-3c.55,0,1-.45,1-1v-4c0-.55-.45-1-1-1ZM5,20v-12h14v4s0,0,0,0v4s0,0,0,0v4s-14,0-14,0Z"></path>
    </svg>
  );
};
