import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomModal from '../../../components/CustomModal';
import Icon from '../../../common/icons';
import tw from 'twrnc';
import {RequestProduct} from '../../../types/request.type';
import QuantityInput from '../../../components/QuantityInput';
import CustomCheckbox from '../../../components/CustomCheckbox';

interface ModalServeProps {
  openStore?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
}

const ModalServe: React.FC<ModalServeProps> = ({
  openStore,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [updatedList, setUpdatedList] = useState<RequestProduct[]>([]);
  const [selectedItems, setSelectedItems] = useState<RequestProduct[]>([]);

  const handleCheckboxToggle = (item: RequestProduct) => {
    setSelectedItems(prevSelected => {
      const isAlreadySelected = prevSelected.some(
        selected => selected.id === item.id,
      );

      return isAlreadySelected
        ? prevSelected.filter(selected => selected.id !== item.id) // Bỏ chọn
        : [...prevSelected, item]; // Thêm vào danh sách
    });
  };

  const data: RequestProduct[] = [
    {
      id: '951b633d-9c8b-4268-b140-5d0318e62ebd',
      createdAt: '2025-02-20T07:27:54.105Z',
      productId: '4fe8fcda-82f0-494b-a2be-392a34bc3db6',
      productName: 'Bánh canh xương',
      quantity: 1,
      returnedQuantity: 2,
      servedQuantity: 0,
      note: null,
      price: 35000,
      status: 'READY_TO_SERVE',
    },
    {
      id: '0250f302-b109-413a-ada5-0b614c418b68',
      createdAt: '2025-02-20T07:27:54.105Z',
      productId: 'bef42687-f5d0-4219-8578-bbe660649cee',
      productName: 'Cá kho',
      quantity: 2,
      returnedQuantity: 1,
      servedQuantity: 0,
      note: null,
      price: 25000,
      status: 'READY_TO_SERVE',
    },
    {
      id: 'af22c9f5-4106-4e6a-93ba-0d6e54eb1934',
      createdAt: '2025-02-20T07:27:54.105Z',
      productId: 'ed578636-35cf-49dd-9af1-4b6d0622295a',
      productName: 'Nước mía',
      quantity: 1,
      returnedQuantity: 1,
      servedQuantity: 0,
      note: null,
      price: 15000,
      status: 'READY_TO_SERVE',
    },
  ];

  const handleChangeServe = (index: number, value: number) => {
    const newList = [...updatedList];
    const item = newList[index];
    const newServedQuantity = (item.returnedQuantity || 0) - value;
    newList[index] = {...item, servedQuantity: newServedQuantity};
    setUpdatedList(newList);
    setSelectedItems(prevSelected =>
      prevSelected.map(selectedItem => {
        const updatedItem = newList.find(item => item.id === selectedItem.id);
        return updatedItem ? updatedItem : selectedItem;
      }),
    );
  };

  useEffect(() => {
    setUpdatedList(data);
  }, []);

  return (
    <CustomModal
      visible={openStore}
      width={'44%'}
      title="Phục vụ"
      onClose={() => {
        setSelectedItems([]);
        onClose?.();
      }}
      onConfirm={onConfirm}
      isLoading={isLoading}
      modalIcon={() => (
        <View style={tw`bg-[#F0F9FF] p-2 rounded-[50px]`}>
          <View style={tw`bg-[#E0F2FE] p-2 rounded-[50px]`}>
            <Icon
              type="Ionicons"
              name="storefront-outline"
              color="#005FAB"
              size={28}
            />
          </View>
        </View>
      )}
      buttonAxis="vertical">
      <View>
        {updatedList?.map((item, index) => (
          <View key={item.id} style={tw`flex-row justify-between gap-10 mb-2`}>
            <CustomCheckbox
              isChecked={selectedItems.some(
                selected => selected.id === item.id,
              )}
              disableText
              fillColor="green"
              useBuiltInState={false}
              iconStyle={{borderColor: 'green'}}
              onPress={() => handleCheckboxToggle(item)}
            />

            <Text style={tw`text-darkGray text-[14px]`}>
              {item.productName}
            </Text>
            <View style={{width: 120}}>
              <QuantityInput
                disabled={
                  (item?.returnedQuantity || 0) - (item?.servedQuantity || 0) >=
                  item.returnedQuantity
                }
                value={
                  (item?.returnedQuantity || 0) - (item?.servedQuantity || 0)
                }
                onChange={value => handleChangeServe(index, value)}
              />
            </View>
          </View>
        ))}
      </View>
    </CustomModal>
  );
};

export default ModalServe;
