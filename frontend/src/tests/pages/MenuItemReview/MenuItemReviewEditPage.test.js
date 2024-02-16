import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReviewForm-itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemId: 1,
                reviewerEmail: "test@test.edu",
                stars: 5,
                dateReviewed: "2001-05-06T13:00",
                comments: "great!"
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: 17,
                itemId: 1,
                reviewerEmail: "test@ucsb.edu",
                stars: 1,
                dateReviewed: "2006-04-01T12:00",
                comments: "its meh"
            });
        });
        
        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(1);
            expect(reviewerEmailField).toHaveValue("test@test.edu");
            expect(starsField).toHaveValue(5);
            expect(dateReviewedField).toHaveValue("2001-05-06T13:00");
            expect(commentsField).toHaveValue("great!");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(1);
            expect(reviewerEmailField).toHaveValue("test@test.edu");
            expect(starsField).toHaveValue(5);
            expect(dateReviewedField).toHaveValue("2001-05-06T13:00")
            expect(commentsField).toHaveValue("great!");
            
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(starsField, { target: { value: 1 } })
            fireEvent.change(commentsField, { target: { value: 'its meh' } })
            fireEvent.change(dateReviewedField, { target: { value: "2006-04-01T12:00" } })
            fireEvent.change(itemIdField, { target: { value: 1 } })
            fireEvent.change(reviewerEmailField, { target: { value: "test@test.edu" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("menuItemReview Updated - id: 17 itemId: 1 reviewerEmail: test@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: 1,
                reviewerEmail: "test@test.edu",
                stars: "1",
                dateReviewed: "2006-04-01T12:00",
                comments: "its meh"
            })); // posted object

        });

       
    });
});