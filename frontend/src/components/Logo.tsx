"use client";

import React from 'react'

interface ProdPushLogoProps {
  width?: number
  height?: number
  className?: string
}

const ProdPushLogo: React.FC<ProdPushLogoProps> = ({ width = 200, height = 200, className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="200" height="200" rx="40" fill="#4F46E5" />
      <path
        d="M50 100H150"
        stroke="white"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M100 50L150 100L100 150"
        stroke="white"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="100" r="10" fill="#10B981" />
      <circle cx="100" cy="50" r="10" fill="#10B981" />
      <circle cx="100" cy="150" r="10" fill="#10B981" />
    </svg>
  )
}

export default ProdPushLogo


