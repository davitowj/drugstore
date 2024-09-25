import Express from "express"
import medicineRoute from "./router/medicineRouter"
import adminRoute from "./router/adminRoute"

const app = Express()

// allow to read a body request with Json Format
app.use(Express.json())

// Prefix for medicine route
app.use(`/medicine`, medicineRoute)
app.use(`/admin`, adminRoute)

const PORT = 1992
app.listen(PORT, () => {
    console.log(`Server Drugstore run on port ${PORT}`);
    

})