import React, { useState } from 'react'
import './calendar.css'
import { momentLocalizer, Calendar } from 'react-big-calendar'
import moment from 'moment'
import withDnD from 'react-big-calendar/lib/addons/dragAndDrop'
// import Select from 'react-select'
// import Modal from 'react-modal'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getByDisplayValue } from '@testing-library/react'

const localizer = momentLocalizer(moment)

const DnDCalendar = withDnD(Calendar)

const BigCalendar = props => {
  const [eventData, setEventData] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [newTeacher, setNewTeacher] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [file, setFile] = useState('');
  const [fileData, setFileData] = useState([]);

  const moveEvent = ({event, start, end, allDay}) => {
    const idx = eventData.indexOf(event)
    const updatedEvents = { ...event, start, end, allDay}
    const nextEvents = [ ...eventData ]
    nextEvents.splice(idx, 1, updatedEvents)
    setEventData(nextEvents)
  }

  const resizeEvent = ({event, start, end}) => {
    const nextEvents = eventData.map(existingEvent => {
      return eventData.indexOf(existingEvent) === eventData.indexOf(event)
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    setEventData(nextEvents)
  }

  const newEvent = () => {
    setEventData([
      ...eventData,
      {
        title: newTitle,
        start: newStart,
        end: newEnd,
        room: newRoom,
        teacher: newTeacher
      }
    ])
    setNewTeacher('')
    setNewTitle('')
    setNewRoom('')
  }

  const clearEvents = () => {
    setEventData([])
  }

  const handleChange = (e) => {
    const file = e.target.files[0]; // accesing file
    // console.log(file);
    setFile(file); // storing file
  }

  const csvFileHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('csvfile', file);
    // formData.append('content', fileData.content);
    // formData.append('csvfile', fileData.csvfile);
    let url = 'http://localhost:8080/calendar/postcsv';
    let method = 'POST';

    fetch(url, {
      method: method,
      body: formData
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Uploading file failed!')
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData)
      const formedEventData = resData.map(event => {
        return {
          title: event["Course Title"],
          start: new Date(),
          end: new Date(),
          room: event["Building and Room"],
          teacher: event.Instructor
        }
      })
      setFileData(formedEventData)
    })
    .catch(err => console.log(err))
  }
  console.log(fileData)
  return (
    <div className="cal-body">
      <div className="sidebar">
        <input
          type="file"
          name="csvfile"
          id="csvfile"
          onChange={handleChange}
          style={{
            width: '200px',
            height: '30px',
            marginTop: '50px'
          }}
        />

        <button
          type="submit"
          onClick={csvFileHandler}
          style={{
            border: 'none',
            background: '#2767e9',
            color: 'white',
            width: '100px',
            height: '30px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >Get Data</button>
        <button
          onClick={clearEvents}
          style={{
            border: 'none',
            background: 'crimson',
            color: 'white',
            width: '100px',
            height: '30px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >Clear Events</button>
      </div>

      <DnDCalendar
        selectable
        defaultDate={new Date('2020, 2, 11, 06:00')}
        defaultView='week'
        events={fileData}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizable
        style={{ height: '100vh', width: '100%'}}
        localizer={localizer}
        min={new Date(2020, 2, 10, 6, 0)}
        max={new Date(2020, 2, 20, 23, 0)}
        onSelectSlot={newEvent}
        step={15}
      />
    </div>
  )
}

export default BigCalendar