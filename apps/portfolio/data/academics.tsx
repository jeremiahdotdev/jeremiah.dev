import {
    MathAndPhysicsClub,
    SigmaZeta,
    EducationalTestingService,
    AssociationForComputingMachinery
} from '@/components/utility/SVGs'

export const decorations = {
    MathAndPhysicsClubPresident: {title: "President", dates:"2019-2020", subtitle: "Math & Physics Club", link: process.env.COLLEGE_OF_THE_OZARKS_URL, image:MathAndPhysicsClub()},
    SigmaZetaPresident: {title: "President", dates:"2020", subtitle: "ΣΖ Honor Society", tooltip: "Sigma Zeta Honor Society Beta-Phi Chapter", link: process.env.SIGMA_ZETA_URL, image:SigmaZeta()},
    MajorFieldExam: {title: "189/200", dates:"2020", subtitle: "Major Field Exam", tooltip: "Major Field Exam for Mathematics", link: process.env.EDUCATIONAL_TESTING_SERVICE_URL, image:EducationalTestingService()},
    AssociationForComputingMachinery: {title: "Vice-President", dates:"2018-2019", subtitle: "ACM Club", tooltip: "Association for Computing Machinery", link: process.env.ASSOCIATION_FOR_COMPUTING_MACHINERY_URL, image:AssociationForComputingMachinery()},
}

export const academics = {
    degree: "Bachelor's Degree",
    focuses: [{
        type: "Major",
        name: "Computer Science",
        gpa: "3.90",
        description: (<div>
                <p>
                    My Computer Science major provided a strong foundation in theoretical concepts, including algorithms, data structures, and system design. These courses enhanced my understanding of software and hardware interactions and deepened my ability to grasp complex system architectures.
                </p>
                <p>
                    Through my studies, I developed a keen ability to learn and adapt to new technologies. This theoretical knowledge has been crucial in my five years of professional experience, where it continues to inform my approach to problem-solving and innovation in the tech industry.
                </p>
            </div>) 
    },{
        type: "Major",
        name: "Mathematics",
        gpa: "3.91",
        description: (<div>
            <p>
                In my General Mathematics major, I explored a range of mathematical topics, developing a solid understanding of both theoretical and applied mathematics. I served as a teacher’s aide and tutor, which reinforced my problem-solving skills and ability to communicate complex ideas.
            </p>
            <p>
                This major taught me to approach challenges with both abstract and practical thinking. I was honored with the Mathematics Achievement Award for my excellence in upper-division courses and creativity in problem-solving.
            </p>      
        </div>)
    },{
        type: "Minor",
        name: "Christian Apologetics",
        gpa: "3.71",
        description: (<div>
            <p>
                My minor in Christian Apologetics allowed me to engage deeply with philosophical and theological concepts, enhancing my understanding of faith and reason. I studied key arguments for the soundness of theology and scripture, examining historical, ethical, and scientific perspectives.
            </p>
            <p>
                This coursework not only strengthened my ability to articulate and defend my beliefs but also cultivated critical thinking and persuasive communication skills. My experience in this field has enriched my worldview and informed my interactions with ethical perspectives in both personal and professional contexts.
            </p>
        </div>)
    }],
    description: (<span>Received a liberal arts degree. Has proficiency in the arts, including expressing oneself orally and through composition.</span>),
    institution: "College of the Ozarks",
    location: "Point Lookout, Missouri",
    startDate: new Date(2015, 8),
    endDate: new Date(2020, 5),
    commendations: [
        decorations.MajorFieldExam,
        decorations.MathAndPhysicsClubPresident,
        decorations.SigmaZetaPresident,
        decorations.AssociationForComputingMachinery
    ],
}


