import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomModal from '../../../components/CustomModal';
import Icon from '../../../common/icons';
import tw from 'twrnc';
import {RequestProduct} from '../../../types/request.type';
import QuantityInput from '../../../components/QuantityInput';
import CustomCheckbox from '../../../components/CustomCheckbox';
import {IS_TABLET} from '../../../utils/common';

interface ModalServeProps {
  openStore?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  valueServe: RequestProduct[];
}

const ModalServe: React.FC<ModalServeProps> = ({
  openStore,
  onClose,
  onConfirm,
  valueServe,
  isLoading = false,
}) => {
  const [updatedList, setUpdatedList] = useState<RequestProduct[]>([]);
  const [selectedItems, setSelectedItems] = useState<RequestProduct[]>([]);

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
    setUpdatedList(valueServe);
  }, []);

  return (
    <CustomModal
      visible={openStore}
      width={IS_TABLET ? '44%' : '90%'}
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
