import { screen } from '@testing-library/react';
import render from '../utils/testRenderer';
import CreateEditPostComponent from '../components/CreateEditPostComponent/CreatePostComponent';


jest.autoMockOn();

test('render post component', () => {
  render(<CreateEditPostComponent />);
});

test('get page title', () => {
    render(<CreateEditPostComponent />);
    const titleElement = screen.getByText("Create Story");
    expect(titleElement).toBeInTheDocument();
  });

  

test('check all fields exist', () => {
    render(<CreateEditPostComponent />);
    const topicField = screen.getAllByRole("textbox");
    const storyField = screen.getByLabelText(/Story/i)
    
    expect([topicField, storyField]).toBeInTheDocument();
});
  