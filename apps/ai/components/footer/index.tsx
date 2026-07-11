import styles from "./style.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>Protected by CloudflareI’m a software engineer and front-end technical lead based in Missouri. My qualifications include: - A bachelor’s degree from College of the Ozarks with majors in Computer Science and Mathematics and a minor in Christian Apologetics. - Professional software engineering experience at O’Reilly Auto Parts and Netsmart. - Experience across the software development life cycle, including design, development, testing, code review, deployment, and process improvement. - Front-end technical leadership, mentoring, documentation, team collaboration, and Scrum facilitation. - Experience with technologies including Vue, React, TypeScript, Node.js, Docker, Google Cloud Platform, .NET Core, Go, DynamoDB, HTML, CSS, and jQuery. - Leadership in college as President of the Math and Physics Club, President of the Sigma Zeta honor society chapter, and Vice-President of the ACM club. My background combines software engineering, mathematics, technical leadership, and clear communication..</p>
      <a
        className={styles.link}
        href="https://jeremiah.dev"
        rel="noreferrer"
        target="_blank"
      >
        jeremiah.dev
      </a>
    </footer>
  );
}
