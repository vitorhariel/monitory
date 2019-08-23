import React from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../../constants/theme';

import {ButtonComponent, GradientButton, BorderlessButton} from './styles';

export default function Button({
  children,
  loading,
  onPress,
  gradient,
  borderless,
  style,
  colors,
  ...rest
}) {
  return borderless ? (
    <BorderlessButton
      {...rest}
      onPress={onPress}
      style={style}
      disabled={loading}>
      {loading ? <ActivityIndicator size="small" color="#fff" /> : children}
    </BorderlessButton>
  ) : (
    <GradientButton gradient={gradient} colors={colors} style={style}>
      <ButtonComponent {...rest} onPress={onPress} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : children}
      </ButtonComponent>
    </GradientButton>
  );
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  gradient: PropTypes.bool,
  borderless: PropTypes.bool,
  style: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  colors: PropTypes.arrayOf(PropTypes.string),
};

Button.defaultProps = {
  children: null,
  onPress: null,
  loading: false,
  gradient: false,
  borderless: false,
  style: {
    height: 44,
    width: 220,
  },
  colors: [Colors.primary, Colors.secondary],
};
