import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DatePickerModal from '../../../components/DatePickerModal';
import moment from 'moment';
import CustomModal from '../../../components/CustomModal';
import {useTheme} from '../../../provider/ThemeContext';
import useRequestProductStore, {
  FilterKitchen,
} from '../../../store/useRequestProductStore';
import {FlatList} from 'react-native';
import {checkDuplicateId} from '../../../utils/common';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import dayjs from 'dayjs';
import {RoleType} from '../../../common/enum';

const History = () => {
  const {theme} = useTheme();
  const currentDate = new Date();
  const {fetchRequestHistory} = useRequestProductStore();
  const [filters, setFilters] = useState<FilterKitchen>({
    search: undefined,
    role: RoleType.CHEF,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const ISODate = moment(selectedDate).format('YYYY-MM-DD');
  const [modalDatePicker, setModalDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {data, isLoadMore, handleLoadMore} = useInfiniteScroll<any>(
    fetchRequestHistory,
    filters,
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={() => setModalDatePicker(true)}>
        <Text>Ngày</Text>
      </TouchableOpacity>

      {/* <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>
              {item?.requestProduct?.productName}{' '}
              {item?.requestProduct.request?.sessionCustomer?.customer?.name}{' '}
              {index + 1}
            </Text>
            <Text>{item?.id} </Text>
          </View>
        )}
        // contentContainerStyle={{paddingBottom: 20}}
        scrollEventThrottle={280}
        onEndReached={() => {
          // console.log('🇻🇳 👉 run');
          handleLoadMore();
        }}
        onEndReachedThreshold={0.01}
        ListFooterComponent={
          <View>
            {isLoadMore && (
              <Text style={{fontWeight: '600'}}>Đang tải thêm...</Text>
            )}
          </View>
        }
      /> */}

      <FlatList
        data={data}
        numColumns={1}
        renderItem={({item, index}) => (
          // <TouchableOpacity
          //   onPress={() => {
          //     navigation.navigate('DigitalMuseum', {
          //       urlMuseum: item.link,
          //       title: item.title,
          //     });
          //   }}>
          //   <Item
          //     image={item.pathThumb}
          //     title={item.title}
          //     thumbnail={item?.img && `${item?.img?.link}?alt=media`}
          //     containerStyle={{
          //       width:
          //         IS_TABLET && filteredList?.length > 1
          //           ? WIDTH / 2 - 30
          //           : WIDTH - 30,
          //     }}
          //   />
          // </TouchableOpacity>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>
              {item?.requestProduct?.productName} {index + 1}
            </Text>
            <Text>{item?.id} </Text>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 20}}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        scrollEventThrottle={250}
        onEndReached={info => {
          console.log('🇻🇳 👉 run');
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
          <View style={{paddingTop: 20}}>
            <Text style={{textAlign: 'center'}}>Không có dữ liệu</Text>
          </View>
        )}
      />

      <CustomModal
        visible={modalDatePicker}
        headerVisible={false}
        width={'90%'}
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
            setFilters(prev => ({
              ...prev,
              startDate: dayjs(startDateSelected),
              endDate: dayjs(endDateSelected),
            }));
            setModalDatePicker(false);
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
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
});

export default History;
