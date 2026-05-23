import {
    DotNetCore, 
    HTML5, 
    JavaScript, 
    Telerik, 
    TypeScript, 
    DynamoDB, 
    React, 
    Vue, 
    GoogleTagManager, 
    JQuery, 
    LaTeX, 
    Mathematica, 
    PSPP, 
    MatLab, 
    Geogabra, 
    GoLang, 
    Thymeleaf,
    Docker,
    GoogleCloudPlatform,
    NodeJS,
} from '@/components/utility/SVGs'

export const skills = {
    JavaScript: {
        subtitle: "JavaScript",
        image: JavaScript(),
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
    },
    HTML5: {
        subtitle: "HTML 5",
        image: HTML5(),
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML"
    },
    JQuery: {
        subtitle: "jQuery",
        image: JQuery(),
        href: "https://jquery.com/"
    },
    VueJS: {
        subtitle: "VueJS",
        image: Vue(),
        href: "https://vuejs.org/"
    },
    GoogleTagManager: {
        subtitle: "GTM",
        tooltip: "Google Tag Manager",
        image: GoogleTagManager(),
        href: "https://support.google.com/tagmanager/"
    },
    DynamoDB: {
        subtitle: "DynamoDB",
        image: DynamoDB(),
        href: "https://aws.amazon.com/dynamodb/"
    },
    ReactJs: {
        subtitle: "ReactJS",
        image: React(),
        href: "https://reactjs.org/"
    },
    TypeScript: {
        subtitle: "TypeScript",
        image: TypeScript(),
        href: "https://www.typescriptlang.org/"
    },
    Telerik: {
        subtitle: "KendoUI",
        image: Telerik(),
        href: "https://www.telerik.com/kendo-ui"
    },
    DotNetCore: {
        subtitle: ".NET Core",
        image: DotNetCore(),
        href: "https://docs.microsoft.com/en-us/dotnet/core/"
    },
    LaTeX: {
        subtitle: "LaTeX",
        image: LaTeX(),
        href: "https://www.latex-project.org/"
    },
    Mathematica: {
        subtitle: "Mathematica",
        image: Mathematica(),
        href: "https://www.wolfram.com/mathematica/"
    },
    PSPP: {
        subtitle: "PSPP",
        image: PSPP(),
        href: "https://www.gnu.org/software/pspp/"
    },
    MatLab: {
        subtitle: "MatLab",
        image: MatLab(),
        href: "https://www.mathworks.com/products/matlab.html"
    },
    Geogabra: {
        subtitle: "Geogabra",
        image: Geogabra(),
        href: "https://www.geogebra.org/"
    },
    GoLang: {
        subtitle: "GoLang",
        image: GoLang(),
        href: "https://golang.org/"
    },
    Thymeleaf: {
        subtitle: "Thymeleaf",
        image: Thymeleaf(),
        href: "https://www.thymeleaf.org/"
    },
    Docker: {
        subtitle: "Docker",
        image: Docker(),
        href: "https://www.docker.com/"
    },
    GoogleCloudPlatform: {
        subtitle: "GCP",
        image: GoogleCloudPlatform(),
        href: "https://cloud.google.com/"
    },
    NodeJS: {
        subtitle: "NodeJS",
        image: NodeJS(),
        href: "https://nodejs.org/"
    },
};

export const experiences = [
    {
        employer: "O'Reilly Auto Parts",
        location: "Springfield, MO · Remote",
        roles: [
            {
                title: "Software Engineer II",
                type: "Full-time",
                startDate: new Date(2025, 8, 1),
                description: (<ul>
                    <li>Designs, develops, tests, and maintains high-quality software solutions across the full SDLC.</li>
                    <li>Enhances existing systems, builds new applications, and supports cloud-based solutions with a focus on performance, scalability, and security.</li>
                    <li>Participates in code reviews, improves development processes, and mentors junior engineers as needed.</li>
                </ul>),
                skills: [
                    skills.GoogleCloudPlatform,
                    skills.ReactJs,
                    skills.NodeJS,
                    skills.TypeScript,
                    skills.Docker,
                ]
            },
            {
                title: "Scrum Master",
                type: "Part-time",
                startDate: new Date(2025, 5, 1),
                endDate: new Date(2025, 2, 1),
                description: (<ul>
                    <li>Facilitates Agile and Scrum practices to help teams deliver high-quality solutions efficiently.</li>
                    <li>Coaches teams on Scrum principles, removes impediments, and fosters continuous improvement.</li>
                    <li>Partners with product owners and stakeholders to support planning, ceremonies, collaboration, transparency, and timely delivery.</li>
                </ul>),
                skills: []
            },
            {
                title: "Technical Lead",
                type: "Full-time",
                startDate: new Date(2024, 2, 1),
                description: (<ul>
                    <li>Works as a front-end technical lead and liaison for the Online Store Team.</li>
                    <li>Plans, leads, and engineers technical solutions across front-end initiatives.</li>
                </ul>),
                skills: [
                    skills.VueJS,
                    skills.TypeScript,
                    skills.NodeJS,
                    skills.Thymeleaf,
                ]
            },
            {
                title: "Software Engineer I",
                type: "Full-time",
                startDate: new Date(2025, 5, 1),
                endDate: new Date(2025, 8, 1),
                description: (<ul>
                    <li>Contributed to the design, development, testing, and deployment of software solutions.</li>
                    <li>Wrote clean, well-documented code, supported application enhancements, assisted with testing and monitoring, and collaborated with cross-functional teams.</li>
                </ul>),
                skills: [
                    skills.ReactJs,
                    skills.GoogleCloudPlatform,
                    skills.NodeJS,
                    skills.TypeScript,
                ]
            },
            {
                title: "UI/UX Developer II",
                type: "Full-time",
                startDate: new Date(2022, 1, 1),
                endDate: new Date(2025, 5, 1),
                description: (<ul>
                    <li>Documented, developed, and tested computer software by applying knowledge of programming techniques and computer systems.</li>
                    <li>Wrote clean, semantic HTML and CSS in conjunction with client-side JavaScript frameworks.</li>
                </ul>),
                skills: [
                    skills.HTML5,
                    skills.VueJS,
                    skills.TypeScript,
                    skills.JQuery,
                    skills.GoogleTagManager,
                    skills.Thymeleaf,
                    skills.Docker,
                ]
            },
        ]
    },
    {
        employer: "Netsmart",
        location: "Springfield, MO",
        roles: [
            {
                title: "Software Engineer",
                type: "Full-time",
                startDate: new Date(2020, 6, 1),
                endDate: new Date(2022, 1, 1), 
                description: (<ul>
                        <li>Participates in the software development life cycle including requirement analysis, planning, software design, development, review, unit/integration testing, and deployment.</li>
                        <li>Identify, implement and support technical solutions to deliver business requirements</li>
                    </ul>),
                skills: [
                    skills.DynamoDB,
                    skills.ReactJs,
                    skills.TypeScript,
                    skills.Telerik,
                    skills.DotNetCore,
                    skills.NodeJS,
                    skills.GoLang,
                    skills.HTML5, 
                    skills.JQuery,
                ]
            },
        ]
    },
    {
        employer: "College of the Ozarks",
        location: "Point Lookout, MO",
        roles: [
            {
                title: "Lab Assistant",
                type: "Part-time",
                startDate: new Date(2017, 8, 1),
                endDate: new Date(2020, 5, 1), 
                description: (<p>
                    Worked as a lab assistant in the College's mathematics and physics department. Assisted in instructing students in the areas of Calculus, Calculus-based Physics, Abstract Algebra, Statistics, both Numerical and Real analysis, and more.
                </p>),
                skills: [
                    skills.LaTeX,
                    skills.Mathematica,
                    skills.PSPP,
                    skills.MatLab,
                    skills.Geogabra,
                ]
            },
        ]
    }
]
