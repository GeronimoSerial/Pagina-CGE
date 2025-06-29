import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import type { ArticleSection } from '../services/docs-data';

interface CalloutRendererProps {
  section: ArticleSection;
}

export function CalloutRenderer({ section }: CalloutRendererProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle,
  };

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const IconComponent = icons[section.variant || 'info'];
  const colorClass = colors[section.variant || 'info'];

  return (
    <div className={`border-l-4 p-4 mb-6 rounded-r-lg ${colorClass}`}>
      <div className="flex items-start">
        <IconComponent className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-medium">{section.content}</p>
      </div>
    </div>
  );
}
