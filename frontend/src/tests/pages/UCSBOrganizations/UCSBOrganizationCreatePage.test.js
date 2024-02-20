import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            orgCode: "ZPR",
            orgTranslationShort: "ZETA PHI RHO",
            orgTranslation: "ZETA PHI RHO",
            inactive: "false"
        };

        axiosMock.onPost("/api/ucsborganization/post").reply(202, restaurant);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("orgTranslationShort")).toBeInTheDocument();
        });

        const orgTranslationShortInput = screen.getByLabelText("orgTranslationShort");
        expect(orgTranslationShortInput).toBeInTheDocument();

        const orgTranslationInput = screen.getByLabelText("orgTranslation");
        expect(orgTranslationInput).toBeInTheDocument();

        const inactiveInput = screen.getByLabelText("inactive");
        expect(inactiveInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();


        fireEvent.change(orgTranslationShortInput, { target: { value: 'ZETA PHI RHO' } })
        fireEvent.change(orgTranslationInput, { target: { value: 'ZETA PHI RHO' } })
        fireEvent.change(inactiveInput, { target: { value: false } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            orgTranslationShort: "ZETA PHI RHO",
            orgTranslation: "ZETA PHI RHO",
            inactive: "false"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New organization Created - orgCode: ZPR orgTranslationShort: ZETA PHI RHO\n    orgTranslation: ZETA PHI RHO inactive: false\n    ");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

    });
});