const mongoose = require('mongoose');

class MongoDB {
    constructor() {
        mongoose.connect('mongodb://host.docker.internal:27017/github')
            .then(() => {
                console.log("Connection Successful");
            })
            .catch((err) => {
                console.log("Error in the Connection", err);
            });

        const userSchema = new mongoose.Schema({
            title: {type: String, required: true},
            text: String,
            stars: Number,
            forks: String,
            watching: String
        });

        this.User = mongoose.model("Github-projects", userSchema);
    }

    async add(title, text, stars, forks, watching) {
        const user = new this.User({
            title: title,
            text: text,
            stars: stars,
            forks: forks,
            watching: watching
        });

        await user.save();
    }

    async remove(query, many = false) {
        if (many) {
            const result = await this.User.deleteMany(query);
            console.log(result);
        } else {
            const result = await this.User.deleteOne(query);
            console.log(result);
        }
    }

    async all() {
        console.log(await this.User.find())
    }

    async getAll() {
        return await this.User.find();
    }
}

module.exports = MongoDB;