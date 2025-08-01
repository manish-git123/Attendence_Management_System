import React, { useState, useEffect } from 'react';
import './StudentList.css';
import Axios from 'axios';
import SearchComponent from './SearchComponent';

const URL = process.env.REACT_APP_SERVER_URL;

function StudentList({ studentList, attendanceData, handleAttendanceChange }) {
  const [searchResults, setSearchResults] = useState(studentList);
  const [defaultAttendanceData, setDefaultAttendanceData] = useState({});
  const [updateMessage, setUpdateMessage] = useState(''); // State to manage the update message

  useEffect(() => {
    // Set all students as absent by default
    const defaultData = {};
    studentList.forEach((student) => {
      defaultData[student._id] = 'absent';
    });
    setDefaultAttendanceData(defaultData);
  }, [studentList]);

  useEffect(() => {
    // Apply default attendance data when the component mounts
    setDefaultAttendanceData((prevDefaultData) => ({
      ...prevDefaultData,
      ...attendanceData,
    }));
  }, [attendanceData]);

  const handleUpdateAttendance = () => {
    // Create an array for default values
    const defaultAttendanceArray = Object.keys(defaultAttendanceData).map((studentId) => ({
      studentId,
      attendance: 'absent',
    }));

    // Combine default values with updated values
    const combinedAttendanceArray = [
      ...defaultAttendanceArray,
      ...Object.entries(attendanceData).map(([studentId, attendance]) => ({
        studentId,
        attendance,
      }))
    ];

    const resultMap = new Map();

    // Iterate over the array in reverse order to keep the last occurrence
    for (let i = combinedAttendanceArray.length - 1; i >= 0; i--) {
      const item = combinedAttendanceArray[i];
      // Set the item in the map only if the key (studentId) is not already present
      if (!resultMap.has(item.studentId)) {
        resultMap.set(item.studentId, item);
      }
    }

    const uniqueLastOccurrenceList = Array.from(resultMap.values());

    Axios.post(`${URL}/attendance`, { attendanceData: uniqueLastOccurrenceList })
      .then(() => {
        console.log('Attendance recorded successfully');
        setUpdateMessage('Attendance has been updated successfully!'); // Set success message
        setTimeout(() => setUpdateMessage(''), 3000); // Clear the message after 3 seconds
      })
      .catch((error) => {
        console.error('Error recording attendance:', error);
        setUpdateMessage('Failed to update attendance. Please try again.'); // Set failure message
        setTimeout(() => setUpdateMessage(''), 3000); // Clear the message after 3 seconds
      });
  };

  const [downloadDate, setDownloadDate] = useState('');

  const handleInputChange = (event) => {
    setDownloadDate(event.target.value);
  };

  const handleDownloadToday = () => {
    Axios.get(`${URL}/attendanceToday/${downloadDate}`, {
      responseType: 'arraybuffer',
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="StudentList">
      <label>Search by student name:</label>
      <SearchComponent
        data={studentList}
        searchKey="Name"
        setSearchResults={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Name</th>
            <th style={{ textAlign: 'center' }}>Register Number</th>
            <th style={{ textAlign: 'center' }}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((student) => (
            <tr key={student._id}>
              <td>{student.Name}</td>
              <td>{student.Register_number}</td>
              <td>
                <div className="attendance-container">
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="present"
                      checked={defaultAttendanceData[student._id] === 'present'}
                      onChange={() =>
                        handleAttendanceChange(student._id, 'present')
                      }
                    />
                    Present
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="absent"
                      checked={defaultAttendanceData[student._id] === 'absent'}
                      onChange={() =>
                        handleAttendanceChange(student._id, 'absent')
                      }
                    />
                    Absent
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="UpdateButton" onClick={handleUpdateAttendance}>
        Update
      </button>

      {updateMessage && <p className="update-message">{updateMessage}</p>} {/* Display the message */}

      <label>Enter the Date for downloading the specific date's attendance</label>
      <input type="text" value={downloadDate} onChange={handleInputChange} />
      <button className="downloadTodayAttendance" onClick={handleDownloadToday}>Download</button>
    </div>
  );
}

export default StudentList;
