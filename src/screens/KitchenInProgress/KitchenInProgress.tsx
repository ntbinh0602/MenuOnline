import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useMultiSocketEvents} from '../../utils/socket';
import {MainStackScreens, SocketEnum} from '../../common/enum';
import useRequestProductStore, {
  FilterKitchen,
} from '../../store/useRequestProductStore';
import {RequestProduct} from '../../types/request.type';
import {IS_TABLET, getUpdateRequestProductQuantity} from '../../utils/common';
import {RequestTransferred} from '../../types/requestTransferred.type';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalServe from './components/ModalAction';
import CardRequest from './components/CardRequest';
import HeaderRequest from './components/HeaderRequest';
import ProcessingByDish from './Tabs/ProcessingByDish';
import {useDebounce} from '../../hooks/useDebounce';
import {Dropdown} from 'react-native-element-dropdown';
import {Table, Zone} from '../../types/table.type';
import useZoneStore from '../../store/useZoneStore';
import {Dayjs} from 'dayjs';
import Icon from '../../common/icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/rootParam.type';

type FilterValue =
  | string
  | number
  | string[]
  | number[]
  | Dayjs
  | null
  | [Dayjs | null, Dayjs | null];

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const KitchenInProgress = () => {
  const insets = useSafeAreaInsets();
  const navigate = useNavigation();
  const {fetchRequestInProgress} = useRequestProductStore();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchTerm = useDebounce(searchText, 500);
  const [filters, setFilters] = useState<FilterKitchen>({
    search: debouncedSearchTerm ?? undefined,
  });
  const {fetchZones, zones} = useZoneStore();
  useEffect(() => {
    fetchZones();
  }, []);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>(zones);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearchTerm ?? undefined,
    }));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const params = {
      ...filters,
    };
    const {page, limit, ...filterParams} = params;
    fetchRequestInProgress(filterParams);
  }, [filters]); // Thêm `activeTab` vào dependency array

  useEffect(() => {
    setFilteredTables(zones.flatMap(z => z.tables));
  }, [filters.zoneId, zones]);

  useEffect(() => {
    setFilteredZones(zones);
  }, [zones]);

  useEffect(() => {
    if (filters.tableId && zones.length > 0) {
      // Tìm khu vực chứa bàn được chọn
      let found = false;
      for (const zone of zones) {
        const tableExists = zone.tables.some(
          table => table.id === filters.tableId,
        );
        if (tableExists) {
          found = true;
          // Tự động cập nhật khu vực nếu chưa được chọn hoặc không đúng
          if (filters.zoneId !== zone.id) {
            handleFiltersChange({zoneId: zone.id});
          }
          break;
        }
      }

      // Nếu không tìm thấy bàn trong bất kỳ khu vực nào
      if (!found) {
        handleFiltersChange({tableId: undefined});
      }
    }
  }, [filters.tableId, zones]);

  // lọc danh sách bàn theo khu vực
  useEffect(() => {
    if (filters.zoneId) {
      const zone = zones.find(z => z.id === filters.zoneId);
      if (zone) {
        setFilteredTables(zone.tables);
        // Kiểm tra xem bàn đã chọn có nằm trong danh sách mới không
        const isTableValid = zone.tables.some(t => t.id === filters.tableId);
        console.log('🇻🇳 👉 isTableValid', isTableValid);

        if (!isTableValid && filters.tableId) {
          handleFiltersChange({tableId: undefined});
        }
      }
    } else {
      // Nếu không chọn khu vực, hiển thị tất cả bàn
      setFilteredTables(zones.flatMap(z => z.tables));
    }
  }, [filters.zoneId, zones]);

  const handleFiltersChange = (newFilters: Partial<FilterKitchen>) => {
    setFilters(prev => ({...prev, ...newFilters}));
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      <HeaderRequest />
      <TouchableOpacity
        onPress={() => navigation.navigate(MainStackScreens.History)}>
        <Text>Lich Su</Text>
      </TouchableOpacity>
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={{marginTop: 20}}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={
              filteredTables?.map(item => ({
                value: item.id,
                label: item.name,
              })) || []
            }
            containerStyle={{marginTop: 4, borderRadius: 10}}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Bàn"
            value={filters.tableId}
            onChange={item => {
              setFilters(prev => ({
                ...prev,
                tableId: item.value || undefined, // Use item.value instead of entire item
              }));
            }}
            renderRightIcon={() => (
              <Icon
                type="EvilIcons"
                name={`${filters.tableId ? 'close-o' : 'chevron-down'}`}
                style={styles.icon}
              />
            )}
            renderItem={(item: any) => (
              <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
              </View>
            )}
            flatListProps={{
              ListEmptyComponent: () => (
                <Text style={{padding: 10, color: 'gray', alignSelf: 'center'}}>
                  Không có dữ liệu
                </Text>
              ),
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Dropdown
            closeModalWhenSelectedItem={true}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={
              filteredZones?.map(item => ({
                value: item.id,
                label: item.name,
              })) || []
            }
            containerStyle={{marginTop: 4, borderRadius: 10}}
            maxHeight={300}
            labelField="label"
            searchPlaceholder="Tìm kiếm khu vực"
            valueField="value"
            placeholder="Khu vực"
            value={filters.zoneId} // Changed from tableId to zoneId
            onChange={item => {
              setFilters(prev => ({
                ...prev,
                tableId: undefined, // Reset tableId when zoneId changes
                zoneId: item.value || undefined, // Use item.value instead of entire item
              }));
            }}
            renderLeftIcon={() => <Text></Text>}
            renderItem={(item: any) => (
              <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
              </View>
            )}
            flatListProps={{
              ListEmptyComponent: () => (
                <Text style={{padding: 10, color: 'gray', alignSelf: 'center'}}>
                  Không có dữ liệu
                </Text>
              ),
            }}
          />
        </View>
      </View> */}
      <ProcessingByDish filters={filters} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    fontSize: 28,
    color: '#282828',
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

export default KitchenInProgress;
