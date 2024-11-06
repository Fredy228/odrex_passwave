import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { parseJson } from "@/services/parseJson";

const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageQuery = searchParams.get("page");
  const pageSizeQuery = searchParams.get("size");
  const sortQuery = searchParams.get("sort");
  const filterQuery = searchParams.get("filter");

  const setQuery = useCallback(
    (params: Array<{ field: string; value: string | null }>) => {
      const newParams = new URLSearchParams(searchParams);
      params.forEach((i) => {
        if (i.value) newParams.set(i.field, i.value);
        else newParams.delete(i.field);
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const page = useMemo(() => Number(pageQuery) || 1, [pageQuery]);
  const pageSize = useMemo(() => Number(pageSizeQuery) || 15, [pageSizeQuery]);
  const sort: [string, string] | null = useMemo(
    () => parseJson<[string, string]>(sortQuery),
    [sortQuery],
  );
  const filter: Record<string, string> | null = useMemo(
    () => parseJson<Record<string, string>>(filterQuery),
    [filterQuery],
  );

  return {
    page,
    sort,
    filter,
    pageSize,
    setQuery,
  };
};

export default usePagination;
