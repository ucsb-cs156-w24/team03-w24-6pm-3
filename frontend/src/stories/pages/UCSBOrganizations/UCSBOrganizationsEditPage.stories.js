import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { rest } from "msw";

import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

export default {
    title: 'pages/UCSBOrganizations/UCSBOrganizationsEditPage',
    component: UCSBOrganizationsEditPage
};

const Template = () => <UCSBOrganizationsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsborganization', (_req, res, ctx) => {
            return res(ctx.json(ucsbOrganizationsFixtures.threeOrganizations[0]));
        }),
        rest.put('/api/ucsborganization', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}