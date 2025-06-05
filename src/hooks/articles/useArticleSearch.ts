import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Article } from "@/src/interfaces";

export const useArticleSearch = (articles: Article[], isNoticia: boolean) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    const categories = useMemo(
        () =>
            isNoticia
                ? ["General", "Novedades", "Eventos", "Comunicados"]
                : ["Licencias", "Títulos", "Inscripción", "Otros"],
        [isNoticia]
    );

    const fuse = useMemo(() => {
        if (articles.length === 0) return null;
        return new Fuse(articles, {
            keys: ["titulo", "resumen", "subcategoria"],
            threshold: 0.3,
        });
    }, [articles]);

    const filteredResults = useMemo(() => {
        if (!articles || articles.length === 0) return [];

        let results = [...articles];

        if (categoriaSeleccionada) {
            results = results.filter(
                (article) =>
                    article.categoria?.toLowerCase() ===
                    categoriaSeleccionada.toLowerCase()
            );
        }

        if (searchTerm && fuse) {
            const searchResults = fuse.search(searchTerm);
            results = searchResults.map((result) => result.item);
        }

        return results.map((article) => ({
            ...article,
            id: article.id || article.slug,
            description: article.description || article.resumen || "Sin descripción",
        }));
    }, [searchTerm, categoriaSeleccionada, fuse, articles]);
    return {
        searchTerm,
        setSearchTerm,
        categoriaSeleccionada,
        setCategoriaSeleccionada,
        categories,
        filteredResults,
    };
};