export default function ContactFormSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white  border border-gray-200 -800 shadow-xs rounded-lg">
      <div className="p-4">
        <div className="space-y-4">
          {/* Fila de nombre y email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200  rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200  rounded animate-pulse"></div>
              </div>
              <div className="h-9 bg-gray-100  rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200  rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200  rounded animate-pulse"></div>
              </div>
              <div className="h-9 bg-gray-100  rounded animate-pulse"></div>
            </div>
          </div>

          {/* Fila de área y asunto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200  rounded animate-pulse"></div>
                <div className="h-4 w-10 bg-gray-200  rounded animate-pulse"></div>
              </div>
              <div className="h-9 bg-gray-100  rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200  rounded animate-pulse"></div>
                <div className="h-4 w-14 bg-gray-200  rounded animate-pulse"></div>
              </div>
              <div className="h-9 bg-gray-100  rounded animate-pulse"></div>
            </div>
          </div>

          {/* Campo de mensaje */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200  rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200  rounded animate-pulse"></div>
            </div>
            <div className="h-24 bg-gray-100  rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 /50 p-4 rounded-b-lg">
        <div className="h-12 bg-gray-200  rounded animate-pulse mb-3"></div>
        <div className="flex items-center justify-center">
          <div className="h-3 w-48 bg-gray-200  rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
