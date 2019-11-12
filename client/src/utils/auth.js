import Axios from "axios";
import qs from "querystring";

const axios = Axios.create({
    withCredentials: true, 
    baseURL: process.env.REACT_APP_API
});

export const login = function({email, password}, navigate, ) {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: "auth/login",
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({username: email, password}),
            })
            .then((res)=> {
                setUser(res.data)
                resolve();
            })
            .catch((err) => {
                reject({message: err.message});
            })
        })
    }

export const signup = function({email, password, name, displayName, phone, avatar}, navigate) {
        return axios({
            method: "POST",
            url: "auth/signup",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({email, password, name, displayName, phone, avatar}),
        })
        .then((res)=> {
            setUser(res.data);
            navigate.push("/home");
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
    if(user && user._id){
        localStorage.setItem('user', JSON.stringify(user));
    }
    }

export const getUser = function(){
        return JSON.parse(localStorage.getItem('user'));
    }

export const getDogOwner = function(dogId){
    axios({
        method: "GET",
        url: `dogs/dog/${dogId}`
    })
    .then((dog) => {
        return dog.data.owner
    })
    .catch((err) => {
        console.log(err.message);
    })
}

export const logout = function(navigate){
        debugger;
       return axios({
            method: "POST",
            url: "auth/logout"
        })
        .then((res)=> {
            localStorage.removeItem('user');
            navigate.push("/");
        })
        .catch((err) => {
            console.log(err.message);
        })
    }   