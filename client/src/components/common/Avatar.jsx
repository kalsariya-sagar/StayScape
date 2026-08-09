import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const getInitial = () => {
    if (!user) return '?';
    if (user.firstName && user.firstName.trim()) {
      return user.firstName.trim().charAt(0).toUpperCase();
    }
    if (user.username && user.username.trim()) {
      return user.username.trim().charAt(0).toUpperCase();
    }
    if (user.name && user.name.trim()) {
      return user.name.trim().charAt(0).toUpperCase();
    }
    return '?';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-28 h-28 text-4xl',
  };

  return (
    <div
      className={`rounded-full bg-brand-500 text-white font-bold flex items-center justify-center select-none shadow-sm flex-shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {getInitial()}
    </div>
  );
};

export default Avatar;