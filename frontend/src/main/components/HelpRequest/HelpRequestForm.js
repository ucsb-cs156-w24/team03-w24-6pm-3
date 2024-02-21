import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "HelpRequestForm";

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker disable next-line Regex
    const email_regex = /[\w.]+@([\w]+\.)+[\w-]{2,4}/i;
    // Stryker disable next-line Regex
    const teamId_regex = /[smfw]\d\d-([123456789]|10|11|12)(am|pm)-[1234]$/;


    return (
        <Form onSubmit={handleSubmit(submitAction)}>
 
 
            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}
 
 
                 <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-requesterEmail"}
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", { required: 'RequesterEmail is required.', pattern: email_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.requesterEmail?.message}
                        {errors.requesterEmail?.type === 'pattern' && 'RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu'}
                        </Form.Control.Feedback>
                    </Form.Group>
 
 
            <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">Team Id</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-teamId"}
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", { required: "TeamId is required.", pattern: teamId_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId?.message}
                            {errors.teamId?.type === 'pattern' && 'TeamId must be in the correct format, e.g. s22-5pm-3'}
                        </Form.Control.Feedback>
                    </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">Table Or Breakout Room</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-tableOrBreakoutRoom"}
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", {
                        required: "TableOrBreakoutRoom is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom?.message}
                </Form.Control.Feedback>
            </Form.Group>
 
 
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requestTime">Request Time (iso format)</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-requestTime"}
                    id="requestTime"
                    type="datetime-local"
                    isInvalid={Boolean(errors.requestTime)}
                    {...register("requestTime", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime && 'RequestTime is required. '}
                </Form.Control.Feedback>
            </Form.Group>
 
 
            <Form.Group className="mb-3" >
               <Form.Label htmlFor="explanation">Explanation</Form.Label>
               <Form.Control
                   data-testid={testIdPrefix + "-explanation"}
                   id="explanation"
                   type="text"
                   isInvalid={Boolean(errors.explanantion)}
                   {...register("explanation", {
                       required: "Explanation is required."
                   })}
               />
               <Form.Control.Feedback type="invalid">
                   {errors.explanation?.message}
               </Form.Control.Feedback>
           </Form.Group>
 
 
            <Form.Group className="mb-3" >
                <Form.Check
                    data-testid={testIdPrefix + "-solved"}
                    id="solved"
                    label = "Solved"
                    type="checkbox"
                    {...register("solved")}
                />
            </Form.Group>
 
 
            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
 
        </Form>
 
    )
 }
 
 
 export default HelpRequestForm;