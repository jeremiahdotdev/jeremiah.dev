import {
    MathAndPhysicsClub,
    SigmaZeta,
    EducationalTestingService,
    AssociationForComputingMachinery
} from '@/components/utility/SVGs'
import AcademicFocusIcon from '@/components/academics/academic-focus-icon'
import academicFocusDescriptions from './academic-focus-descriptions.json'

const academicFocusIcon = (src: string, alt: string) => (
    <AcademicFocusIcon src={src} alt={alt} />
)

const decorations = {
    MathAndPhysicsClubPresident: {title: "President", dates:"2019-2020", subtitle: "Math & Physics Club", label: "Math & Physics Club President", focusKey: "mathematics", link: process.env.COLLEGE_OF_THE_OZARKS_URL, image:MathAndPhysicsClub()},
    SigmaZetaPresident: {title: "President", dates:"2020", subtitle: "ΣΖ Honor Society", label: "Sigma Zeta President", focusKey: "mathematics", tooltip: "Sigma Zeta Honor Society Beta-Phi Chapter", link: process.env.SIGMA_ZETA_URL, image:SigmaZeta()},
    MajorFieldExam: {title: "189/200", dates:"2020", subtitle: "Major Field Exam", label: "Major Field Exam 189/200", focusKey: "mathematics", tooltip: "Major Field Exam for Mathematics", link: process.env.EDUCATIONAL_TESTING_SERVICE_URL, image:EducationalTestingService()},
    AssociationForComputingMachinery: {title: "Vice-President", dates:"2018-2019", subtitle: "ACM Club", label: "ACM Vice-president", focusKey: "computer-science", tooltip: "Association for Computing Machinery", link: process.env.ASSOCIATION_FOR_COMPUTING_MACHINERY_URL, image:AssociationForComputingMachinery()},
}

export const academics = {
    degree: "Bachelor's Degree",
    emblem: {
        lightSrc: "/academics/cofo_light.png",
        darkSrc: "/academics/cofo_dark.png",
        alt: "College of the Ozarks emblem",
    },
    focuses: [{
        key: "computer-science",
        icon: academicFocusIcon("/academic-focus-icons/computerScience.svg", "Computer Science icon"),
        type: "Major",
        name: "Computer Science",
        gpa: "3.90",
        description: academicFocusDescriptions['computer-science']
    },{
        key: "mathematics",
        icon: academicFocusIcon("/academic-focus-icons/mathematics.svg", "Mathematics icon"),
        type: "Major",
        name: "Mathematics",
        gpa: "3.91",
        description: academicFocusDescriptions.mathematics
    },{
        key: "christian-apologetics",
        icon: academicFocusIcon("/academic-focus-icons/christianApologetics.svg", "Biblical Studies icon"),
        type: "Minor",
        name: "Biblical Studies",
        gpa: "3.71",
        description: academicFocusDescriptions['christian-apologetics']
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
