import axios from 'axios';
import {showAlert} from './alerts'; 

export const review = async(rating, review) => {
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: '/api/v1/reviews/',
            data:{
                rating,
                review
            }
        });

        console.log(rating, review)

        if(res.data.status === 'success'){
            showAlert('success','Review submit');
            window.setTimeout(()=>{
                location.assign('/');
            },1000)
        }

    }catch(err){
        showAlert('error',err.response.data.message);
    }
}