import './App.css';
import { useEffect, useState } from 'react';
import Post from './Post';
import { Button, Modal, makeStyles, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

const BASE_URL = 'http://localhost:8000/'


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const App = (props) => {

  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {

    setAuthToken(window.localStorage.getItem('authToken'));
    setTokenType(window.localStorage.getItem('tokenType'));
    setUserId(window.localStorage.getItem('userId'));
    setUsername(window.localStorage.getItem('username'));

  }, [])
  

  useEffect(() => {
    authToken ?
      window.localStorage.setItem('authToken', authToken) :
      window.localStorage.removeItem('authToken')
    tokenType ?
      window.localStorage.setItem('tokenType', tokenType) :
      window.localStorage.removeItem('tokenType')
    userId ? 
      window.localStorage.setItem('userId', userId) :
      window.localStorage.removeItem('userId')
    username ? 
      window.localStorage.setItem('username', username) :
      window.localStorage.removeItem('username')
    

  }, [authToken, tokenType, userId])


  useEffect(() => {

    console.log('UseEffect called');
    
    fetch(BASE_URL + 'post/all')
    .then( response => {
      if (response.ok){
        return response.json();

      }
      else{
        throw response;
      }
    })
    .then(response => {
      //console.log(response);
        const result = response.sort((a, b) => {
          const t_a = a.date_created.split(/[-T:]/);
          const t_b = b.date_created.split(/[-T:]/);
          const d_a = new Date(Date.UTC(t_a[0], t_a[1]-1, t_a[2], t_a[3], t_a[4], t_a[5]));
          const d_b = new Date(Date.UTC(t_b[0], t_b[1]-1, t_b[2], t_b[3], t_b[4], t_b[5]));
          return d_b - d_a
        })
      return result
    })
    .then(response => {
      //console.log(response);
      setPosts(response);
    })
    .catch(error => {
      console.log(error);
      alert(error)
    })

  }, [])

  const signIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    let requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'login', requestOptions)
    .then(response => {
      if (response.ok){
        return response.json();
      }

      throw response;
    })
    .then(response => {
        //console.log(response);
        setAuthToken(response.access_token);
        setTokenType(response.token_type);
        setUserId(response.user_id);
        setUsername(response.username);
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })

    setOpenSignIn(false);

  }

  const signUp = (event) => {
    event?.preventDefault();

    const jsonString = JSON.stringify({
      'username': username,
      'email': userEmail,
      'password': password
    })

    let formOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonString
    }

    fetch(BASE_URL + 'user/new', formOptions)
    .then(response => {
      if (response.ok){
        return response.json();
      }

      throw response
    })
    .then(response => {
      setOpenSignIn(true);
      setOpenSignUp(false);
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })

  }

  const logOut = (event) => {
    setAuthToken(null)
    setTokenType(null)
    setUserId('')
    setUsername('')
  }

  const delPostHandler = (id) => {

    let formOptions = {
      method: 'DELETE',
      headers: new Headers({
          'Authorization': tokenType + ' ' + authToken
      })
    }

    fetch(BASE_URL + 'post/delete/' + id, formOptions)
    .then(response => {
      if (response.ok){
        return response;
      }
      throw response;
    })
    .then(data => {

      window.location.reload();
      window.scrollTo(0,0);
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })

  }


  const postElements = posts.map(post => {
    return <Post key={post.id} post={post} 
                  delPostHandler={delPostHandler} 
                  authToken={authToken}
                  tokenType={tokenType} />  
  })
  
  return (
    <div className='app'>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_headerImage"
                src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                alt="Instagram"/>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button
              type="submit"
              onClick={signIn}>Login</Button>
          </form>
        </div>

      </Modal>


      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_headerImage"
                src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                alt="Instagram"/>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Input
              placeholder="email"
              type="text"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)} />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button
              type="submit"
              onClick={signUp}>Sign Up</Button>
          </form>
        </div>

      </Modal>

        <div className='app_header'>
          <img className='app_headerImage'
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            alt="Instagram" />
            
              {authToken ? (
                <div>
                  <Button onClick={logOut}>Log Out</Button>
                </div>
              ) : (
                    <div>
                      <Button onClick={ () => setOpenSignIn(true) }>Login</Button>
                      <Button onClick={ () => setOpenSignUp(true) }>Sign Up</Button>
                    </div>
                  )
              }
            
        </div>

        <div className='app_posts'>
          {
            postElements
          }
        </div>


        { authToken ? 
          
          <ImageUpload authToken={authToken} tokenType={tokenType} /> : 
          
          <h3>You need to login to upload</h3>}
    </div>
  );
}

export default App;
