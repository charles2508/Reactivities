import { observer } from 'mobx-react-lite'
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import useStore from '../../../app/stores/store'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

export default observer(function ActivityDetailedChat() {
    const {commentStore, activityStore} = useStore();

    useEffect(() => {
        if (activityStore.selectedActivity) {
            commentStore.createHubConnection(activityStore.selectedActivity.id);
        }

        // Clean up when a component is disposed
        return () => {
            if (commentStore.hubConnection) {
                commentStore.clearComments();
            }
        }
    }, [commentStore, activityStore.selectedActivity])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    initialValues={{body: ''}}
                    onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                    validationSchema={Yup.object(
                        {
                            body: Yup.string().required()
                        }
                    )}
                >
                    {
                        ({isSubmitting, isValid, handleSubmit}) => (
                            <Form className="ui form">
                                <Field name='body'>
                                    {
                                        (props: FieldProps) => (
                                            <div style={{position:'relative'}}>
                                                <Loader active={isSubmitting}/>
                                                <textarea
                                                    placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                                    rows={2}
                                                    {...props.field}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && e.shiftKey) {
                                                            return;
                                                        } else if (e.key == 'Enter') {
                                                            e.preventDefault();
                                                            if (isValid) handleSubmit();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                </Field>
                            </Form>
                        )
                    }
                </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt).toString()} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>
    )
})