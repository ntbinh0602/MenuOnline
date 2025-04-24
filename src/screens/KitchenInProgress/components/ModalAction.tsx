import {View, Text} from 'react-native';
import React from 'react';
import CustomModal from '../../../components/CustomModal';
import Icon from '../../../common/icons';
import tw from 'twrnc';
import QuantityInput from '../../../components/QuantityInput';
import {IS_TABLET} from '../../../utils/common';

interface ModalActionProps {
  openStore?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  dataChange: any[];
  dataTemp?: any[];
  actionType: 'complete' | 'cancel';
  handleChangeValue: (index: number, value: number) => void;
}

const ModalAction: React.FC<ModalActionProps> = ({
  openStore,
  onClose,
  onConfirm,
  dataChange,
  dataTemp,
  actionType,
  handleChangeValue,
  isLoading = false,
}) => {
  return (
    <CustomModal
      visible={openStore}
      width={IS_TABLET ? '44%' : '90%'}
      title="Phục vụ"
      onClose={() => {
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
        {dataChange?.map((item, index) => {
          const matchedItem = dataTemp?.find(
            tempItem => tempItem.key === item?.key,
          );
          return (
            <View
              key={item.id}
              style={tw`flex-row justify-between gap-10 mb-2`}>
              <Text style={tw`text-[14px]`}>{item.productName}</Text>
              <View style={{width: 120}}>
                {actionType === 'cancel' && (
                  <QuantityInput
                    disabled={
                      (item?.quantity || 0) - (item?.completedQuantity || 0) >=
                      (matchedItem?.quantity || 0) -
                        (matchedItem?.completedQuantity || 0)
                    }
                    value={
                      (item?.quantity || 0) - (item?.completedQuantity || 0)
                    }
                    onChange={value => handleChangeValue(index, value)}
                  />
                )}
                {actionType === 'complete' && (
                  <QuantityInput
                    disabled={
                      (item?.quantity || 0) - (item?.completedQuantity || 0) >=
                      (matchedItem?.quantity || 0) -
                        (matchedItem?.completedQuantity || 0)
                    }
                    value={
                      (item?.quantity || 0) - (item?.completedQuantity || 0)
                    }
                    onChange={value => handleChangeValue(index, value)}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </CustomModal>
  );
};

export default ModalAction;
