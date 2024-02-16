import AdminUsersPage from "main/pages/AdminUsersPage";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";
import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";

import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";

import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";

import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/menuitemreview" element={<MenuItemReviewIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/menuitemreview/edit/:id" element={<MenuItemReviewEditPage />} />
              <Route exact path="/menuitemreview/create" element={<MenuItemReviewCreatePage />} />
            </>
          )
        }
        {
        hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route exact path="/helprequest" element={<HelpRequestIndexPage />} />
          </>
          ) 
        }
        {
        hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route exact path="/helprequest/edit/:id" element={<HelpRequestEditPage />} />
            <Route exact path="/helprequest/create" element={<HelpRequestCreatePage />} />
          </>

          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsborganization" element={<UCSBOrganizationsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsborganization/edit/:id" element={<UCSBOrganizationsEditPage />} />
              <Route exact path="/ucsborganization/create" element={<UCSBOrganizationsCreatePage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
