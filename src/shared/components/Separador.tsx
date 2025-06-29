import { Diamond } from 'lucide-react';

export const Separador = ({ titulo }: { titulo: string }) => {
  return (
    <div className="py-16 ">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-medium text-slate-800 mb-8 text-center">
          {titulo}
        </h2>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full">
              <div className="border-t border-slate-300 mb-1"></div>
              <div className="border-t border-slate-200"></div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className=" px-6">
              <Diamond className="w-4 h-4 text-slate-500 " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
