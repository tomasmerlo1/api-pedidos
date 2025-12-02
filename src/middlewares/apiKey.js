require("dotenv").config();

const apiKey = (req, res, next) => {
    const key = req.headers["x-api-key"];

    if (!key || key !== process.env.API_KEY) {
        return res.status(401).json({ error: "API_KEY inválida o ausente" });
    }

    next();
};

module.exports = apiKey;
