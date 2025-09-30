// utils/index.js
import { jwtDecode } from 'jwt-decode';

const decodeToken = (token) => {
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const exp = new Date(decodedToken.exp * 1000);

            if (new Date() > exp) {
                localStorage.removeItem('BureauToken');
                return null; // Token expired
            } else {
                return decodedToken; // Valid token
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            return null; // Invalid token format
        }
    } else {
        return null; // No token provided
    }
};

export default decodeToken;
