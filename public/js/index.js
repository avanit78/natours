import '@babel/polyfill';
import {displayMap} from './mapbox';    
import {login,logout} from './login';
import {review} from './review';
import {signUp} from './signUp';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';

//Dom element
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const reviewForm = document.querySelector('.form--review');
const signUpForm = document.querySelector('.form--signUp');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePassForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

//delegation
if(mapbox){
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password)
});

if(reviewForm)
reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    // const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    review(rating, review);
});

if(signUpForm)
signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp(name,email,password,passwordConfirm)

    // const form = new FormData();
    // form.append('name', document.getElementById('name').value)
    // form.append('email', document.getElementById('email').value)
    // form.append('password', document.getElementById('password').value)
    // form.append('passwordConfirm', document.getElementById('passwordConfirm').value)
    // form.append('photo', document.getElementById('photo').files[0])

    // signUp(form)
});

if(logoutBtn) logoutBtn.addEventListener('click', logout);

if(updateDataForm)
updateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])

    updateSettings(form, 'data')
});

if(updatePassForm)
updatePassForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...'

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent, password, passwordConfirm}, 'password')

    document.querySelector('.btn--save-password').textContent = 'Save password'
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirm').value='';
});

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;
        bookTour(tourId);
    })
}