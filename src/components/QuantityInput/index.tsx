import {Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import Icon from '../../common/icons';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}
const QuantityInput: React.FC<QuantityInputProps> = ({
  value = 0,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <View style={tw`flex-row items-center gap-3`}>
      <TouchableOpacity disabled={value <= 1} onPress={() => onChange(--value)}>
        {value <= 1 ? (
          <Icon
            type="AntDesign"
            name="minuscircle"
            style={{color: '#ababab'}}
          />
        ) : (
          <Icon type="AntDesign" name="minuscircleo" />
        )}
      </TouchableOpacity>
      <Text style={tw`${className ? `${className} ` : ''}text-lg font-medium`}>
        {value}
      </Text>
      <TouchableOpacity
        disabled={disabled}
        style={{alignItems: 'center'}}
        onPress={() => onChange(++value)}>
        {disabled ? (
          <Icon type="AntDesign" name="pluscircle" style={{color: '#ababab'}} />
        ) : (
          <Icon type="AntDesign" name="pluscircleo" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default QuantityInput;
