import {Octokit} from "octokit";
import fs from "fs/promises"
import { get } from "https";

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

I'm currently pursuing an MSc in Computer Science at Queen Mary University of London, with a predicted 1st (GPA: 4.0). My studies have provided a strong foundation in key areas such as Object-Oriented Programming, Databases, Web Development, and Algorithms and Data Structures.

Prior to my Master's, I attempted an MEng in Chemical Engineering at the University of Oxford. This background has equipped me with strong analytical and problem-solving skills, which I now apply to Programming.

I have practical experience as a Web Developer and Software Developer at London Science College, where I contributed to improving productivity and customer satisfaction. I also have experience as a Computer Science Tutor at FunTech, where I helped students develop their programming skills.

## My Projects

Throughout my studies and professional experiences, I've had the opportunity to work on a variety of projects, constantly honing my technical skills and improving my organizational abilities. Here are some of my projects:

* **Horse Race Simulator**: Forged a betting game using Java Swing, engaging 100+ players with a simulated horse racing experience and implemented an in-game currency system, enhancing player retention and interaction.
* **Personal Portfolio Website**: Designed and established my personal portfolio website, showcasing my projects and skills, which has attracted over 50 visitors. It integrates a MongoDB database for improved project scalability and data management, and utilizes technologies like HTML, CSS, JavaScript, React.js, Django (Python), and MongoDB.
* **LSC Invoice Builder (commissioned)**: Built an invoice generation application using JavaFX, streamlining billing for over 500 recurring customers. This application integrated a customer database, reducing manual data entry by 80%.
* **LSC Homework Portal (commissioned)**: Developed a website using JavaScript to enhance homework management for over 100 students and teachers. This included implementing a homework calendar for efficient assignment tracking.
* **FDM Expense App**: Engineered a full-stack expense management system using React.js, Django, and MySQL, which replaced an Excel-based tracking system. This project improved expense claim processing efficiency by 70% through automated validation and structured approval workflows.
* **1v1 Scramble Game Backend**: Developed a real-time multiplayer game backend using Rust and Web-Sockets, hosted on AWS. Which achieved a 40% reduction in response time compared to a Python implementation, ensuring ultra-low latency gameplay

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
  .map(([language, value]) => `* <img src="https://skillicons.dev/icons?i=${language.toLowerCase()}"/>: ${Math.round(value*1000/totalCount)/10}%`)
  .join('\n');

await fs.writeFile(
    '../README.md',
    getFormattedString(languageStats)
);


