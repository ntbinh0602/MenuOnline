import {View, Text, TextInput} from 'react-native';
import React, {useMemo, useState} from 'react';
import CustomModal from '../../../components/CustomModal';
import tw from 'twrnc';
import Icon from '../../../common/icons';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {useTheme} from '../../../provider/ThemeContext';

interface ModalRejectProps {
  openStore?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
}

const ModalReject: React.FC<ModalRejectProps> = ({
  openStore,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const {theme} = useTheme();

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Hết món',
        value: 'option1',
      },
      {
        id: '2',
        label: 'Lý do khác',
        value: 'option2',
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <CustomModal
      visible={openStore}
      width={'40%'}
      title="Từ chối"
      onClose={onClose}
      onConfirm={onConfirm}
      bgColorConfirm={theme.colors.danger}
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
      <View
        style={{
          width: '100%',
          alignItems: 'flex-start',
        }}>
        <RadioGroup
          containerStyle={{
            alignItems: 'flex-start',
            gap: 6,
          }}
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
        />
        <TextInput
          style={tw`border-1`}
          // placeholder="Nhập email hoặc số điện thoại"
          placeholder="Nhập email"
          keyboardType="default"
          placeholderTextColor="#5F5F5F"
          autoCapitalize="none"
          underlineColorAndroid="#f000"
          blurOnSubmit={false}
          returnKeyType="next"
          onChangeText={text => console.log(text)}
        />
      </View>
      {/* <QuantityInput
          disabled={10 <= valueRedo}
          value={valueRedo}
          onChange={value => handleChangeRedo(value)}
        /> */}
    </CustomModal>
  );
};

export default ModalReject;
