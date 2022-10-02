import React, {useState} from "react";
import { Input, Button } from "@material-ui/core";
import './ImageUpload.css';

const BASE_URL = 'http://localhost:8000/'

const ImageUpload = (props) => {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const handleChange = (event) => {
        if (event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        
        
        if (image){
            let formData = new FormData();
            formData.append('file_obj', image)


            let formOptions = {
                method: 'POST',
                headers: new Headers({
                    'Authorization': props.tokenType + ' ' + props.authToken
                }),
                body: formData

            }

            fetch(BASE_URL + 'post/upload', formOptions)
            .then(response => {
                if (response.ok){
                    return response.json();
                }
                throw response
            })
            .then(data => {
                createPost(data.filename);
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
            .finally(() => {
                setCaption('');
                setImage(null);
                document.getElementById('fileInput').value = null;
            })


        }else{
            alert('Pass image perperly')
        }
    }

    const createPost = (filename) => {
        const jsonString = JSON.stringify({
            'image_url': filename,
            'image_url_type': 'relative',
            'caption': caption
          })

        let formOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': props.tokenType + ' ' + props.authToken,
                'Content-Type': 'application/json'
            }),
            body: jsonString
        }

        fetch(BASE_URL + 'post/new', formOptions)
        .then(response => {
            if (response.ok){
                return response.json();
            }

            throw response
        })
        .then(data => {
            window.location.reload()
            window.scrollTo(0, 0);

        })
        .catch(error => {
            console.log(error);
            alert(error);
        })
    }

    return (
        <React.Fragment>

            <div  className="imageupload">
                <Input 
                    type="text" 
                    placeholder="Caption" 
                    onChange={(event => {setCaption(event.target.value)})}
                    value={caption}
                />

                <Input 
                    onChange={handleChange}
                    type="file"
                    id="fileInput"
                />

                <Button onClick={handleUpload}>
                    Upload
                </Button>
            </div>
        </React.Fragment>
        
    )

}

export default ImageUpload;