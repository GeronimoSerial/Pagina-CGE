const SkeletonLoading = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-11 relative animate-[fadeIn_0.5s_ease-in-out]">
      <div className="relative h-64 md:h-128 rounded-2xl overflow-hidden bg-linear-to-r from-gray-200 to-gray-300">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-20" />

        <div className="absolute inset-0 flex flex-col justify-end p-8 z-30 space-y-4">
          <div className="w-3/4 h-8 rounded-lg bg-linear-to-r from-white/30 to-white/40 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="w-2/4 h-6 rounded-lg bg-linear-to-r from-white/20 to-white/30 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="flex gap-4 mt-2">
            <div className="w-24 h-4 rounded-md bg-white/20 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="w-24 h-4 rounded-md bg-white/20 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
