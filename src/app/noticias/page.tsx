import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import axios from 'axios';
import Header from '@/src/modules/layout/Header';
import { API_URL } from '@/src/lib/config';
import Link from 'next/link';
import { getNoticias } from '@/src/services/noticias';
import { getNoticiaPortada } from '@/src/services/noticias';
import ReactMarkdown from 'react-markdown';

export default async function Noticia() {
  const noticias = await getNoticias();
  // console.log(noticias);
  // console.log(noticias.portada.url);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        {noticias.map((noticia: any) => (
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <Link key={noticia.id} href="#">
              <img
                className="rounded-t-lg"
                src={getNoticiaPortada({ noticia })}
                alt=""
              />
            </Link>
            <div className="p-5">
              <Link key={noticia.id} href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {noticia.titulo}
                </h5>
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <ReactMarkdown>
                  {noticia.contenido.length > 100
                    ? `${noticia.contenido.substring(0, 100)}...`
                    : noticia.contenido}
                </ReactMarkdown>
              </p>
              <a
                href="#"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Read more
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await axios.get('https://localhost:1337/api/noticias');
//   const noticias = res.data.data;

//   const paths = noticias.map((n: any) => ({
//     params: { slug: n.attributes.slug },
//   }));
//   return {
//     paths,
//     fallback: 'blocking', // or true if you want to enable incremental static regeneration
//   };
// };

// export const getStaticProps: GetStaticProps = async (params) => {
//   const res = await axios.get(
//     `http://localhost:1337/api/noticias?filters[slug][$eq]=${params.slug}&populate=*`,
//   );
//   const data = res.data.data;

//   if (!data || data.length === 0) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       noticia: data[0].attributes,
//     },
//     revalidate: 60,
//   };
// };
