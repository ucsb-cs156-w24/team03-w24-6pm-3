import UCSBDateForm from "main/components/MenuItemReview/MenuItemReviewForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation } from "main/utils/useBackend";
import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

  const objectToAxiosParams = (menuItemReview) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
      itemId: menuItemReview.itemId,
      reviewerEmail: menuItemReview.reviewerEmail,
      stars: menuItemReview.stars,
      comments: menuItemReview.comments,
      dateReviewed: menuItemReview.dateReviewed
    }
  });

  const onSuccess = (menuItemReview) => {
    toast(`New menuItemReview Created - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId} reviewerEmail: ${menuItemReview.reviewerEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/menuitemreviews/all"]
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
        <h1>Create New menuItemReview</h1>

        <UCSBDateForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
