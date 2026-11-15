jest.mock('lucide-react-native', () => {
  const mockReact = require('react');
  return new Proxy(
    {},
    {
      get: (_, name) => {
        return function MockIcon(props) {
          return mockReact.createElement('View', { testID: `icon-${String(name)}`, ...props });
        };
      },
    }
  );
});

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));
