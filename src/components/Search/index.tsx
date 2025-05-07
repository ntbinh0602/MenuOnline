import {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import {useDebounce} from '../../hooks/useDebounce';

interface DebouncedSearchProps {
  onSearch?: (value: string | undefined) => void;
  delay?: number;
  defaultValue?: string | number | null;
  className?: string;
  placeholder?: string;
}
const SearchInput = ({
  onSearch = () => {},
  delay = 500,
  defaultValue = '',
  placeholder = 'Search...',
  ...props
}: DebouncedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(String(defaultValue));
  const debouncedValue = useDebounce(searchTerm, delay);
  const prevValueRef = useRef(defaultValue);

  useEffect(() => {
    setSearchTerm(String(defaultValue ?? ''));
  }, [defaultValue]);

  const handleChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  useEffect(() => {
    if (debouncedValue.trim() !== String(prevValueRef.current).trim()) {
      prevValueRef.current = debouncedValue;
      onSearch(debouncedValue.trim() || undefined);
    }
  }, [debouncedValue, onSearch]);

  return (
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      value={searchTerm}
      onChangeText={handleChange}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default SearchInput;
