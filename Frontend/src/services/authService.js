import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const registerUser = async(userData)=>{
    const response = await axios.post(`${API_URL}users/register`,userData,{withCredentials:true}) // credentials true to ensure cookies are sent with req 
    return response.data
}

const loginUser = async(userData)=>{
    const response = await axios.post(`${API_URL}users/login`,userData,{withCredentials:true})
    return response.data
}

const getCurrentUser = async()=>{
    const response = await axios.get(`${API_URL}users/current-user`,{withCredentials:true});
    return response.data;
}

const logoutUser = async()=>{
    const response = await axios.post(`${API_URL}users/logout`,{},{withCredentials:true})
    return response.data
}

const getStorage = async()=>{
    const response = await axios.get(`${API_URL}users/storage`,{withCredentials:true})
    return response.data
}

const changePassword = async(passwordData)=>{
    const response = await axios.post(`${API_URL}users/change-password`,passwordData,{withCredentials:true})
    return response.data
}

const updateAccountDetails = async (accountData) => {
    const response = await axios.patch(`${API_URL}users/update-account-details`, accountData,{withCredentials:true});
    return response.data;
};

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getStorage,
    changePassword,
    updateAccountDetails
}