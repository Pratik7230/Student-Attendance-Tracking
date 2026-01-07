"use client"
import React, { useEffect, useState } from 'react'
import GlobalApi from '../_services/GlobalApi';

function GradeSelect({ selectedGrade, selectedSubjectId }) {

    const [grades, setGrades] = useState([]);

    useEffect(() => {
        if (selectedSubjectId) {
            GetAllGradesList(selectedSubjectId);
        }
    }, [selectedSubjectId])

    const GetAllGradesList = (selectedSubjectId) => {
        GlobalApi.GetAllGradesForSubject(selectedSubjectId).then(resp => {
            setGrades(resp.data);

        })
    }

    return (
        <div>
            <select className='p-2 border rounded-lg'
                onChange={(e) => selectedGrade(e.target.value)}
            >
                <option value="">Select Grade</option>
                {grades.map((item, index) => (
                    <option key={index} value={item.id}>{item.grade}</option>
                ))}
            </select>
        </div>
    )
}

export default GradeSelect