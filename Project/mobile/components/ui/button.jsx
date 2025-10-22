// components/ui/Button.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { radius } from "../../theme/radius";

/**
 * Button component đa dụng cho app
 * 
 * 🔸 Props:
 * - variant: 'launch' | 'login' | 'filter' | 'wishlist' | 'boarding'
 * - label: string (nội dung nút)
 * - onPress: function
 * - disabled: boolean
 * - active: boolean (dành cho toggle/menu switch)
 * - icon?: ReactNode (nếu có)
 */
export const Button = ({
  variant = "launch",
  label,
  onPress,
  disabled = false,
  active = false,
  icon,
}) => {
  const styleSet = getStyleByVariant(variant, active);

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styleSet.container,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      onPress={!disabled ? onPress : null}
    >
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={[styles.label, styleSet.label]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: radius.m,
  },
  label: {
    ...typography.buttonText,
    textAlign: "center",
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});

/**
 * Hàm định nghĩa style theo từng loại nút
 */
function getStyleByVariant(variant, active) {
  switch (variant) {
    case "launch":
      return {
        container: {
          backgroundColor: COLORS.primary,
        },
        label: {
          color: COLORS.onPrimary,
        },
      };

    case "login":
      return {
        container: {
          backgroundColor: COLORS.secondary,
        },
        label: {
          color: COLORS.onSecondary,
        },
      };

    case "filter":
      return {
        container: {
          backgroundColor: active ? COLORS.primary : COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.outline,
        },
        label: {
          color: active ? COLORS.onPrimary : COLORS.textPrimary,
        },
      };

    case "wishlist":
      return {
        container: {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.primary,
        },
        label: {
          color: COLORS.primary,
        },
      };

    case "boarding":
      return {
        container: {
          backgroundColor: COLORS.primaryLight,
        },
        label: {
          color: COLORS.onPrimary,
        },
      };

    default:
      return {
        container: { backgroundColor: COLORS.primary },
        label: { color: COLORS.onPrimary },
      };
  }
}
