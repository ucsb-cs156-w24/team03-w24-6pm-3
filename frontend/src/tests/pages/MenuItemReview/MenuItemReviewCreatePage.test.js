import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const menuItemReview = {
            itemId: 17,
            reviewerEmail: "test@test.com",
            stars: 5,
            comments: "great!",
            dateReviewed: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply( 202, menuItemReview );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentsField = screen.getByTestId("MenuItemReview-comments");
        const dateReviewedField = screen.getByTestId("MenuItemReview-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReview-submit");

        fireEvent.change(itemIdField, { target: { value: '17' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test@test.com' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(commentsField, { target: { value: 'great!' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-02-02T00:00' } });
        

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "itemId": 17,
            "reviewerEmail": "test@test.com",
            "stars": 5,
            "comments": "great!",
            "dateReviewed": "2022-02-02T00:00"
        });

        expect(mockToast).toBeCalledWith("New menuItemReivew Created - itemId: 17 reviewerEmail: test@test.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });


});




