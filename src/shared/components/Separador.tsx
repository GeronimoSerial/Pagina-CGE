import { Diamond } from 'lucide-react';

export const Separador = ({ titulo }: { titulo?: string }) => {
  return (
    <div className="py-16">
      <div className="px-6 mx-auto max-w-4xl">
        <h2 className="mb-8 text-2xl font-medium text-center text-slate-800">
          {titulo}
        </h2>
        <div className="relative">
          <div className="flex absolute inset-0 items-center">
            <div className="w-full">
              <div className="mb-1 border-t border-slate-300"></div>
              <div className="border-t border-slate-200"></div>
            </div>
          </div>
          <div className="flex relative justify-center">
            <div className="px-6">
              <Diamond className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
