import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone, { Preview } from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    uploadingPhoto: (file: Blob) => void;
    uploading: boolean
}

export default function PhotoUploadWidget({ uploadingPhoto, uploading }: Props) {
    const [files, setFiles] = useState<(File & Preview)[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadingPhoto(blob!));
        }
    }

    useEffect(() => {
        // clean up memory
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files])
    
    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 1 - Add Photo'/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 2 - Resize Image'/>
                {files.length > 0 && <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 3 - Preview & Upload'/>
                {
                    files.length > 0 && (
                        <>
                            <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}}/>
                            <Button loading={uploading} onClick={onCrop} positive icon='check'/>
                            <Button disabled={uploading} onClick={() => setFiles([])} positive icon='close'/>
                        </>
                    )
                }
            </Grid.Column>
            <Grid.Column width={1}/>
        </Grid>
    )
}