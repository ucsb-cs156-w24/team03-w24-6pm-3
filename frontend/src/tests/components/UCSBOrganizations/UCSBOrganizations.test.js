import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBOrganizationsForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByText(/orgCode/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBOrganization", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm initialContents={ucsbOrganizationsFixtures.oneOrganization} />
            </Router>
        );
        await screen.findByTestId(/UCSBOrganizationsForm-orgCode/);
        expect(screen.getByText(/orgCode/)).toBeInTheDocument();
        
        const orgCodeInput = screen.getByTestId(/UCSBOrganizationsForm-orgCode/);
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.change(orgCodeInput, { target: { value: "ZPR" } });
        fireEvent.click(submitButton);
        expect(screen.getByTestId(/UCSBOrganizationsForm-orgCode/)).toHaveValue("ZPR");
    });

    
    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-inactive");
        const inactive = screen.getByTestId("UCSBOrganizationsForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.change(inactive, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/The input should be just true or false/);
    });
    
    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required./);
        expect(screen.getByText(/orgTranslationShort is required./)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required./)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBOrganizationsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-orgCode");
        const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'ZPR' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'ZETA PHI RHO' } });
        fireEvent.change(orgTranslationField, { target: { value: 'ZETA PHI RHO' } });
        fireEvent.change(inactiveField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/orgCode is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/orgTranslationShort is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/orgTranslation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/inactive is required/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});