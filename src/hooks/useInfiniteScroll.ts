import { useEffect, useRef, useState, useCallback } from 'react';
import { checkDuplicateId } from '../utils/common';
const useInfiniteScroll = <T extends { id: string }>(
  fetchMethod: (filters: any, getOnly?: boolean) => Promise<any>,
  filters: any
) => {
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const curPage = useRef<number>(0);
  const filtersRef = useRef(filters);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchMethod({...filters, page:1, limit: 12});
      const newData: T[] = response.data;
      setData(newData);
      if(response?.data?.length === 0) {
        setAllLoaded(true)
      }else{
        setAllLoaded(false)
      }
      curPage.current = 1;
      
    
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleLoadMore = async () => {
    setIsLoadMore(true);
    if (allLoaded ) {
      setIsLoadMore(false);
      return;
    }
    const page = curPage.current + 1;
    try {
      const response = await fetchMethod({
        ...filters,
        page,
        limit: 12,
      });
      if (response?.data?.length === 0) {
        setAllLoaded(true);
      } else {
        const curList = [...data];
        setData(checkDuplicateId(response?.data, curList));
        curPage.current = page;
      }
      setIsLoadMore(false);
    } catch (err) {
      setIsLoadMore(false);
    }
  };


  useEffect(() => {
    if (JSON.stringify(filtersRef.current) !== JSON.stringify(filters)) {
      setData([]);
      filtersRef.current = filters;
      curPage.current = 0;
    }
  }, [filters]);


  const removeItems = useCallback((itemIds: string[]) => {
    setData((prevData) => prevData.filter((item: any) => !itemIds.includes(item.id)));
  }, []);

  const updateItems = (idOrIds: string | string[], fieldUpdated: Partial<T>) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setData((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, ...fieldUpdated } : item)));
  };

  const updateDatas =  (array : any) => {
    const dataArray = Array.isArray(data) ? data : [];
      const newArray = [array, ...dataArray];
      setData(newArray);
  };
  return {
    data,
    isLoading,
    isLoadMore,
    handleLoadMore,
    removeItems,
    updateItems,
    updateDatas,
  };
};

export default useInfiniteScroll;
