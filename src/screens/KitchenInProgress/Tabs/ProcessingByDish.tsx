import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useRequestProductStore, {
  FilterKitchen,
} from '../../../store/useRequestProductStore';
import {useMultiSocketEvents} from '../../../utils/socket';
import {SocketEnum} from '../../../common/enum';
import {RequestTransferred} from '../../../types/requestTransferred.type';
import {RequestProduct} from '../../../types/request.type';
import {
  IS_TABLET,
  getUpdateRequestProductQuantity,
} from '../../../utils/common';
import ModalServe from '../components/ModalAction';
import CardRequest from '../components/CardRequest';
import {ActivityIndicator} from 'react-native';
import useAudioDebounce from '../../../hooks/useAudioDebounce';

const ProcessingByDish = ({filters}: {filters?: FilterKitchen}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [openModalServe, setOpenModalServe] = useState(false);
  const [dataChange, setDataChange] = useState<any[]>([]);
  const [dataTemp, setDataTemp] = useState<any[]>([]);
  const [actionType, setActionType] = useState<'complete' | 'cancel'>(
    'complete',
  );

  const {
    requestsProductInProgress,
    setRequestProductInprogress,
    isLoading,
    updateCompleteOrCancel,
    fetchRequestInProgress,
  } = useRequestProductStore();

  useMultiSocketEvents(
    [
      {
        event: SocketEnum.REQUEST_NOTIFY_TRANSFERRED,
        callback: (newRequest: RequestTransferred) => {
          setRequestProductInprogress(prevRequestProducts => {
            console.log('🇻🇳 👉 run run');
            const newRequestProducts = newRequest.requestProducts.map(item => {
              return {...item, request: newRequest};
            });
            const requestProducts = [
              ...prevRequestProducts,
              ...newRequestProducts,
            ];
            const requestsProductInProgressSorted = requestProducts.sort(
              (a: RequestProduct, b: RequestProduct) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            return {
              data: requestsProductInProgressSorted,
              total: requestProducts.length,
            };
          });
        },
      },
      {
        event: SocketEnum.REQUEST_PRODUCT_CANCELED,
        callback: (requestProduct: RequestProduct) => {
          setRequestProductInprogress(prevRequestProducts => {
            const requestProducts = prevRequestProducts.filter(
              requestProductInProgress =>
                requestProductInProgress.id !== requestProduct.id,
            );
            return {
              data: requestProducts,
              total: requestProducts.length,
            };
          });
        },
      },
      {
        event: SocketEnum.REQUEST_PRODUCT_REMADE,
        callback: (requestProduct: RequestProduct) => {
          setRequestProductInprogress(prevRequestProducts => {
            const foundIndex = prevRequestProducts.findIndex(
              requestProductInProgress =>
                requestProductInProgress.id === requestProduct.id,
            );
            if (foundIndex !== -1) {
              prevRequestProducts[foundIndex] = {
                ...prevRequestProducts[foundIndex],
                ...getUpdateRequestProductQuantity(requestProduct),
              };
            } else {
              prevRequestProducts.push(requestProduct);
            }
            const requestsProductInProgressSorted = prevRequestProducts.sort(
              (a: RequestProduct, b: RequestProduct) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            return {
              data: requestsProductInProgressSorted,
              total: requestsProductInProgressSorted.length,
            };
          });
        },
      },
      {
        event: SocketEnum.REQUEST_PRODUCT_CHANGED,
        callback: (requestProduct: RequestProduct) => {
          if (requestProduct.completedQuantity === requestProduct.quantity)
            return;
          setRequestProductInprogress(prevRequestProducts => {
            const foundIndex = prevRequestProducts.findIndex(
              requestProductInProgress =>
                requestProductInProgress.id === requestProduct.id,
            );
            if (foundIndex !== -1) {
              prevRequestProducts[foundIndex] = {
                ...prevRequestProducts[foundIndex],
                ...getUpdateRequestProductQuantity(requestProduct),
              };
            } else {
              prevRequestProducts.push(requestProduct);
            }
            const requestsProductInProgressSorted = prevRequestProducts.sort(
              (a: RequestProduct, b: RequestProduct) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            return {
              data: requestsProductInProgressSorted,
              total: requestsProductInProgressSorted.length,
            };
          });
        },
      },
      {
        event: SocketEnum.REQUEST_PRODUCT_COMPLETED,
        callback: (requestProduct: RequestProduct) => {
          setRequestProductInprogress(prevRequestProducts => {
            const requestProducts = prevRequestProducts.filter(
              requestProductInProgress =>
                requestProductInProgress.id !== requestProduct.id,
            );
            return {
              data: requestProducts,
              total: requestProducts.length,
            };
          });
        },
      },
    ],
    [filters],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequestInProgress(filters as FilterKitchen).then(() => {
      setRefreshing(false);
    });
  }, [filters]);

  useEffect(() => {
    setDataChange(dataTemp);
  }, [dataTemp]);

  const handleChangeValue = (index: number, value: number) => {
    const newList = [...dataChange];
    const item = newList[index];
    const newServedQuantity = (item.quantity || 0) - value;
    newList[index] = {...item, completedQuantity: newServedQuantity};
    setDataChange(newList);
  };
  const handleConfirmOrCancel = async (isComplete: boolean) => {
    await updateCompleteOrCancel(
      dataChange?.map(item => ({
        id: item?.id,
        quantity: item?.quantity - item?.completedQuantity,
      })),
      isComplete,
    );
    setOpenModalServe(false);
  };

  return (
    <>
      <View
        style={{height: '100%', flex: 1, marginTop: 10, overflow: 'hidden'}}>
        {isLoading && !refreshing && <ActivityIndicator />}
        {!isLoading && (
          <FlatList
            style={{flex: 1, height: '100%'}}
            {...(IS_TABLET ? {columnWrapperStyle: {gap: 20}} : {})}
            numColumns={IS_TABLET ? 3 : 1}
            data={requestsProductInProgress}
            renderItem={({item}) => {
              return (
                <CardRequest
                  onConfirm={() => {
                    setActionType('complete');
                    setOpenModalServe(true);
                    setDataTemp([item]);
                  }}
                  onCancel={() => {
                    setActionType('cancel');
                    setOpenModalServe(true);
                    setDataTemp([item]);
                  }}
                  item={item}
                />
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEventThrottle={250}
            keyExtractor={item => item?.id}
          />
        )}
      </View>
      <ModalServe
        openStore={openModalServe}
        dataChange={dataChange}
        dataTemp={dataTemp}
        actionType="complete"
        handleChangeValue={handleChangeValue}
        onClose={() => setOpenModalServe(false)}
        onConfirm={() =>
          handleConfirmOrCancel(actionType === 'complete' ? true : false)
        }
      />
    </>
  );
};

export default ProcessingByDish;

const styles = StyleSheet.create({});
