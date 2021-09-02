import Mongoose from "mongoose";

const jobSchema = Mongoose.Schema({
    roleName: String,
    companyName: String,
    salary: String,
    description: String,
})

export default Mongoose.model("jobs", jobSchema)