
import axios from 'axios';

const testAuth = async () => {
    try {
        console.log('Testing Registration...');
        const regRes = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test Artist',
            username: 'testartist' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('Registration Success:', regRes.data);
    } catch (error) {
        console.error('Registration Failed:', error.response?.data || error.message);
    }
};

testAuth();
