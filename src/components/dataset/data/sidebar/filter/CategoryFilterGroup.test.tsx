import { mount } from 'cypress/react';
import React from 'react';
import { ThemeProvider } from '@mui/styles';
import { CategoryFilterGroup } from './CategoryFilterGroup';
import globalTheme from '../../../../../modules/theme';

interface MockValue {
  value: string | null;
  count: number;
}
interface MockColumn {
  name: string;
  dataType: string;
}

interface MockFilterMap {
  value: Record<string, boolean>;
}

describe('CategoryFilterGroup Component Tests', () => {
  const mockColumn: MockColumn = {
    name: 'ancestry',
    dataType: 'string',
  };

  const mockOriginalValues: MockValue[] = [
    { value: 'EU', count: 150 },
    { value: 'AS', count: 100 },
    { value: 'AF', count: 75 },
    { value: null, count: 25 },
  ];

  const mockValues: MockValue[] = [
    { value: 'EU', count: 120 },
    { value: 'AS', count: 80 },
    { value: 'AF', count: 60 },
    { value: null, count: 20 },
  ];

  const mountCategoryFilterGroup = (props = {}) => {
    const defaultProps = {
      column: mockColumn,
      originalValues: mockOriginalValues,
      values: mockValues,
      table: 'test_table',
      filterMap: { value: {} },
      handleChange: cy.stub().as('handleChange'),
      ...props,
    };

    mount(
      <ThemeProvider theme={globalTheme}>
        <CategoryFilterGroup {...defaultProps} />
      </ThemeProvider>,
    );
  };

  describe('Filter Values Array Rendering', () => {
    it('renders all filter values as checkboxes', () => {
      mountCategoryFilterGroup();

      // Verify all filter value checkboxes are rendered
      cy.get('[data-cy=categoryFilterCheckbox-EU]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-AS]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-AF]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-null]').should('exist');
    });

    it('displays correct count information for each filter value', () => {
      mountCategoryFilterGroup();

      // Verify filtered vs total counts are displayed correctly
      cy.get('[data-cy=categoryFilterCheckbox-EU]')
        .parent()
        .should('contain', 'EU (120 filtered, 150 total)');

      cy.get('[data-cy=categoryFilterCheckbox-AS]')
        .parent()
        .should('contain', 'AS (80 filtered, 100 total)');

      cy.get('[data-cy=categoryFilterCheckbox-AF]')
        .parent()
        .should('contain', 'AF (60 filtered, 75 total)');
    });

    it('handles null values correctly in the filter display', () => {
      mountCategoryFilterGroup();

      // Verify null values are displayed with proper formatting
      cy.get('[data-cy=categoryFilterCheckbox-null]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-null]')
        .parent()
        .should('contain', '(empty) (20 filtered, 25 total)');
    });

    it('shows total count only when filtered equals total', () => {
      const equalValues: MockValue[] = [
        { value: 'EU', count: 150 },
        { value: 'AS', count: 100 },
      ];

      mountCategoryFilterGroup({
        values: equalValues,
      });

      // When filtered count equals total count, should show only total
      cy.get('[data-cy=categoryFilterCheckbox-EU]').parent().should('contain', 'EU (150)');

      cy.get('[data-cy=categoryFilterCheckbox-AS]').parent().should('contain', 'AS (100)');
    });
  });

  describe('Filter Selection Functionality', () => {
    it('calls handleChange when filter checkbox is selected', () => {
      mountCategoryFilterGroup();

      // Click on EU checkbox
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Verify handleChange was called with correct selected state object
      cy.get('@handleChange').should('have.been.calledWith', {
        EU: true,
      });
    });

    it('calls handleChange when filter checkbox is deselected', () => {
      // Start with EU already selected
      const filterMapWithSelection: MockFilterMap = {
        value: { EU: true },
      };

      mountCategoryFilterGroup({ filterMap: filterMapWithSelection });

      // EU should be checked initially
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');

      // Click to deselect
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Verify handleChange was called with EU removed from selected state
      cy.get('@handleChange').should('have.been.calledWith', {});
    });

    it('maintains selection state for multiple filters', () => {
      const multiSelectFilterMap: MockFilterMap = {
        value: { EU: true, AS: true },
      };

      mountCategoryFilterGroup({ filterMap: multiSelectFilterMap });

      // Verify multiple checkboxes can be selected
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');
      cy.get('[data-cy=categoryFilterCheckbox-AS] input').should('be.checked');
      cy.get('[data-cy=categoryFilterCheckbox-AF] input').should('not.be.checked');

      // Select AF as well
      cy.get('[data-cy=categoryFilterCheckbox-AF]').click();

      // Verify handleChange was called when AF is selected
      // Note: Component only tracks new changes in its internal state, existing filterMap selections aren't preserved
      cy.get('@handleChange').should('have.been.calledWith', {
        AF: true,
      });
    });

    it('updates component state when filterMap prop changes', () => {
      mountCategoryFilterGroup();

      // Initially no filters selected
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('not.be.checked');

      // Simulate external filter update by changing props
      const updatedFilterMap: MockFilterMap = { value: { EU: true } };

      // Remount with updated filterMap
      mount(
        <ThemeProvider theme={globalTheme}>
          <CategoryFilterGroup
            column={mockColumn}
            originalValues={mockOriginalValues}
            values={mockValues}
            table="test_table"
            filterMap={updatedFilterMap}
            handleChange={cy.stub()}
          />
        </ThemeProvider>,
      );

      // Verify checkbox reflects the new state
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty filter values gracefully', () => {
      mountCategoryFilterGroup({
        originalValues: [],
        values: [],
      });

      // Should not render any checkboxes but also not error
      cy.get('[data-cy^=categoryFilterCheckbox-]').should('not.exist');
    });

    it('handles mismatched original and filtered values', () => {
      const mismatchedValues: MockValue[] = [
        { value: 'EU', count: 50 }, // Missing AS from filtered results
      ];

      mountCategoryFilterGroup({
        values: mismatchedValues,
      });

      // Should still render all original values
      cy.get('[data-cy=categoryFilterCheckbox-EU]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-AS]').should('exist');

      // EU should show filtered count, AS should show 0 filtered
      cy.get('[data-cy=categoryFilterCheckbox-EU]')
        .parent()
        .should('contain', 'EU (50 filtered, 150 total)');

      cy.get('[data-cy=categoryFilterCheckbox-AS]')
        .parent()
        .should('contain', 'AS (0 filtered, 100 total)');
    });
  });

  describe('Null Value Filtering', () => {
    it('renders null values with proper checkbox and display name', () => {
      mountCategoryFilterGroup();

      // Verify null checkbox exists and displays as "(empty)"
      cy.get('[data-cy=categoryFilterCheckbox-null]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-null]')
        .parent()
        .should('contain', '(empty) (20 filtered, 25 total)');
    });

    it('allows selecting null values independently', () => {
      mountCategoryFilterGroup();

      // Click on null checkbox
      cy.get('[data-cy=categoryFilterCheckbox-null]').click();

      // Verify handleChange was called with null selection (null becomes "null" string as object key)
      cy.get('@handleChange').should('have.been.calledWith', {
        null: true,
      });
    });

    it('allows selecting both null and non-null values together', () => {
      mountCategoryFilterGroup();

      // Select EU first
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Then select null value
      cy.get('[data-cy=categoryFilterCheckbox-null]').click();

      // Verify the component called handleChange with the combined state (EU + null)
      cy.get('@handleChange').should('have.been.calledWith', { EU: true, null: true });
    });

    it('can deselect null values', () => {
      // Start with null already selected
      const filterMapWithNull: MockFilterMap = {
        value: { null: true },
      };

      mountCategoryFilterGroup({ filterMap: filterMapWithNull });

      // Null checkbox should be checked initially
      cy.get('[data-cy=categoryFilterCheckbox-null] input').should('be.checked');

      // Click to deselect null
      cy.get('[data-cy=categoryFilterCheckbox-null]').click();

      // Verify handleChange was called with empty object (null removed)
      cy.get('@handleChange').should('have.been.calledWith', {});
    });

    it('handles null values mixed with regular string values', () => {
      const mixedValues: MockValue[] = [
        { value: 'A', count: 100 },
        { value: 'B', count: 50 },
        { value: null, count: 25 },
        { value: 'C', count: 75 },
      ];

      mountCategoryFilterGroup({
        originalValues: mixedValues,
        values: mixedValues.map((v) => ({ ...v, count: v.count - 10 })),
      });

      // All values should be rendered including null
      cy.get('[data-cy=categoryFilterCheckbox-A]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-B]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-null]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-C]').should('exist');

      // Null should display as "(empty)"
      cy.get('[data-cy=categoryFilterCheckbox-null]')
        .parent()
        .should('contain', '(empty) (15 filtered, 25 total)');
    });

    it('maintains null selection state when other filters change', () => {
      const multiSelectFilterMap: MockFilterMap = {
        value: { EU: true, null: true },
      };

      mountCategoryFilterGroup({ filterMap: multiSelectFilterMap });

      // Both EU and null should be selected initially
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');
      cy.get('[data-cy=categoryFilterCheckbox-null] input').should('be.checked');

      // Add AF selection
      cy.get('[data-cy=categoryFilterCheckbox-AF]').click();

      // Verify AF was added (component only tracks new changes in internal state)
      cy.get('@handleChange').should('have.been.calledWith', {
        AF: true,
      });

      // UI should show that EU and null remain selected (from filterMap)
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');
      cy.get('[data-cy=categoryFilterCheckbox-null] input').should('be.checked');
    });
  });
});
