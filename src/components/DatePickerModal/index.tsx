import moment from 'moment';
import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {showMessage} from 'react-native-flash-message';
import Icon from '../../common/icons';
import {CustomButton} from '../CustomButton';
import {IS_TABLET} from '../../utils/common';

import {fontSize, hp, wp} from '../../styles/commonStyles';
import {useTheme} from '../../provider/ThemeContext';

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ],
  dayNames: [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

// Đặt ngôn ngữ mặc định là tiếng Việt
LocaleConfig.defaultLocale = 'vi';

interface DatePickerModalProps {
  dropdownStyle?: ViewStyle; // Add this line
  dropdownOverlayColor?: string;
  buttonStyle?: ViewStyle;
  onFilter: (startDate: string, endDate: string) => void;
  date: Date;
  onPressHeaderTitle?: () => void;
  ISODate: string;
  selectedDate: (date: Date) => void;
  maxDate: Date;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onClose: () => void;
}

const DatePickerModal = React.forwardRef<{}, DatePickerModalProps>(
  (props, ref) => {
    const {
      onFilter,
      date,
      onPressHeaderTitle,
      ISODate,
      selectedDate,
      maxDate,
      startDate,
      setStartDate,
      endDate,
      onClose,
      setEndDate,
    } = props;

    const {theme} = useTheme();

    const [selectedDates, setSelectedDates] = useState({});
    const [startDateSelected, setStartDateSelected] = useState('');
    const [endDateSelected, setEndDateSelected] = useState('');
    const [selectedDateCalendar, setSelectedDateCalendar] = useState(date);
    useEffect(() => {
      setSelectedDateCalendar(date);
      if (startDate != '' && endDate == '') {
        setSelectedDates({
          [startDate]: {
            startingDay: true,
            endingDay: true,
            color: theme.colors.primary,
            textColor: theme.colors.white,
          },
        });
        setStartDateSelected(convertToISOString(startDate, true));
        setEndDateSelected(convertToISOString(startDate));
      } else if (startDate != '' && endDate != '') {
        const range = getDatesRange(startDate, endDate);
        let markedRange: {[key: string]: any} = {};
        range.forEach((date, index) => {
          if (index === 0) {
            markedRange[date] = {
              startingDay: true,
              color: theme.colors.primary,
              textColor: theme.colors.white,
            };
          } else if (index === range.length - 1) {
            markedRange[date] = {
              endingDay: true,
              color: theme.colors.primary,
              textColor: theme.colors.white,
            };
          } else {
            markedRange[date] = {
              color: theme.colors.primary,
              textColor: theme.colors.white,
            };
          }
        });
        setSelectedDates(markedRange);
        // Lưu giá trị endDateSelected
        setStartDateSelected(convertToISOString(startDate, true));
        setEndDateSelected(convertToISOString(endDate));
      }
    }, [date]);

    const convertToISOString = (dateStr: any, startDay = false) => {
      const date = new Date(dateStr);

      if (startDay) {
        // Nếu là startDate thì lùi lại 1 ngày và đặt giờ là 17:00
        date.setDate(date.getDate() - 1);
        date.setUTCHours(17, 0, 0, 0);
      } else {
        // Nếu là endDate thì giữ nguyên và đặt giờ là 16:59
        date.setUTCHours(16, 59, 0, 0);
      }

      return date.toISOString();
    };

    const onDayPress = (day: any) => {
      const selectedDate = day.dateString;

      // Nếu chưa có startDate hoặc đã có cả startDate và endDate
      if (!startDate || (startDate && endDate)) {
        // Reset lại startDate và endDate, chọn lại ngày bắt đầu
        setStartDate(selectedDate);
        setEndDate(''); // Reset endDate khi chọn ngày mới
        setSelectedDates({
          [selectedDate]: {
            startingDay: true,
            endingDay: true, // Khi chỉ chọn 1 ngày thì start và end giống nhau
            color: theme.colors.primary,
            textColor: theme.colors.white,
          },
        });
        // Lưu giá trị startDateSelected, lùi lại 1 ngày
        setStartDateSelected(convertToISOString(selectedDate, true));
        setEndDateSelected(convertToISOString(selectedDate));
      } else {
        // Nếu đã có startDate, kiểm tra xem ngày được chọn có trước startDate không
        const isBeforeStartDate = new Date(selectedDate) < new Date(startDate);

        if (isBeforeStartDate) {
          // Nếu ngày được chọn trước startDate, đặt lại startDate với ngày mới
          setStartDate(selectedDate);
          setEndDate(''); // Reset endDate khi chọn ngày mới
          setSelectedDates({
            [selectedDate]: {
              startingDay: true,
              endingDay: true, // Khi chỉ chọn 1 ngày thì start và end giống nhau
              color: theme.colors.primary,
              textColor: theme.colors.white,
            },
          });
          // Lưu lại giá trị mới của startDateSelected
          setStartDateSelected(convertToISOString(selectedDate, true));
          setEndDateSelected(convertToISOString(selectedDate));
        } else {
          // Nếu ngày được chọn sau hoặc bằng startDate, chọn nó làm endDate
          const newEndDate = selectedDate;

          if (new Date(newEndDate) >= new Date(startDate)) {
            setEndDate(newEndDate);

            // Đánh dấu các ngày từ startDate đến endDate
            const range = getDatesRange(startDate, newEndDate);
            let markedRange = {};
            range.forEach((date, index) => {
              if (index === 0) {
                markedRange[date] = {
                  startingDay: true,
                  color: theme.colors.primary,
                  textColor: theme.colors.white,
                };
              } else if (index === range.length - 1) {
                markedRange[date] = {
                  endingDay: true,
                  color: theme.colors.primary,
                  textColor: theme.colors.white,
                };
              } else {
                markedRange[date] = {
                  color: theme.colors.primary,
                  textColor: theme.colors.white,
                };
              }
            });

            setSelectedDates(markedRange);
            // Lưu giá trị endDateSelected
            setEndDateSelected(convertToISOString(newEndDate));
          }
        }
      }
    };

    // Hàm tạo mảng các ngày trong khoảng từ startDate đến endDate
    const getDatesRange = (start: any, end: any) => {
      let dates = [];
      let currentDate = new Date(start);
      const lastDate = new Date(end);

      while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    };

    const getNewSelectedDate = useCallback(
      (date: any, shouldAdd: any) => {
        const newMonth = new Date(date).getMonth();
        let tempDate = new Date(date.setDate(1));
        const month = shouldAdd ? newMonth + 1 : newMonth - 1;
        const newDate = new Date(tempDate.setMonth(month));
        const newSelected = new Date(newDate.setDate(1));
        selectedDate(new Date(newSelected));
        return newSelected;
      },
      [selectedDateCalendar],
    );

    const onPressArrowLeft = useCallback(
      (subtract: any, month: any) => {
        const newDate = getNewSelectedDate(month, false);
        subtract();
        setSelectedDateCalendar(newDate);
        selectedDate(newDate);
      },
      [getNewSelectedDate],
    );

    const onPressArrowRight = useCallback(
      (add: any, month: any) => {
        const newDate = getNewSelectedDate(month, true);
        add();
        setSelectedDateCalendar(newDate);
        selectedDate(newDate);
      },
      [getNewSelectedDate],
    );

    const CustomHeaderTitle = (
      <TouchableOpacity onPress={onPressHeaderTitle}>
        <Text
          style={{
            ...styles.customTitle,
            fontSize: IS_TABLET ? fontSize.font18 : 18,
            color: '#000',
          }}>
          {`Tháng ${moment(selectedDateCalendar).format('MM')}`}
        </Text>
        <Text style={styles.customTitle}>
          {moment(selectedDateCalendar).format('YYYY')}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View>
        <Calendar
          style={{
            width: '100%',
          }}
          minDate={'2024-01-01'}
          maxDate={`${maxDate.getFullYear()}-${(maxDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${maxDate
            .getDate()
            .toString()
            .padStart(2, '0')}`}
          initialDate={ISODate}
          markingType={'period'}
          markedDates={selectedDates}
          onDayPress={onDayPress}
          customHeaderTitle={CustomHeaderTitle}
          onPressArrowLeft={onPressArrowLeft}
          onPressArrowRight={onPressArrowRight}
          renderArrow={direction => (
            <Icon
              type="AntDesign"
              name={direction === 'left' ? 'left' : 'right'}
              size={wp(IS_TABLET ? 1.5 : 4)}
              color={theme.colors.primary}
            />
          )}
          enableSwipeMonths={true}
        />
        <View style={styles.buttonsWrapper}>
          <CustomButton type="default" onPress={onClose}>
            Hủy bỏ
          </CustomButton>
          <CustomButton
            type="primary"
            onPress={() => {
              if (startDateSelected == '') {
                showMessage({
                  message: 'Chưa chọn ngày tìm kiếm !',
                  type: 'info',
                });
                return;
              }
              onFilter(startDateSelected, endDateSelected);
            }}>
            Xác nhận
          </CustomButton>
        </View>
      </View>
    );
  },
);

export default forwardRef<{}, DatePickerModalProps>((props, ref) => (
  <DatePickerModal {...props} ref={ref} />
));

const styles = StyleSheet.create({
  dropdownBtn: {position: 'relative'},
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    zIndex: 99,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  notiItemWrapper: {
    width: '100%',
    // backgroundColor: ColorCategory.lightBlue,
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
  },
  notiContentWrapper: {
    flex: 1,
    rowGap: 8,
    flexDirection: 'column',
  },
  notiTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notiTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor: ColorCategory.mainRed,
  },
  listHeader: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    // backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsWrapper: {
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  btnApply: {
    height: hp(5),
    width: wp(IS_TABLET ? 10 : 20),
    borderRadius: 10,
  },
  customTitle: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: IS_TABLET ? fontSize.font14 : 12,
  },
});
