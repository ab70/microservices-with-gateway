import { Hono } from 'hono';
import mongoose from 'mongoose';

// Initialize the Hono app
const app = new Hono();

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/gateway-demo';  // Same DB as Auth Service
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Send a message
app.post('/api/messages/send', async (c) => {
    const { from, to, message } = await c.req.json();
    const newMessage = new Message({ from, to, message });
    await newMessage.save();

    return c.json({ message: 'Message sent successfully' });
});
app.get('/api/messages/sample', async (c) => {
    return c.json({ message: 'Hello, World!' })
}
)
// Retrieve messages between two users
app.get('/api/messages/:from/:to', async (c) => {
    const { from, to } = c.req.param();
    const messages = await Message.find({
        $or: [{ from, to }, { from: to, to: from }]
    });

    return c.json(messages);
});

export default {
    fetch: app.fetch,
    port: 5001
}