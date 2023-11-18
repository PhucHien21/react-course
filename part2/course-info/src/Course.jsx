import React from 'react'

function Course({courses}) {
  return (
    <div>
      <Header course={'Web development curriculum'} />
      <Content courses={courses} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = ({courses}) => {
  return (
  <div>
    {courses.map((course) => {
      return (
        <div key={course.id}>
          <h2>{course.name}</h2>
          {course.parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises}/>)}
          <Total parts={course.parts}/>
        </div>
      )
    })}
  </div>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const Total = ({parts}) => {
  return (
    <h3>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</h3>
  )
}

export default Course