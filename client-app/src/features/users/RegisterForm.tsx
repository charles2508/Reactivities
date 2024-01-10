import { ErrorMessage, Form, Formik } from "formik"
import MyTextInput from "../../app/common/form/MyTextInput"
import { Button, Header } from "semantic-ui-react"
import useStore from "../../app/stores/store"
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError";

export default function RegisterForm() {
    const { userStore } = useStore();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        displayname: Yup.string().required('Displayname is required'),
        email: Yup.string().required(),
        password: Yup.string().required()
    });

    return(
        <Formik
            initialValues={{email: '', password: '', error: null, username: '', displayname: ''}}
            onSubmit={(values, {setErrors}) => userStore.register(values).catch((error) => { setErrors({error: error})})}
            validationSchema={validationSchema}
        >
        {
            ({isSubmitting, errors, isValid, dirty}) => (
                <Form autoComplete="off" className="ui form error">
                    <Header as='h2' content='Sign up to Reactivities' color="teal" textAlign="center"/>
                    <MyTextInput placeholder="Display Name" name='displayname'/>
                    <MyTextInput placeholder="Username" name='username'/>
                    <MyTextInput placeholder="Email" name='email'/>
                    <MyTextInput placeholder="Password" name='password' type='password'/>
                    <ErrorMessage name="error" render={() => <ValidationError errors={errors.error as unknown as string[]}/>}/>
                    <Button
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        positive
                        content='Register'
                        type="submit"
                        fluid/>
                </Form>
            )
        }
        </Formik>
    )
}