import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import UCSBDiningCommonsMenuItemFormStories from "stories/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm.stories";

export default function UCSBDiningCommansMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem/post",
    method: "POST",
    params: {
      diningCommonsCode: ucsbDiningCommonsMenuItem.diningCommonsCode,
      name: ucsbDiningCommonsMenuItem.name,
      station: ucsbDiningCommonsMenuItem.station
    }
  });

  const onSuccess = (ucsbDate) => {
    toast(`New UCSBDiningCommansMenuItem Created - id: ${ucsbDiningCommonsMenuItem.id} name: ${ucsbDiningCommonsMenuItem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbdiningcommonsmenuitem/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdates" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommansMenuItem</h1>

        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}