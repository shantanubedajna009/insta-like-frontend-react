import './Post.css';
import { Avatar, Button } from "@material-ui/core";
import { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:8000/'

const Post = (props) => {

    let imageUrl = '';

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] =useState('');


    useEffect(() => {

        fetch(BASE_URL + 'comments/' + props.post.id + '/all')
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw response;
        })
        .then(data => {
            setComments(data);
        })
        .catch(error => {
            console.log(error);
            //alert(error);
        })

    }, [])

    const postComment = (event) => {
        event?.preventDefault();

        const json_string = JSON.stringify({
                "content": newComment,
                "post_id": props.post.id
        })

        let formOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': props.tokenType + ' ' + props.authToken,
                'Content-Type': 'application/json'
            }),
            body: json_string

        }

        fetch(BASE_URL + 'comments/new', formOptions)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw response;
        })
        .then(data => {
            //console.log(data)
            let newArray = [...comments, data];
            console.log(newArray);
            setComments(newArray);
            
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            //document.getElementById('commentInput').value = null;
            setNewComment('');
        })


    }


    if ( props.post.image_url_type === 'absolute' )
    {
        imageUrl = props.post.image_url;
    }else{
        imageUrl = BASE_URL +  props.post.image_url;
    }

    return( 
        <div className="post">
            <div className="post_header">
                <Avatar alt="{props.post.user.username}" src="" />
                <div className="post_headerInfo">
                    <h3>{props.post.user.username}</h3>
                    <Button className="post_delete" onClick={() => props.delPostHandler(props.post.id)}>Delete</Button>
                </div>
            </div>
            <img src={imageUrl} className="post_image" />
            <h4 className="post_text">{props.post.caption}</h4>
            <div className="post_comments">
                {
                    comments.map(comment => {
                        return (
                            <p key={comment.id}>
                                <strong>{comment.username} : </strong>
                                {comment.content}
                            </p>
                        )
                    })
                }
            </div>

            {props.authToken && (
                <form className="post_commentbox">
                    <input className="post_input"
                        id="commentInput"
                        type="text"
                        value={newComment}
                        placeholder="Add a comment"
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <button
                        className="post_button"
                        type="submit"
                        onClick={postComment}>
                        Post
                        </button>
                </form>
            )}

        </div>
    )
}


export default Post;