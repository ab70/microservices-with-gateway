import { Hono } from 'hono';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initialize the Hono app
const app = new Hono();

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/gateway-demo';  // Replace with your MongoDB URI
// b
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware for JWT authentication
const authenticateToken = async (c, next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.text('Unauthorized', 401);
    
    try {
        const user = jwt.verify(token, 'secret');
        c.req.user = user;
        await next();
    } catch (err) {
        return c.text('Unauthorized', 401);
    }
};

// User registration
app.post('/api/auth/register', async (c) => {
    const { username, password } = await c.req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    return c.json({ message: 'User registered successfully' });
});

// User login
app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return c.text('Invalid credentials', 401);
    }
    
    const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
    return c.json({ token });
});

// Authenticated route (Example)
app.get('/api/auth/profile', authenticateToken, (c) => {
    return c.json({ user: c.req.user });
});
// sample
app.get('/api/auth/sample', async (c) => {
    return c.json({ message: 'Auth sample route' })
}
)
// Start the Auth service on port 8081
export default {
    fetch: app.fetch,
    port: 5002
}