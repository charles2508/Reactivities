import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image } from "semantic-ui-react";
import useStore from "../../app/stores/store";
import { useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo } from "../../app/models/photo";

export default observer(function ProfilePhotos() {
    const { profileStore: {
        profile,
        isCurrentUser,
        uploadPhoto,
        uploading,
        setMain,
        loading,
        deletePhoto,
        deleting
        }
    } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');
    const [deleteTarget, setDeleteTarget] = useState('');

    const uploadingPhoto = (file: Blob) => {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    const handleSetMain = async (photo: Photo) => {
        setTarget(photo.id);
        await setMain(photo);
        setTarget('');
    }

    const handleDelete = async (photo: Photo) => {
        setDeleteTarget(photo.id);
        await deletePhoto(photo.id);
        setTarget('');
    }

    return(
        <>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="image" content='Photos'/>
                    {
                        isCurrentUser && (
                            <Button floated="right" basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} onClick={() => setAddPhotoMode(!addPhotoMode)}/>
                        )
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {
                        ( isCurrentUser && addPhotoMode ) ? (
                            <PhotoUploadWidget uploadingPhoto={uploadingPhoto} uploading={uploading}/>
                        ) : (
                            <Card.Group itemsPerRow={5}>
                                {
                                    profile?.photos?.map(photo => (
                                        <Card key={photo.id}>
                                            <Image src={photo.url}/>
                                            {
                                                isCurrentUser && (
                                                    <Button.Group fluid widths={2}>
                                                        <Button
                                                            content='Main'
                                                            basic
                                                            color="green"
                                                            disabled={photo.isMain || (loading && target === photo.id)}
                                                            loading={loading && target === photo.id}
                                                            onClick={() => handleSetMain(photo)}
                                                        />
                                                        <Button
                                                            basic
                                                            icon='trash'
                                                            color="red"
                                                            loading={deleting && deleteTarget === photo.id}
                                                            disabled={photo.isMain || (deleting && deleteTarget === photo.id)}
                                                            onClick={() => handleDelete(photo)}
                                                        />
                                                    </Button.Group>
                                                )
                                            }
                                        </Card>
                                    ))
                                }
                            </Card.Group>
                        )
                    }
                </Grid.Column>
            </Grid>
        </>
    )
})