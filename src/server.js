const app = require("./app")
const sequelize = require("./config/database")
require("dotenv").config()

const PORT = process.env.PORT || 3000


async function startServer() {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.');
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer()