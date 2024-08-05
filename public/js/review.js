import axios from 'axios';
import {showAlert} from './alerts'; 

export const addReview = async(rating, review,tourId) => {
    // console.log(rating, review);
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: `/api/v1/reviews/${tourId}`,
            data:{
                rating,
                review
            }
        });
        if(res.data.status === 'success'){
            showAlert('success','Review submit');
            window.setTimeout(()=>{
                location.assign('/my-reviews');
            },1000)
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}