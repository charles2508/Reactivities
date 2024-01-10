import { ErrorMessage, Form, Formik } from "formik"
import MyTextInput from "../../app/common/form/MyTextInput"
import { Button, Header, Label } from "semantic-ui-react"
import useStore from "../../app/stores/store"

export default function LoginForm() {
    const { userStore } = useStore();
    return(
        <Formik
            initialValues={{email: '', password: '', error: ''}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(() => setErrors({error: 'Invalid email or password'}))}
        >
        {
            ({isSubmitting, errors}) => (
                <Form autoComplete="off" className="ui form">
                    <Header as='h2' content='Login to Reactivities' color="teal" textAlign="center"/>
                    <MyTextInput placeholder="Email" name='email'/>
                    <MyTextInput placeholder="Password" name='password' type='password'/>
                    <ErrorMessage name="error" render={() => <Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>}/>
                    <Button loading={isSubmitting} positive content='Login' type="submit" fluid/>
                </Form>
            )
        }
        </Formik>
    )
}