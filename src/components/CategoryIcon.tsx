import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.Layers;
  return <IconComponent className={className} />;
};
