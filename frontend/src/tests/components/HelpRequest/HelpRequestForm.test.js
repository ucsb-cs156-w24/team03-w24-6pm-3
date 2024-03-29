import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockedNavigate
}));

describe("HelpRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Requester Email", "Team Id", "Table Or Breakout Room", "Request Time (iso format)", "Explanation", "Solved"];
    const testId = "HelpRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );


        expect(await screen.findByText(/Create/)).toBeInTheDocument();


        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

       expect(screen.getByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-teamId`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-tableOrBreakoutRoom`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-requestTime`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
       expect(screen.getByTestId(`${testId}-solved`)).toBeInTheDocument();
    });


    test("renders correctly when passing in initialContents", async () => {
        render(
             <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest[0]}/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });


        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-requesterEmail`).value).toBe("cgaucho@ucsb.edu");

    });


    test("Correct Error messsages on missing input", async () => {

        render(
            <Router>
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/TeamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/TableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/RequestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    });
    

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");

        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 's22-5pm-3' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(explanationField, { target: { value: 'Need help with Swagger-ui' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/TeamId must be in the correct format, e.g. s22-5pm-3/)).not.toBeInTheDocument();
        expect(screen.queryByText(/RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu/)).not.toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");

        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(teamIdField, { target: { value: 's22-5pm-' } });
        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu/);
        expect(screen.getByText(/TeamId must be in the correct format, e.g. s22-5pm-3/)).toBeInTheDocument();
    });
});