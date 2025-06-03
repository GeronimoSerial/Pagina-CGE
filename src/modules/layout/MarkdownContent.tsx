

export const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1
      className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2 border-gray-200"
      {...props}
    />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-medium mt-5 mb-2 text-gray-700" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a
      className="text-blue-600 hover:text-blue-800 underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  img: ({ node, ...props }: any) => (
    <img className="rounded-lg shadow-md my-6 w-full" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-gray-300 bg-gray-50 pl-4 py-2 my-6 italic text-gray-700"
      {...props}
    />
  ),
  code: ({ node, ...props }: any) => (
    <code
      className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-sm"
      {...props}
    />
  ),
  pre: ({ node, ...props }: any) => (
    <pre
      className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-5 my-4 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-5 my-4 space-y-1" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full border border-gray-200 rounded-lg overflow-hidden"
        {...props}
      />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th
      className="border border-gray-200 px-4 py-2 bg-gray-50 text-left text-gray-700 font-medium"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td className="border border-gray-200 px-4 py-2" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
  ),
};