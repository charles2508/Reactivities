import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker, {ReactDatePickerProps} from 'react-datepicker';


export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta, helpers] = useField(props.name!);
    console.log(field);
    return(
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                onChange={(date) => helpers.setValue(date)}
                selected={(field.value && new Date(field.value)) || null}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red" content={meta.error}/>
            ): null}
        </Form.Field>
    )
}