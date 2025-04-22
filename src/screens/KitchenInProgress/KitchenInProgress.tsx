import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useMultiSocketEvents} from '../../utils/socket';
import {SocketEnum} from '../../common/enum';
import useRequestProductStore from '../../store/useRequestProductStore';
import {RequestProduct} from '../../types/request.type';
import {IS_TABLET, getUpdateRequestProductQuantity} from '../../utils/common';
import {RequestTransferred} from '../../types/requestTransferred.type';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalServe from './components/ModalServe';
import CardRequest from './components/CardRequest';
import tw from 'twrnc';
import HeaderRequest from './components/HeaderRequest';
import useAuthStore from '../../store/authStore';
import {useTheme} from '../../provider/ThemeContext';

const KitchenInProgress = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [openModalServe, setOpenModalServe] = useState(false);
  const [valueChange, setValueChange] = useState<number>(0);
  const [valueRow, setValueRow] = useState<RequestProduct[]>([]);
  const {theme, updateTheme} = useTheme();
  const {currentUser} = useAuthStore();

  const {
    requestsProductInProgress,
    setRequestProductInprogress,
    total,
    isLoading,
    updateCompleteOrCancel,
    fetchRequestInProgress,
  } = useRequestProductStore();

  useEffect(() => {
    fetchRequestInProgress(null as any);
  }, []);

  useMultiSocketEvents(
    [
      {
        event: SocketEnum.REQUEST_NOTIFY_TRANSFERRED,
        callback: (newRequest: RequestTransferred) => {
          setRequestProductInprogress(prevRequestProducts => {
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
    [],
  );

  const onRefresh = useCallback(() => {
    fetchRequestInProgress(null as any).then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      <HeaderRequest />
      <View
        style={{height: '100%', flex: 1, marginTop: 10, overflow: 'hidden'}}>
        <FlatList
          style={{flex: 1, height: '100%'}}
          {...(IS_TABLET ? {columnWrapperStyle: {gap: 20}} : {})}
          numColumns={IS_TABLET ? 3 : 1}
          data={requestsProductInProgress}
          renderItem={({item}) => {
            return (
              <CardRequest
                handleServe={() => {
                  setOpenModalServe(true);
                  setValueChange(item?.quantity - item?.completedQuantity);
                  setValueRow([item]);
                }}
                item={item}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEventThrottle={250}
          keyExtractor={item => item.id}
        />
      </View>
      <ModalServe
        openStore={openModalServe}
        valueServe={valueRow}
        onClose={() => setOpenModalServe(false)}
        onConfirm={() => console.log('run')}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default KitchenInProgress;
