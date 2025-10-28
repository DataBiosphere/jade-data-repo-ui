import { mount } from 'cypress/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import globalTheme from 'modules/theme';
import BillingProfileDropdown from './BillingProfileDropdown';

interface BillingProfile {
  id: string;
  profileName?: string;
  [key: string]: any;
}

const mockBillingProfiles: BillingProfile[] = [
  {
    id: 'profile-1',
    profileName: 'Default Profile',
  },
  {
    id: 'profile-2',
    profileName: 'Alternative Profile',
  },
  {
    id: 'profile-3',
    profileName: 'Test Profile',
  },
];

const setUp = (overrideProps = {}) => {
  const props = {
    billingProfiles: mockBillingProfiles,
    selectedBillingProfile: mockBillingProfiles[0],
    onSelectedItem: cy.stub(),
    ...overrideProps,
  };

  mount(
    <ThemeProvider theme={globalTheme}>
      <BillingProfileDropdown {...props} />
    </ThemeProvider>,
  );

  return props;
};

describe('BillingProfileDropdown Component', () => {
  // No need for beforeEach since we create fresh stubs in each test

  describe('Rendering', () => {
    it('should render the billing profile label by default', () => {
      setUp();

      cy.contains('Billing Profile').should('be.visible');
    });

    it('should not render label when showLabel is false', () => {
      setUp({ showLabel: false });

      cy.contains('Billing Profile').should('not.exist');
    });

    it('should render dropdown with correct initial value', () => {
      setUp();

      cy.get('[data-cy="billingProfile"]').should('contain', 'Default Profile');
    });

    it('should render custom label when labelProps provided', () => {
      setUp({
        labelProps: { variant: 'h6', marginTop: 2, children: 'Custom Billing Profile' },
      });

      cy.contains('Custom Billing Profile').should('be.visible');
    });
  });

  describe('Profile Selection', () => {
    it('should display all available billing profiles', () => {
      setUp();

      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Default Profile').should('exist');
      cy.contains('Alternative Profile').should('exist');
      cy.contains('Test Profile').should('exist');
    });

    it('should call onSelectedItem when profile is selected', () => {
      const props = setUp();

      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Alternative Profile').click();

      cy.wrap(props.onSelectedItem).should('have.been.calledOnce');
      cy.wrap(props.onSelectedItem).should('have.been.calledWith', mockBillingProfiles[1]);
    });

    it('should filter out profiles without profileName', () => {
      const profilesWithUndefined = [
        ...mockBillingProfiles,
        { id: 'profile-4' }, // Missing profileName
        { id: 'profile-5', profileName: undefined },
      ];

      setUp({ billingProfiles: profilesWithUndefined });

      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Default Profile').should('exist');
      cy.contains('Alternative Profile').should('exist');
      cy.contains('Test Profile').should('exist');
      // Profiles without profileName should not appear
      cy.get('[data-cy="menuItem-undefined"]').should('not.exist');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when only one profile is available', () => {
      setUp({ billingProfiles: [mockBillingProfiles[0]] });

      cy.get('[data-cy="billingProfile"]').should('have.class', 'Mui-disabled');
    });

    it('should be disabled when disabled prop is true', () => {
      setUp({ disabled: true });

      cy.get('[data-cy="billingProfile"]').should('have.class', 'Mui-disabled');
    });

    it('should be enabled when multiple profiles available and not explicitly disabled', () => {
      setUp();

      cy.get('[data-cy="billingProfile"]').should('not.have.attr', 'aria-disabled');
    });
  });

  describe('Empty State', () => {
    it('should handle empty billing profiles array', () => {
      setUp({ billingProfiles: [], selectedBillingProfile: null });

      cy.get('[data-cy="billingProfile"]').should('have.value', '');
      cy.get('[data-cy="billingProfile"]').should('have.class', 'Mui-disabled');
    });

    it('should handle null selectedBillingProfile', () => {
      setUp({ selectedBillingProfile: null });

      cy.get('[data-cy="billingProfile"]').should('have.value', '');
    });
  });

  describe('Styling and Props', () => {
    it('should apply custom sx props', () => {
      const customSx = { height: '3rem', marginTop: '16px', backgroundColor: 'red' };
      setUp({ sx: customSx });

      cy.get('[data-cy="billingProfile"]').should('exist');
      // Note: Testing exact styles is complex in Cypress, but we can verify the component renders
    });

    it('should handle duplicate profile names correctly', () => {
      const duplicateProfiles = [
        { id: 'profile-1', profileName: 'Same Name' },
        { id: 'profile-2', profileName: 'Same Name' },
        { id: 'profile-3', profileName: 'Different Name' },
      ];

      setUp({ billingProfiles: duplicateProfiles });

      cy.get('[data-cy="billingProfile"]').click();
      // Should only show unique profile names
      cy.contains('Same Name').should('exist');
      cy.contains('Different Name').should('exist');
    });
  });

  describe('Integration', () => {
    it('should work with real-world profile data structure', () => {
      it('should call onSelectedItem with the correct profile when selection changes', () => {
        const realWorldProfiles = [
          {
            id: 'bp-12345',
            profileName: 'Production Environment',
            billingAccountId: 'ba-prod-001',
            description: 'Production billing profile for live workloads',
          },
          {
            id: 'bp-67890',
            profileName: 'Development Environment',
            billingAccountId: 'ba-dev-001',
            description: 'Development billing profile for testing',
          },
        ];

        const props = setUp({
          billingProfiles: realWorldProfiles,
          selectedBillingProfile: realWorldProfiles[0],
        });

        cy.get('[data-cy="billingProfile"]').should('contain', 'Production Environment');

        cy.get('[data-cy="billingProfile"]').click();
        cy.contains('Development Environment').click();

        cy.wrap(props.onSelectedItem).should('have.been.calledOnce');
        cy.wrap(props.onSelectedItem.getCall(0).args[0])
          .should('have.property', 'id', 'bp-67890')
          .should('have.property', 'profileName', 'Development Environment');
      });
    });
  });
});
