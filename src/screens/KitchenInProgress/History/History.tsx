import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DatePickerModal from '../../../components/DatePickerModal';
import moment from 'moment';
import CustomModal from '../../../components/CustomModal';
import {useTheme} from '../../../provider/ThemeContext';
import useRequestProductStore, {
  FilterKitchen,
} from '../../../store/useRequestProductStore';
import {FlatList} from 'react-native';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import dayjs from 'dayjs';
import {RoleType} from '../../../common/enum';
import LoadingLayer from '../../../components/Loading/LoadingLayer';
import {Dropdown} from 'react-native-element-dropdown';
import useZoneStore from '../../../store/useZoneStore';
import {Table, Zone} from '../../../types/table.type';
import {useDebounce} from '../../../hooks/useDebounce';
import Icon from '../../../common/icons';
import {IS_TABLET} from '../../../utils/common';

const History = () => {
  const {theme} = useTheme();
  const currentDate = new Date();
  const {fetchRequestHistory, updateServeOrRemade} = useRequestProductStore();
  const [filters, setFilters] = useState<FilterKitchen>({
    search: undefined,
    role: RoleType.STAFF,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const ISODate = moment(selectedDate).format('YYYY-MM-DD');
  const [modalDatePicker, setModalDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const {data, isLoadMore, handleLoadMore, updateDatas} =
    useInfiniteScroll<any>(fetchRequestHistory, filters);
  const handleServeOrRemade = async (id: string) => {
    await updateServeOrRemade(
      [
        {
          quantity: 1,
          id: id,
          reason: '123123123', // Chỉ gửi lý do khi làm lại món
        },
      ],
      false,
    );

    await fetchRequestHistory(filters)
      .then((res: any) => {
        updateDatas(res?.data[0]);
      })
      .catch((err: any) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const [searchText, setSearchText] = useState('');
  const debouncedSearchTerm = useDebounce(searchText, 500);
  const {fetchZones, zones} = useZoneStore();
  useEffect(() => {
    fetchZones();
  }, []);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>(zones);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearchTerm ?? undefined,
    }));
  }, [debouncedSearchTerm]);

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

  console.log('🇻🇳 👉 data', data);
  return (
    <View style={styles.container}>
      {isLoading && <LoadingLayer />}
      <View style={styles.searchContainer}>
        <View style={{flex: 1, width: '100%'}}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={{flex: 1, width: '100%'}}>
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
        <View style={{flex: 1, width: '100%'}}>
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
        <View style={{flex: 1, width: '100%'}}>
          <TouchableOpacity
            style={{marginBottom: 20}}
            onPress={() => setModalDatePicker(true)}>
            <Text>Ngày</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        numColumns={3}
        renderItem={({item, index}) => (
          <View style={{width: '33.3%'}}>
            <View style={[styles.itemContainer]}>
              <Text style={styles.itemTitle}>
                {item?.requestProduct?.productName} {index + 1}
              </Text>
              <Text>Số lượng : {item?.quantity}</Text>
              <Text>Trạng thái : {item?.status}</Text>
              <Text>
                {item?.requestProduct?.request?.table?.name} -
                {item?.requestProduct?.request?.table?.zone?.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleServeOrRemade(item?.requestProduct.id)}>
                <Text>Làm lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 20}}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        scrollEventThrottle={250}
        onEndReached={info => {
          handleLoadMore();
        }}
        onEndReachedThreshold={0.01}
        ListFooterComponent={
          isLoadMore && data?.length > 0 ? (
            <View style={{marginBottom: 40}}>
              <Text style={{fontWeight: '600'}}>Đang tải thêm...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View>
            <Text style={{textAlign: 'center'}}>Không có dữ liệu</Text>
          </View>
        )}
      />

      <CustomModal
        visible={modalDatePicker}
        headerVisible={false}
        width={IS_TABLET ? '50%' : '90%'}
        closeVisible={false}
        confirmVisible={false}
        bgColorConfirm={theme.colors.primary}
        confirmText="Ngày"
        onClose={() => {
          setModalDatePicker(false);
          // setStartDate('');
          // setEndDate('');
        }}
        isLoading={false}
        buttonAxis="vertical">
        <DatePickerModal
          dropdownOverlayColor={'transparent'}
          onFilter={(startDateSelected, endDateSelected) => {
            setModalDatePicker(false);
            setTimeout(() => {
              setFilters(prev => ({
                ...prev,
                startDate: dayjs(startDateSelected),
                endDate: dayjs(endDateSelected),
              }));
            }, 300);
          }}
          date={selectedDate}
          onPressHeaderTitle={() => {
            setModalDatePicker(true);
          }}
          ISODate={ISODate}
          selectedDate={date => {
            setSelectedDate(date);
          }}
          maxDate={
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          }
          onClose={() => {
            setStartDate('');
            setEndDate('');
            setModalDatePicker(false);
          }}
          startDate={startDate}
          setStartDate={date => setStartDate(date)}
          endDate={endDate}
          setEndDate={date => setEndDate(date)}
        />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
    borderRadius: 10,

    elevation: 5,
    marginHorizontal: 10,
    marginBottom: 20,
    gap: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  searchContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
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

export default History;
