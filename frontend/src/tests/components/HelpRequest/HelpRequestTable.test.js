import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Requester Email", "Team Id", "Table Or Breakout Room", "Request Time ISO Format", "Explanation", "Solved"];
  const expectedFields = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
  const testId = "HelpRequestTable";
  
  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });
    
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("cgaucho@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-teamId`)).toHaveTextContent("s22-5pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`)).toHaveTextContent("7");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requestTime`)).toHaveTextContent("2022-04-20T17:35");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with Swagger-ui");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`)).toHaveTextContent("ldelplaya@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-teamId`)).toHaveTextContent("s22-6pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-tableOrBreakoutRoom`)).toHaveTextContent("11");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requestTime`)).toHaveTextContent("2022-04-20T18:31");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Dokku problems");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("cgaucho@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-teamId`)).toHaveTextContent("s22-5pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`)).toHaveTextContent("7");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requestTime`)).toHaveTextContent("2022-04-20T17:35");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with Swagger-ui");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`)).toHaveTextContent("ldelplaya@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-teamId`)).toHaveTextContent("s22-6pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-tableOrBreakoutRoom`)).toHaveTextContent("11");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requestTime`)).toHaveTextContent("2022-04-20T18:31");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Dokku problems");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");
    
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("cgaucho@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-teamId`)).toHaveTextContent("s22-5pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`)).toHaveTextContent("7");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requestTime`)).toHaveTextContent("2022-04-20T17:35");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with Swagger-ui");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helprequest/edit/2'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("cgaucho@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-teamId`)).toHaveTextContent("s22-5pm-3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`)).toHaveTextContent("7");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requestTime`)).toHaveTextContent("2022-04-20T17:35");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with Swagger-ui");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");


    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });
});

