const LatestNewsSkeleton = () => {
  return (
    <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-96 lg:sticky lg:top-8 lg:self-start">
          <div className="relative mb-8">
            <div className="mb-6 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="bg-gray-200 h-0.5 rounded animate-pulse"></div>
          </div>

          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
        </div>

        {/* News grid skeleton */}
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                {/* Image skeleton */}
                <div className="h-48 sm:h-56 bg-gray-200 animate-pulse"></div>

                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>

                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6"></div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                  </div>

                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSkeleton;
