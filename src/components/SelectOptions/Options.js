import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { DefaultTheme, Text } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';
import { camelToTitleCase } from 'libs/strings';
import { paperTheme } from 'theme';

const { primary } = DefaultTheme.colors;

function Options ({ value, options, onChange, labelUpperCase }) {
  return options.map((option, i) => {
    const label = labelUpperCase
      ? option.toUpperCase()
      : camelToTitleCase(option);
    const isSelected = value === option;

    return (
      <TouchableWithoutFeedback
        key={`${option}-${i}`}
        onPress={() => {
          onChange(option);
        }}
      >
        <View
          style={[
            {
              marginBottom: 10,
              padding: 20,
              borderWidth: 1,
              borderRadius: paperTheme.roundness,
              flexDirection: 'row',
              alignItems: 'center'
            },
            isSelected ? { borderColor: primary } : undefined
          ]}
        >
          <RNVectorIcon
            provider="Feather"
            name={isSelected ? 'check-circle' : 'circle'}
            size={20}
            color={isSelected ? primary : '#000'}
          />
          <Text
            style={[
              { marginLeft: 10 },
              isSelected ? { color: primary } : undefined
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });
}

export default React.memo(Options);
