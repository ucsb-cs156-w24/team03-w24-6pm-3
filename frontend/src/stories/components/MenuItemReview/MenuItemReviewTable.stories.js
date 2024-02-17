import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { menuItemReviewFixtures } from 'fixtures/menuItemReviewFixtures';
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { rest } from "msw";

export default {
    title: 'components/MenuItemReviews/MenuItemReviewTable',
    component: MenuItemReviewTable
};

const Template = (args) => {
    return (
        <MenuItemReviewTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    reviews: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    reviews: menuItemReviewFixtures.threeReviews,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    reviews: menuItemReviewFixtures.threeReviews,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/menuitemreview', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};