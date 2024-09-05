PORT = 2000 || process.env.PORT;

const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const detectAndConvertKNumbers = require('./convert.js')
const data = require('./data.json');
const database = require('./database.js');

const app = express();

app.get('/', (req, res) => {
    res.json("Fetch GitHub Projects")
})

async function getGithub(website) {
    try {
        const response = await axios.get(website);
        const html = response.data;
        const $ = cheerio.load(html);

        let fullText = '';
        let href = website;
        let title = '';
        const contents = [];

        $("p", html).each(function () {
            const text = $(this).text().trim();
            fullText = text;
        });

        $("strong", html).each(function () {
            const localTitle = $(this).text().trim();
            contents.push(localTitle);
            if (!title) title = localTitle;
        });

        // Get the last three elements
        const transformedContents = detectAndConvertKNumbers(contents);

        const numericContents = transformedContents.filter(item => {
            if (typeof item === 'string') {
                return !isNaN(item) && item.trim() !== '';
            }
            return !isNaN(item);
        });

        const [stars, watching, forks] = numericContents.slice(-3);

        const projects = [{
            title,
            href,
            fullText,
            stars,
            forks,
            watching
        }];

        return projects;
    } catch (err) {
        console.error(err);
        throw new Error('Error occurred while fetching data');
    }
}


const User = new database;
User.remove({}, many = true) // for reruns, so data won't accumulate for no reason

async function processProjects() {
    for (let i = 0; i < data.length; i++) {
        try {
            let projects = await getGithub(data[i].website);  // Use await here

            if (projects) {
                User.add(projects[0].title, projects[0].href, projects[0].stars, projects[0].forks, projects[0].watching);
            }

        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    }
}

processProjects();

// Express route handler
app.get('/github', async (req, res) => {
    try {
        const datas = await User.getAll();
        res.json(datas);

    } catch (err) {
        res.status(500).send('Error occurred');
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Working on ${PORT}`)
})
