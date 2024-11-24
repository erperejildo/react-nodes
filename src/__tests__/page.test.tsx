import Home from '@/app/page';
import { render, screen } from '@testing-library/react';

jest.mock('../app/components/AutomationBuilder', () => {
  const MockAutomationBuilder = () => {
    return <div data-testid="automation-builder">AutomationBuilder Mock</div>;
  };
  MockAutomationBuilder.displayName = 'MockAutomationBuilder';
  return MockAutomationBuilder;
});

jest.mock('../app/contexts/DnDContext', () => ({
  DnDProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-provider">{children}</div>
  ),
}));

describe('Home', () => {
  it('renders correctly with all components', () => {
    render(<Home />);

    const mainDiv = screen.getByRole('main', { hidden: true });
    expect(mainDiv).toHaveClass('main');

    const automationBuilder = screen.getByTestId('automation-builder');
    expect(automationBuilder).toBeInTheDocument();

    const dndProvider = screen.getByTestId('dnd-provider');
    expect(dndProvider).toBeInTheDocument();
  });
});
