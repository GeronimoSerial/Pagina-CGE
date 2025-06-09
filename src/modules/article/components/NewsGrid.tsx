"use client"
import { Suspense, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@src/components/ui/card"
import { Button } from "@src/components/ui/button"
import { Badge } from "@src/components/ui/badge"
import { FileText, ArrowRightIcon, CalendarDays, Loader2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import SkeletonCard from "./SkeletonCard"
import type { ArticlesGridProps } from "@/src/interfaces"
import { formatearFecha } from "@src/lib/utils"
import { HeadlessPagination } from "@src/modules/documentation/components/HeadlessPagination"
import { TEXTS } from "../data/constants"

const ArticlesGridContent = ({
  articles,
  showImportantBadge = false,
  basePath,
  pagination,
  isLoading = false,
  isCategoryLoading = false,
}: ArticlesGridProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isNoticia = basePath?.includes("noticias") || false
  const texts = isNoticia ? TEXTS.noticias : TEXTS.tramites
  const { totalPaginas, currentPage } = useMemo(
    () => ({
      totalPaginas: pagination ? pagination.totalPages : Math.ceil((articles?.length || 0) / 4),
      currentPage: pagination ? pagination.currentPage : 1,
    }),
    [pagination, articles?.length],
  )

  const handlePageChange = (page: number) => {
    if (pagination) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      router.push(`${basePath}?${params.toString()}`, { scroll: false })
    }
  }

  const getItemLink = (id: string) => {
    if (basePath) {
      return `${basePath}/${id}`
    }
    return pathname === "/" ? `/noticias/${id}` : `/tramites/${id}`
  }

  // Separar artículos para el layout de periódico
  const featuredArticle = articles?.[0]
  const secondaryArticles = articles?.slice(1, 4) || []
  const regularArticles = articles?.slice(4) || []

  return (
    <section className="w-full bg-gray-50">
      <div className="container mx-auto">
        {isCategoryLoading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin" />
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-8 p-6">
            {/* Header estilo periódico */}
            <div className="text-center border-b-4 border-[#3D8B37] pb-6">

              <p className="text-gray-600 text-lg">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Layout principal estilo periódico */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Artículo principal */}
              {featuredArticle && (
                <div className="lg:col-span-2">
                  <Card className="h-full overflow-hidden border-2 border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:transition-all md:duration-300 group">
                    <Link
                      href={getItemLink(featuredArticle.id || "")}
                      title="Ver artículo completo"
                      className="block h-full"
                    >
                      <div className="relative h-64 md:h-80 overflow-hidden">
                        {featuredArticle.imagen ? (
                          <Image
                            src={
                              featuredArticle.imagen.startsWith("http")
                                ? featuredArticle.imagen
                                : featuredArticle.imagen.startsWith("/")
                                  ? featuredArticle.imagen
                                  : `/images/${featuredArticle.imagen}`
                            }
                            alt={featuredArticle.titulo}
                            width={800}
                            height={600}
                            className="object-cover w-full h-full md:transition-transform md:duration-300 md:hover:scale-105"
                            style={{ aspectRatio: "16/9", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FileText className="h-16 w-16 text-gray-400" />
                          </div>
                        )}

                        <div className="absolute top-4 left-4">
                          {featuredArticle.categoria && (
                            <Badge className="bg-[#3D8B37]/10 text-[#3D8B37] border-0 font-medium">
                              {featuredArticle.categoria}
                            </Badge>
                          )}
                        </div>

                        {showImportantBadge && featuredArticle.esImportante && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-red-600 text-white border-0 animate-pulse">URGENTE</Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          {featuredArticle.date && (
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {formatearFecha(featuredArticle.date)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>Destacado</span>
                          </div>
                        </div>

                        <CardTitle
                          title={featuredArticle.titulo}
                          className="text-2xl md:text-3xl font-bold text-gray-800 line-clamp-2 group-hover:text-[#3D8B37] transition-colors"
                        >
                          {featuredArticle.titulo}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <CardDescription
                          className="text-gray-600 text-lg leading-relaxed line-clamp-3"
                          title={featuredArticle.description}
                        >
                          {featuredArticle.description}
                        </CardDescription>
                      </CardContent>

                      <CardFooter>
                        <Button
                          variant="outline"
                          className="border-[#3D8B37] text-[#3D8B37] hover:bg-[#3D8B37] hover:text-white font-medium"
                          asChild
                        >
                          <span className="flex items-center gap-2">
                            {texts.buttonText} <ArrowRightIcon size={16} />
                          </span>
                        </Button>
                      </CardFooter>
                    </Link>
                  </Card>
                </div>
              )}

              {/* Sidebar con artículos secundarios */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b-2 border-[#3D8B37] pb-2">
                  Más {isNoticia ? "Noticias" : "Trámites"}
                </h3>

                {secondaryArticles.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:transition-all md:duration-300 group"
                  >
                    <Link href={getItemLink(item.id || "")} title="Ver artículo completo" className="block">
                      <div className="flex gap-3 p-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                          {item.imagen ? (
                            <Image
                              src={
                                item.imagen.startsWith("http")
                                  ? item.imagen
                                  : item.imagen.startsWith("/")
                                    ? item.imagen
                                    : `/images/${item.imagen}`
                              }
                              alt={item.titulo}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                              style={{ aspectRatio: "1/1", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {item.categoria && (
                              <Badge variant="outline" className="bg-[#3D8B37]/10 text-[#3D8B37] border-0 text-xs">
                                {item.categoria}
                              </Badge>
                            )}
                            {showImportantBadge && item.esImportante && (
                              <Badge className="bg-red-500 text-white text-xs">IMPORTANTE</Badge>
                            )}
                          </div>

                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#3D8B37] transition-colors mb-1">
                            {item.titulo}
                          </h4>

                          <p className="text-xs text-gray-500">
                            {item.date && (
                              <>
                                <CalendarDays size={10} className="inline mr-1" aria-hidden="true" />
                                {formatearFecha(item.date)}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>

            {/* Artículos regulares en grid */}
            {regularArticles.length > 0 && (
              <div className="border-t-2 border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Otros {isNoticia ? "Artículos" : "Trámites"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {regularArticles.map((item) => (
                    <Card
                      key={item.id}
                      className="h-[24rem] flex flex-col overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:transition-all md:duration-300"
                    >
                      <Link
                        href={getItemLink(item.id || "")}
                        title="Ver artículo completo"
                        className="flex flex-col h-full"
                      >
                        <div className="h-40 flex-none overflow-hidden relative flex items-center justify-center">
                          {item.imagen ? (
                            <Image
                              src={
                                item.imagen.startsWith("http")
                                  ? item.imagen
                                  : item.imagen.startsWith("/")
                                    ? item.imagen
                                    : `/images/${item.imagen}`
                              }
                              alt={item.titulo}
                              width={500}
                              height={500}
                              className="object-cover w-full h-full md:transition-transform md:duration-300 md:hover:scale-105"
                              style={{ aspectRatio: "1.6/1", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <CardHeader className="pb-2 flex-none h-[5.5rem]">
                          <div className="flex justify-between items-center mb-2">
                            {item.categoria && (
                              <Badge
                                variant="outline"
                                className="bg-[#3D8B37]/10 text-[#3D8B37] border-0 font-medium text-xs"
                              >
                                {item.categoria}
                              </Badge>
                            )}
                            {item.date && (
                              <span className="text-xs text-gray-500 font-medium">
                                <CalendarDays size={12} className="inline mr-1" aria-hidden="true" />
                                {formatearFecha(item.date)}
                              </span>
                            )}
                          </div>
                          <CardTitle title={item.titulo} className="text-sm font-semibold line-clamp-2 text-gray-800">
                            {item.titulo}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 min-h-0">
                          <CardDescription className="text-gray-600 text-xs line-clamp-2" title={item.description}>
                            {item.description}
                          </CardDescription>
                        </CardContent>

                        <CardFooter className="pt-0 pb-4 flex-none h-[3rem]">
                          <div className="flex items-center justify-between w-full">
                            <Button
                              variant="link"
                              className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] text-xs hover:underline"
                              asChild
                            >
                              <span className="flex items-center gap-1">
                                {texts.buttonText} <ArrowRightIcon size={12} />
                              </span>
                            </Button>

                            {showImportantBadge && item.esImportante && (
                              <Badge className="bg-red-500 text-white text-xs">IMPORTANTE</Badge>
                            )}
                          </div>
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-full rounded-xl shadow-sm p-10 text-center">
            <FileText className="h-12 w-12 mx-auto text-black mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{texts.emptyStateTitle}</h3>
            <p className="text-gray-500 max-w-md mx-auto">{TEXTS.common.emptyStateDescription}</p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = basePath || "/")}
              className="mt-4 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {texts.emptyStateButtonText}
            </Button>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="py-6 border-t border-gray-100 mt-6">
            <HeadlessPagination currentPage={currentPage} totalPages={totalPaginas} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </section>
  )
}

const ArticlesGrid = (props: ArticlesGridProps) => {
  return (
    <Suspense
      fallback={
        <section className="w-full">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <ArticlesGridContent {...props} />
    </Suspense>
  )
}

export default ArticlesGrid
