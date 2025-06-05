import { useRouter } from 'next/navigation';
import { normalizarTexto } from '@/src/modules/escuelas/utils/searchUtils';
interface UseArticleCategoriesProps {
    basePath: string;
    setCategoriaSeleccionada: (categoria: string) => void;
    setIsCategoryFiltering: (isFiltering: boolean) => void;
}

export const useArticleCategories = ({
    basePath,
    setCategoriaSeleccionada,
    setIsCategoryFiltering
}: UseArticleCategoriesProps) => {
    const router = useRouter();

    const handleCategoryChange = (cat: string) => {
        setCategoriaSeleccionada(cat);
        setIsCategoryFiltering(true);

        const params = new URLSearchParams(window.location.search);
        if (cat && cat !== "") {
            params.set("categoria", normalizarTexto(cat));
        } else {
            params.delete("categoria");
        }

        params.delete("page");
        router.push(`${basePath}?${params.toString()}`, { scroll: false });
    };

    return {
        handleCategoryChange
    };
};