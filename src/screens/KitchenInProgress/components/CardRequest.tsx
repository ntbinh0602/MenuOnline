import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {CustomButton} from '../../../components/CustomButton';
import {fontSize} from '../../../styles/commonStyles';
import Icon from '../../../common/icons';
import {Notifications} from '../../../types/notification';
import {generateImageURL} from '../../../utils/utils';
import {RequestProduct} from '../../../types/request.type';
import tw from 'twrnc';

interface CardRequestProps {
  item: RequestProduct;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const CardRequest: React.FC<CardRequestProps> = ({
  item,
  onCancel,
  onConfirm,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
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
        marginBottom: 10,
        gap: 10,
      }}>
      <View
        style={tw`rounded-[5px] w-[80px] h-[80px] overflow-hidden bg-red-200 relative`}>
        <Image
          style={tw`w-full h-full`}
          source={{
            uri: `${generateImageURL(item?.product?.thumbnail)}`,
          }}
        />
        <View style={tw`absolute inset-0 bg-black/20`} />

        <Text
          style={tw`text-[14px] text-white px-[4px] py-[2px] rounded-[5px] font-medium absolute top-0 right-0 min-w-[50%] text-center z-10`}>
          {item.completedQuantity || 0} / {item.quantity || 0}
        </Text>
      </View>
      <Text style={{alignSelf: 'center'}}>{item?.productName}</Text>
      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          alignSelf: 'center',
        }}>
        <TouchableOpacity onPress={onCancel}>
          <Icon type="AntDesign" name="closecircle" color="red" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm}>
          <Icon type="AntDesign" name="closecircle" color="#005FAB" size={28} />
        </TouchableOpacity>
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
