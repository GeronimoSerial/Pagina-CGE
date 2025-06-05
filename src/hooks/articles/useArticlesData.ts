import { useState, useEffect } from 'react';
import { Article } from '@/src/interfaces';

export const useArticlesData = (isNoticia: boolean) => {
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [isLoadingFullList, setIsLoadingFullList] = useState(true);
    const [errorLoadingFullList, setErrorLoadingFullList] = useState<string | null>(null);
    const [isCategoryFiltering, setIsCategoryFiltering] = useState(false);

    useEffect(() => {
        const tipo = isNoticia ? "noticias" : "tramites";
        setIsLoadingFullList(true);

        fetch(`/content/${tipo}/index.json`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar los artículos completos");
                return res.json();
            })
            .then((data: Article[]) => {
                setAllArticles(data);
                setErrorLoadingFullList(null);
            })
            .catch((err) => {
                setErrorLoadingFullList(err.message);
                setAllArticles([]);
            })
            .finally(() => {
                setIsLoadingFullList(false);
            });
    }, [isNoticia]);

    return {
        allArticles,
        isLoadingFullList,
        errorLoadingFullList,
        isCategoryFiltering,
        setIsCategoryFiltering
    };
};