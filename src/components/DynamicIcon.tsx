import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size = 20 }) => {
  // Map or lookup icon from LucideIcons
  const IconComponent = (LucideIcons as Record<string, React.ElementType>)[name] || LucideIcons.Sparkles;

  return <IconComponent className={className} size={size} />;
};
