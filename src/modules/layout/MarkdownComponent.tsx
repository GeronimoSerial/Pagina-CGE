import { Components } from "react-markdown";
// renderizado de texto p/ full article
export const MarkdownComponent: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b pb-1 border-slate-200">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold mt-6 mb-3 text-slate-800">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium mt-6 mb-3 text-slate-700">{children}</h3>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-gray-800 underline hover:text-blue-800 hover:underline transition-colors font-medium"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir enlace externo: ${children}`}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-xl shadow-xl my-8 w-full"
      loading="lazy"
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-slate-400 bg-slate-50 pl-5 py-3 my-8 italic rounded-r-lg text-slate-700">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-slate-800 text-slate-100 rounded-xl p-5 overflow-x-auto my-8 shadow-md text-sm">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-5 space-y-2 marker:text-slate-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-5 space-y-2 marker:text-slate-500">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="mb-2 leading-relaxed">{children}</li>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-xl shadow-md">
      <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-200 px-5 py-3 bg-slate-100 text-left text-slate-700 font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-200 px-5 py-3">{children}</td>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-slate-700 leading-relaxed text-lg">{children}</p>
  ),
};
