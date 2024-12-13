import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: "Please login to access this resource" 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Please login to access this resource" 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userId = decoded.id;
            next();
        } catch (err) {
            return res.status(401).json({ 
                success: false,
                message: "Session expired. Please login again" 
            });
        }
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(500).json({ 
            success: false,
            message: "Authentication error" 
        });
    }
};