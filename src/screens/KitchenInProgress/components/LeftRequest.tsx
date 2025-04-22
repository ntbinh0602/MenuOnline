import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import React, {useState} from 'react';
import {fontSize} from '../../../styles/commonStyles';
import Icon from '../../../common/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useAuthStore from '../../../store/authStore';
import CustomModal from '../../../components/CustomModal';
import tw from 'twrnc';
import Colors from '../../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootParam.type';
import {NavigationStackScreens} from '../../../common/enum';
import {clearLS} from '../../../utils/auth';
type Props = {};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  NavigationStackScreens.AuthNavigation
>;
const LeftRequest: React.FC<Props> = () => {
  const [modalLogout, setModalLogout] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const {currentUser} = useAuthStore();
  const navigation = useNavigation<NavigationProps>();
  return (
    <View style={[styles.container, {paddingTop: insets.top ? 25 : 5}]}>
      <View style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={[styles.title]}>Tổng số món cần thực hiện</Text>
          <ScrollView>
            <View style={styles.itemContainer}>
              <View style={styles.badge}>
                <Text
                  style={{
                    fontSize: fontSize.font10,
                    color: 'white',
                    lineHeight: 20,
                  }}>
                  2
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Bánh mỳ nướng muối ớt</Text>
                <Text style={[styles.itemNote]}>
                  Ghi chú: Bánh mỳ nướng không muối, không ớt, không hành.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setModalLogout(true)}>
            <Icon type="Ionicons" name="exit-outline" color="red" size={24} />
            <Text numberOfLines={1} style={styles.email}>
              {currentUser?.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomModal
        visible={modalLogout}
        width={'38%'}
        title="Đăng xuất"
        onClose={() => setModalLogout(false)}
        onConfirm={() => {
          setModalLogout(false);
          InteractionManager.runAfterInteractions(() => {
            navigation.replace(NavigationStackScreens.AuthNavigation);
          });
          clearLS();
        }}
        bgColorConfirm={Colors.danger}
        confirmText="Đăng xuất"
        isLoading={false}
        modalIcon={() => (
          <View style={tw`bg-[${Colors.softPink}] p-2 rounded-[50px]`}>
            <View style={tw`bg-[${Colors.peachBlush}] p-2 rounded-[50px]`}>
              <Icon
                type="MaterialIcons"
                name="logout"
                color={Colors.danger}
                size={28}
              />
            </View>
          </View>
        )}
        buttonAxis="vertical">
        <Text style={tw`text-center text-[#535862]`}>
          Bạn có chắc muốn đăng xuất phiên đăng nhập này không?
        </Text>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    color: 'black',
    fontSize: fontSize.font14,
    fontWeight: '600',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  badge: {
    width: 20,
    height: 20,
    backgroundColor: '#005FAB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  itemInfo: {
    gap: 2,
    flex: 1,
  },
  itemTitle: {
    color: '#27272A',
    fontWeight: '600',
  },
  itemNote: {
    color: '#27272A',
  },
  footer: {
    height: 50,
    justifyContent: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F71E1E1A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  email: {
    flex: 1,
    fontSize: fontSize.font14,
    color: '#000000',
  },
});

export default LeftRequest;
