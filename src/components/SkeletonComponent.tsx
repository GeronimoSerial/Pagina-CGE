const SkeletonLoading = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-11 relative">
      <div className="relative h-64 md:h-[32rem] rounded-2xl overflow-hidden bg-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4 z-30 text-white">
          <div className="w-3/4 h-6 bg-white/40 rounded-md"></div>
          <div className="w-2/4 h-4 bg-white/30 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
