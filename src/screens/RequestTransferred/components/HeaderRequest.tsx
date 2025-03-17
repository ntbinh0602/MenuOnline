import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fontSize} from '../../../styles/commonStyles';
import Icon, {Icons} from '../../../common/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomModal from '../../../components/CustomModal';
import SelectDropdown from 'react-native-select-dropdown';
import {UserStore} from '../../../types/user.type';
import {roleTypes} from '../../../common/constant';
import useAuthStore from '../../../store/authStore';
import {Option} from '../../../types/utils.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../types/rootParam.type';
import {NavigationStackScreens} from '../../../common/enum';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import tw from 'twrnc';
import {InteractionManager} from 'react-native';

interface HeaderRequestProps {}

// Khai báo kiểu navigation
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  NavigationStackScreens.MainNavigation
>;

const HeaderRequest: React.FC<HeaderRequestProps> = () => {
  const navigation = useNavigation<NavigationProps>();
  const [valueRedo, setValueRedo] = useState<number>(1);
  const {currentUser, getCurrentUser, chooseStore, isLoading} = useAuthStore();
  const [openStore, setOpenStore] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const getUserStores = (userStores: Array<UserStore>) => {
    return userStores.map(currentUserStore => ({
      value: currentUserStore.storeId,
      label: `${
        roleTypes.find(roleType => roleType.value === currentUserStore.role)
          ?.label || ''
      } ${currentUserStore.store.name}`,
    }));
  };
  useEffect(() => {
    if (currentUser) {
      setSelectedStore(currentUser?.currentUserStore?.storeId);
    }
  }, [currentUser]);
  const handleChangeStore = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const res = await chooseStore({
        token: accessToken || '',
        storeId: selectedStore || '',
      });
      await AsyncStorage.setItem('accessToken', res?.accessToken as string);
      getCurrentUser();
      setOpenStore(false);
      InteractionManager.runAfterInteractions(() => {
        navigation.replace(NavigationStackScreens.MainNavigation);
      });
    } catch (error) {}
  };

  const handleChangeRedo = (value: number) => {
    setValueRedo(value);
  };

  return (
    <>
      <View style={[styles.rowContainer, {paddingTop: insets.top ? 10 : 5}]}>
        <View style={styles.requestBox}>
          <Text style={styles.requestText}>Yêu cầu gọi món</Text>
          <TouchableOpacity
            style={{backgroundColor: 'white'}}
            onPress={() => console.log('123123')}>
            <View style={styles.sortWrapper}>
              <Icon
                type="Foundation"
                name={'filter'}
                color="#005FAB"
                size={26}
              />
              <Text style={styles.sortText}>Sắp xếp</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setOpenStore(true)}
          style={styles.storeBox}>
          <Icon type="FontAwesome5" name={'store'} color="#EA580C" />
          <Text numberOfLines={1} style={styles.storeText}>
            {currentUser?.currentUserStore?.store?.name}
          </Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={openStore}
        width={'46%'}
        title="Chọn cửa hàng"
        onClose={() => setOpenStore(false)}
        onConfirm={handleChangeStore}
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
        <SelectDropdown
          data={getUserStores(currentUser?.userStores || [])} // Kiểm tra giá trị này
          onSelect={(selectedItem: Option, index: number) => {
            setSelectedStore(selectedItem.value);
          }}
          defaultValue={getUserStores(currentUser?.userStores || []).find(
            store => store.value === currentUser?.currentUserStore?.storeId,
          )}
          renderButton={(selectedItem: Option | null, isOpened: boolean) => (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.label) || 'Chọn cửa hàng'}
              </Text>
            </View>
          )}
          renderItem={(item: Option, index: number, isSelected: boolean) => (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: '#D2D9DF'}),
              }}>
              <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        {/* <QuantityInput
          disabled={10 <= valueRedo}
          value={valueRedo}
          onChange={value => handleChangeRedo(value)}
        /> */}
      </CustomModal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  requestBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.7,
    marginRight: 16,
  },
  requestText: {
    fontSize: fontSize.font15,
    color: 'black',
    fontWeight: '600',
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: '#005FAB',
    fontSize: fontSize.font14,
    fontWeight: '600',
    marginLeft: 10,
  },
  storeBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.3,
  },
  storeText: {
    fontSize: fontSize.font14,
    color: '#EA580C',
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 30,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});

export default HeaderRequest;
