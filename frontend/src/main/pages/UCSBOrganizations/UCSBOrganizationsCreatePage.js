import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsCreatePage({storybook=false}) {
  const objectToAxiosParams = (organization) => ({
    url: "/api/ucsborganization/post",
    method: "POST",
    params: {
     orgCode: organization.orgCode,
     orgTranslationShort: organization.orgTranslationShort,
     orgTranslation: organization.orgTranslation,
     inactive: organization.inactive
    }
  });

  const onSuccess = (organization) => {
    toast(`New organization Created - orgCode: ${organization.orgCode} orgTranslationShort: ${organization.orgTranslationShort}
    orgTranslation: ${organization.orgTranslation} inactive: ${organization.inactive}
    `);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsborganization/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />
  }
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>

        <UCSBOrganizationsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
