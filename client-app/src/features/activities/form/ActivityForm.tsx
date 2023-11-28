import React, { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    closeForm: () => void;
    selectedActivity: Activity | undefined;
    createOrEditActivity: (activity: Activity) => void
}

export default function ActivityForm({ closeForm, selectedActivity, createOrEditActivity }: Props) {

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState<Activity>(initialState);

    const handleSubmit = () => {
        console.log(activity);
        createOrEditActivity(activity);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActivity({
            ...activity,
            [event.target.name]: event.target.value
        });
    }

    return (
        <Segment clearing>
            <Form onSubmit={() => { handleSubmit() }} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button floated='right' positive type='submit' content='Submit'/>
                <Button floated='right' type='button' content='Cancel' onClick={() => { closeForm() }}/>
            </Form>
        </Segment>
    )
}