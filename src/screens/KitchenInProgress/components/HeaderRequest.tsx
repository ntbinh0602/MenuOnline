import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fontSize} from '../../../styles/commonStyles';
import Icon, {Icons} from '../../../common/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomModal from '../../../components/CustomModal';
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
import SelectDropdown from 'react-native-select-dropdown';
import {IS_TABLET} from '../../../utils/common';
import {useTheme} from '../../../provider/ThemeContext';
import {Dropdown} from 'react-native-element-dropdown';
import {useKeyboardVisible} from '../../../hooks/useKeyboardVisible';

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
  const {theme, updateTheme} = useTheme();
  const isKeyboardVisible = useKeyboardVisible();

  const getUserStores = (userStores: Array<UserStore>) => {
    return userStores.map(currentUserStore => ({
      value: currentUserStore.storeId,
      label: currentUserStore.store.name,
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

  const renderItem = (item: Option) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label} 12</Text>
        {item.value === selectedStore && <Text>123</Text>}
      </View>
    );
  };
  useEffect(() => {
    if (currentUser?.currentUserStore?.store?.primaryColor) {
      updateTheme({
        primary: currentUser.currentUserStore.store.primaryColor,
      });
    }
  }, [currentUser?.currentUserStore?.store?.primaryColor]);

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
                color={theme.colors.primary}
                size={26}
              />
              <Text style={[styles.sortText, {color: theme.colors.primary}]}>
                Sắp xếp
              </Text>
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
        width={IS_TABLET ? '46%' : '90%'}
        title="Chọn cửa hàng"
        contentStyle={{paddingBottom: 120}}
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
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={getUserStores(currentUser?.userStores || [])}
          search
          containerStyle={{marginTop: 4, borderRadius: 10}}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Tìm kiếm cửa hàng"
          value={selectedStore}
          onChange={item => {
            setSelectedStore(item.value);
          }}
          renderLeftIcon={() => <Text></Text>}
          renderItem={renderItem}
          flatListProps={{
            ListEmptyComponent: () => (
              <Text style={{padding: 10, color: 'gray', alignSelf: 'center'}}>
                Không có dữ liệu
              </Text>
            ),
          }}
        />
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
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default HeaderRequest;
