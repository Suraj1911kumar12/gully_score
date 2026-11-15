import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { AppText } from '../../src/components/ui/AppText';
import { AppButton } from '../../src/components/ui/AppButton';
import { AppBadge } from '../../src/components/ui/AppBadge';
import { AppEmptyState } from '../../src/components/ui/AppEmptyState';

describe('UI Design System Components', () => {
  describe('AppText', () => {
    it('renders text with default variant and color', () => {
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(<AppText>GullyScore</AppText>);
      });
      expect(component?.toJSON()).toBeTruthy();
      const instance = component?.root;
      expect(instance?.findByType(AppText).props.children).toBe('GullyScore');
    });

    it('renders scoreboard numbers', () => {
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(<AppText variant="scoreboard">48/2</AppText>);
      });
      const instance = component?.root;
      expect(instance?.findByType(AppText).props.variant).toBe('scoreboard');
    });
  });

  describe('AppButton', () => {
    it('renders button title and responds to press', () => {
      const onPressMock = jest.fn();
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(<AppButton title="Start Match" onPress={onPressMock} />);
      });
      expect(component?.toJSON()).toBeTruthy();
      const instance = component?.root;
      expect(instance?.findByProps({ accessibilityLabel: 'Start Match' })).toBeTruthy();
    });

    it('sets disabled accessibility state', () => {
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(<AppButton title="Disabled Action" disabled />);
      });
      const instance = component?.root;
      const button = instance?.findByProps({ accessibilityLabel: 'Disabled Action' });
      expect(button?.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('AppBadge', () => {
    it('renders badge with correct variant', () => {
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(<AppBadge label="live" variant="live" />);
      });
      expect(component?.toJSON()).toBeTruthy();
      const instance = component?.root;
      expect(instance?.findByType(AppBadge).props.label).toBe('live');
    });
  });

  describe('AppEmptyState', () => {
    it('renders title, description and CTA', () => {
      const onAction = jest.fn();
      let component: renderer.ReactTestRenderer | undefined;
      act(() => {
        component = renderer.create(
          <AppEmptyState
            title="No Matches"
            description="Create your first match"
            actionTitle="Create Now"
            onAction={onAction}
          />
        );
      });
      expect(component?.toJSON()).toBeTruthy();
      const instance = component?.root;
      expect(instance?.findByType(AppEmptyState).props.title).toBe('No Matches');
    });
  });
});
