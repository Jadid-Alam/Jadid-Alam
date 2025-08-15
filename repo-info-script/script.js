import {Octokit} from "octokit";
import fs from "fs/promises"

// Octokit.js
// https://github.com/octokit/core.js#readme
const accessToken = process.env.ACCESS_TOKEN;

const octokit = new Octokit({
  auth: accessToken
})

async function  getPublicRepo() {
    let response = null;
    try {
        response = await octokit.request('GET /user/repos', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
    } catch (error) {
        console.log("Error: ",error);
        return null;
    }
    
   return response.data.map(repo => repo.name);
}


async function getLanguages(repoName) {
    let response = null;
    try {
        response = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: 'Jadid-Alam',
            repo: repoName,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
    } catch (error) {
        console.log("Error: ",error);
        return null;
    }
    

    return response.data;
}

function getFormattedString(languageStats) {
    const today = new Date();

    return (`

<img align="right" src="https://visitor-badge.laobi.icu/badge?page_id=jwenjian.visitor-badge&left_color=blue&right_color=purple" />

# Jadid Alam

Welcome to my GitHub page! I'm currentlty a Computer Science student at Queen Mary University of London, constantly striving to bridge the gap between academic knowledge and practical application in the world of computer science.

## Some Language Statistics from my repositories:

${languageStats}

## My Socials:
* **Portfolio**: [jadid-alam.com](https://www.jadid-alam.com/)
* **Linked In**: [www.linkedin.com/in/jadid-alam/](https://www.linkedin.com/in/jadid-alam/)
* **Email**: Jadid.alam.08@gmail.com

## About Me

I\'m currently studying for an MSc in Computer Science at Queen Mary University of London, with a predicted First Class (GPA: 4.0). My academic journey has provided me with a solid foundation in Object-Oriented Programming, Databases, Web Development, and Algorithms and Data Structures.

Before my Master\'s program, I spent one year studying MEng Chemical Engineering at the University of Oxford. During that time, I discovered my true passion for Computer Science, especially after I realized I enjoyed the computing labs much more than my core engineering classes. This experience improved my analytical and problem-solving skills and guided me toward programming and software development.

I have hands-on experience as a Web Developer and Software Developer at London Science College, where I worked on projects that boosted productivity and customer satisfaction. Additionally, as a Computer Science Tutor at FunTech, I helped students develop strong programming skills in a collaborative and engaging setting.

## My Projects

Throughout my studies and professional experiences, I've had the opportunity to work on a variety of projects, constantly honing my technical skills and improving my organizational abilities. Here are some of my projects:

* **VPS Server Hosting**: Hosted my portfolio and game backend myself on a VPS, ditching Vercel for complete control. Set up a secure Linux server with NGINX, UFW, and SSH hardening, tuned for 50+ concurrent users with 99.9% uptime since launch.
* **TradingAIForge**: Building a group project that enables users to create customized trading bots using various trading styles. It's all about simplicity and customization ease, with a goal of 80%+ user positive feedback.
* **1v1 Scrabble Game Backend**: Wrote a real-time multiplayer game backend in Rust and Web-Sockets, self-hosted on a rented Virtual Private Server. Resulted in 40% less response time than a Python implementation, providing ultra-low latency gameplay.
* **FDM Expense App**: Developed a full expense management application with React.js, Django, and MySQL to replace an Excel-based tracking system. Made processing of expenses claims 70% more efficient through the use of automated checks and structured approval processes.
* **LSC Homework Portal (commissioned)**: Created a JavaScript website to assist more than 100 teachers and students with their homework. Included a homework calendar to keep assignments organized.
* **LSC Invoice Builder (commissioned)**: Created an invoice creation program with JavaFX, simplifying billing for more than 500 repeat customers. Implemented a customer database, cutting data entry by hand by 80%.
* **Horse Race Simulator**: Developed a betting game in Java Swing, entertaining 100+ players with a virtual horse racing game. Incorporated an in-game currency system, facilitating player retention and engagement.
* **Personal Portfolio Website**: Developed and created my personal portfolio website, highlighting my projects and expertise, which has been visited by more than 50 viewers. Previously, I incorporated a MongoDB database for better project scalability and data handling. Used technologies such as HTML, CSS, JavaScript, React.js, Django (Python), and MongoDB.

<br/>

Last Auto Update: ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}
`);
}



const repos = await getPublicRepo();

const allLanguageData = await Promise.all(
    repos.map(repoName => getLanguages(repoName))
);

const mergedLanguages = {};

let totalCount = 0;

for (const langData of allLanguageData) {
    for (const [lang, count] of Object.entries(langData)) {
        totalCount = totalCount + count;
        mergedLanguages[lang] = (mergedLanguages[lang] || 0) + count;
    }
}

const filteredLanguages = Object.fromEntries(
  Object.entries(mergedLanguages).filter(([_, count]) => Math.round(count*1000/totalCount)/10 > 0)
);

const languageStats = Object.entries(filteredLanguages)
  .map(([language, value]) => `* **${language}**: ${Math.round(value*1000/totalCount)/10}%`)
  .join('\n');

await fs.writeFile(
    '../README.md',
    getFormattedString(languageStats)
);


