import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {CustomButton} from '../../../components/CustomButton';
import {fontSize} from '../../../styles/commonStyles';
import Icon from '../../../common/icons';
import {Notifications} from '../../../types/notification';

interface CardRequestProps {
  item: Notifications;
  handleReject: () => void;
  handleServe: () => void;
}

const CardRequest: React.FC<CardRequestProps> = ({
  item,
  handleReject,
  handleServe,
}) => {
  return (
    <View style={styles.item}>
      <View style={styles.flex1}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>#1</Text>
            <Text style={styles.timeText}>9 phút trước</Text>
          </View>
          <Text style={styles.tableText}>Tầng 1 - Bàn 1</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.orderInfo}>
            <Text style={styles.text}>5/10</Text>
            <View style={styles.orderDetails}>
              <Text style={styles.text}>{item?.name}</Text>
              <Text style={styles.noteText}>
                Ghi chú: Bánh mỳ nướng không muối, không ớt, không hành.
              </Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <Icon
              type="Ionicons"
              name={'checkmark-circle'}
              color="#16A34A"
              size={24}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          buttonStyle={styles.rejectButton}
          type="danger"
          textStyle={{fontSize: fontSize.font12}}
          onPress={handleReject}>
          Từ chối
        </CustomButton>
        <CustomButton
          buttonStyle={styles.acceptButton}
          type="primary"
          textStyle={{fontSize: fontSize.font12}}
          onPress={handleServe}>
          <Text>Hoàn tất đơn</Text>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    maxWidth: '32%',
    backgroundColor: 'white',
    borderRadius: 6,
    minHeight: 50,
    marginHorizontal: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  flex1: {
    flex: 1,
  },
  header: {
    backgroundColor: '#005FAB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerText: {
    color: 'white',
    fontSize: fontSize.font10,
    fontWeight: '500',
  },
  timeText: {
    color: 'white',
    fontSize: fontSize.font10,
  },
  tableText: {
    color: 'white',
    fontWeight: '600',
    fontSize: fontSize.font12,
  },
  content: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderBottomColor: '#F4F4F5',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  orderDetails: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.font14,
    fontWeight: 'bold',
    color: 'black',
  },
  noteText: {
    color: '#52525B',
    fontSize: fontSize.font12,
  },
  iconWrapper: {
    width: 26,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
});

export default CardRequest;
