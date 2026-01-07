"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function TeacherSubjectSelect({ selectedSubjectId }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        GetSubjectsList();
    }, []);

    const GetSubjectsList = () => {
        const token = Cookies.get('token')
        const { id } = jwtDecode(token)
        GlobalApi.GetTeacherSubjects(id)
            .then(resp => {
                console.log("Subjects API Response:", resp.data);
                setSubjects(resp.data);
            })
            .catch(error => console.error("Error fetching subjects:", error));
    };


    return (
        <div>
            <select
                className="p-2 border rounded-lg"
                onChange={(e) => selectedSubjectId(e.target.value)}
            >
                <option value="">Select Subject</option>
                {subjects.map((item, index) => (
                    <option key={index} value={item.id}>{item.name}</option> // Fix: Use item.name
                ))}
            </select>

        </div>
    );
}

export default TeacherSubjectSelect;
