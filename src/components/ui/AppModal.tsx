/**
 * GullyScore Reusable AppModal Component
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
import { AppIconButton } from './AppIconButton';
import { X } from 'lucide-react-native';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const AppModal: React.FC<AppModalProps> = ({
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.card, contentStyle]}>
            <View style={styles.header}>
              {title ? (
                <AppText variant="h3" weight="bold">
                  {title}
                </AppText>
              ) : (
                <View />
              )}
              <AppIconButton
                icon={<X size={20} color={colors.textSecondary} />}
                onPress={onClose}
                variant="ghost"
                size="sm"
                accessibilityLabel="Close dialog"
              />
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  content: {
    width: '100%',
  },
});
