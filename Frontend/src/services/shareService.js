import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


const shareResource = async (resourceId, resourceType, sharedWithUserId, accessType) => {
    // Ensure capitalized (File or Folder)
    const normalizedType = resourceType.charAt(0).toUpperCase() + resourceType.slice(1).toLowerCase();
    
    const response = await axios.post(
        `${API_URL}shared/share`,
        { resourceId, resourceType: normalizedType, sharedWithUserId, accessType },
        { withCredentials: true }
    );
    return response.data?.data;
};

// Update access permissions
const updateAccess = async (sharedId, sharedWithUserId, newAccessType) => {
    const response = await axios.patch(
        `${API_URL}shared/${sharedId}/update`,
        { sharedWithUserId, newAccessType },
        { withCredentials: true }
    );
    return response.data?.data;
};

// Remove access
const removeAccess = async (sharedId, sharedWithUserId) => {
    const response = await axios.delete(
        `${API_URL}shared/${sharedId}/remove`,
        { 
            data: { sharedWithUserId },
            withCredentials: true 
        }
    );
    return response.data;
};

// Get users who have access to a resource
const getUsersWithAccess = async (resourceId) => {
    try {
        const response = await axios.get(
            `${API_URL}shared/${resourceId}/users`,
            { withCredentials: true }
        );
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching users with access:", error);
        return [];
    }
};

// Get resources shared with current user
const getSharedWithMe = async () => {
    try {
        const response = await axios.get(
            `${API_URL}shared/user-resources`,
            { withCredentials: true }
        );
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching shared resources:", error);
        return [];
    }
};

export {
    shareResource,
    updateAccess,
    removeAccess,
    getUsersWithAccess,
    getSharedWithMe
};