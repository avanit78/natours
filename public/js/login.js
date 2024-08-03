import axios from 'axios';
import {showAlert} from './alerts';   

export const login = async(email,password) => {
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: '/api/v1/users/login',
            data:{
                email: email,
                password
            }
        });

        if(res.data.status === 'success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1000)
        }

    }catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const logout = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
            // url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if((res.data.status = 'success')) {
            showAlert('success','Logout successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },500)  //location.reload(true) we can use
        };
    }catch(err){
        showAlert('error','Error logging out! Try again');
    }
} 


