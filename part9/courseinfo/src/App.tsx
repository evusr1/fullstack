interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}


interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];


interface HeaderProps {
  name: string;
}

const Header = (props: HeaderProps) => (
    <h1>{props.name}</h1>
)

interface PartProps {
  coursePart: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

const Part = (props: PartProps) => {
  const part = props.coursePart;

  const header = (part: CoursePart) => (
    <>
      <h3>{part.name} {part.exerciseCount}</h3>
    </>
  )

  switch(part.kind) {
    case 'basic':
      return (
        <>
          {header(part)}
          {part.description}
        </>
      )
    case 'group':
      return (
        <>
          {header(part)}
          Group project count: {part.groupProjectCount}
        </>
      )
    case 'background':
      return (
        <>
          {header(part)}
          {part.description}<br/>
          Background material: {part.backgroundMaterial}
        </>
      )
      case 'special':
        return (
          <>
            {header(part)}
            {part.description}<br/>
            Requirements: 
            <ul>
              {part.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
            </ul>
          </>
        )
    default:
      return assertNever(part);
  }
}

interface CourseProps {
  courseParts: CoursePart[];
}

const Content = (props: CourseProps) => (
  <>
    {props.courseParts.map((part) => <Part key={part.name} coursePart={part} /> )}
  </>
)

const Total = (props: CourseProps) => (
  <>
    Number of exercises{" "}
    {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </>
)

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header name={courseName}/>
      <Content courseParts={courseParts}/>
      <Total courseParts={courseParts}/>
    </div>
  );
};

export default App;