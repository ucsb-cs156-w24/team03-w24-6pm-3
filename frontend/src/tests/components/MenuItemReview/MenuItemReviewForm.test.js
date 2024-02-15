import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Item ID/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-reviewerEmail");
        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: -1 } });
        fireEvent.change(starsField, { target: { value: -1 } });
        fireEvent.change(reviewerEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Reviewer email format invalid/);
        expect(screen.getByText(/Item ID must be positive/)).toBeInTheDocument();
        expect(screen.getByText(/Stars need to be in range 0 - 5/)).toBeInTheDocument();
    });

    test("Correct Error messsages on stars greater than five", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-stars");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(starsField, { target: { value: 6 } });
        fireEvent.click(submitButton);

        await screen.findByText(/Stars need to be in range 0 - 5/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Date Reviewed is required./);
        expect(screen.getByText(/Item ID is required/)).toBeInTheDocument();
        expect(screen.getByText(/Reviewer email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 2 } });
        fireEvent.change(dateReviewedField, { target: { value: '2021-02-03T12:00' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test@test.com' } });
        fireEvent.change(starsField, { target: { value: 5 } });
        fireEvent.change(commentsField, { target: { value: 'delicious' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Reviewer email format invalid/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars need to be in range 0 - 5/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});
