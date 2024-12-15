import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
    return (
        <div className={className}>
            {title && <div>{title}</div>}
            {children}
        </div>
    );
};

const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
