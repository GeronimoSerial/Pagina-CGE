import { Card } from "@components/ui/card";

const SkeletonCard = () => {
  return (
    <Card className="h-[28rem] flex flex-col overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="w-3/4 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
