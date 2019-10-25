import Axios from "axios";
import qs from "querystring";
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const axios = Axios.create({
    withCredentials: true, 
    baseURL: process.env.REACT_APP_API
});

export const login = function(username, password) {
        return axios({
            method: "POST",
            url: "/auth/login",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({username, password}),
        })
        .then((res)=> {
            setUser(res.data)
            history.push("/");
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

export const signup = function({email, password, firstname, lastname, phone, image}) {
        return axios({
            method: "POST",
            url: "/auth/signup",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({email, password, firstname, lastname, phone, image}),
        })
        .then((res)=> {
            setUser(res.data);
            history.push("/");
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

export const loggedIn = function(){
        const user = getUser()
        return !!user; 
    }

export const setUser = function(user){
        localStorage.setItem('user', JSON.stringify(user));
    }

export const getUser = function(){
        return JSON.parse(localStorage.getItem('user'));
    }

export const logout = function(){
       return axios({
            url: "/auth/logout"
        })
        .then((res)=> {
            localStorage.removeItem('user');
            history.push("/");
        })
        .catch((err) => {
            console.log(err.message);
        })
    }   