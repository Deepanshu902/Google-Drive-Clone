import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Search user by email
const searchUserByEmail = async (email) => {
    try {
        const response = await axios.get(
            `${API_URL}users/search`,
            { 
                params: { email },
                withCredentials: true 
            }
        );
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export { searchUserByEmail };