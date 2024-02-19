import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: menuItemReview, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/menuitemreviews?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/menuitemreviews`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (menuItemReview) => ({
    url: "/api/menuitemreviews",
    method: "PUT",
    params: {
      id: menuItemReview.id,
    },
    data: {
      itemId: menuItemReview.itemId,
      reviewerEmail: menuItemReview.reviewerEmail,
      stars: menuItemReview.stars,
      dateReviewed: menuItemReview.dateReviewed,
      comments: menuItemReview.comments
    }
  });

  const onSuccess = (menuItemReview) => {
    toast(`menuItemReview Updated - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId} reviewerEmail: ${menuItemReview.reviewerEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreviews?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItemReview</h1>
        {
          menuItemReview && <MenuItemReviewForm initialContents={menuItemReview} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
