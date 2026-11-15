/**
 * GullyScore Reusable AppBottomSheet Component
 */

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from './AppText';

export interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.sheet, contentStyle]}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {title && (
              <AppText variant="h3" weight="bold" style={styles.title}>
                {title}
              </AppText>
            )}

            <View style={styles.content}>{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    paddingTop: spacing.sm,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: colors.borderLight,
    borderRadius: radius.full,
  },
  title: {
    marginBottom: spacing.base,
    marginTop: spacing.xs,
  },
  content: {
    width: '100%',
  },
});
