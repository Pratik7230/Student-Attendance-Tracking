// import { db } from "@/utils";
// import { ATTENDANCE, GRADES, STUDENTS, SUBJECTS } from "@/utils/schema";
// import { and, eq } from "drizzle-orm"; // Removed unused imports

// import puppeteer from "puppeteer";

// export const getUniqueRecord = (attendanceList) => {
//   const uniqueRecord = [];
//   const existingUser = new Set();

//   attendanceList?.forEach(record => {
//     if (!existingUser.has(record.studentId)) {
//       existingUser.add(record.studentId);
//       uniqueRecord.push(record);
//     }
//   });

//   return uniqueRecord;
// };

// const isPresent = (attendanceList, studentId, day) => {
//   const result = attendanceList.find(item => item.day == day && item.studentId == studentId);
//   return result ? true : false;
// };

// function filterByDateRange(data, from, to) {
//   const parseDate = (str) => {
//     const [month, year] = str.split("/");
//     return new Date(`${year}-${month}-01`); // Convert to YYYY-MM-DD format
//   };

//   const fromDate = parseDate(from);
//   const toDate = parseDate(to);

//   return data.filter(item => {
//     const itemDate = parseDate(item.date);
//     return itemDate >= fromDate && itemDate <= toDate;
//   });
// }


// function groupByDate(data) {
//   return data.reduce((acc, item) => {
//     (acc[item.date] = acc[item.date] || []).push(item);
//     return acc;
//   }, {});
// }

// export async function GET(req) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const gradeId = searchParams.get("gradeId");
//     const from = searchParams.get("from");
//     const to = searchParams.get("to");
//     const selectedSubjectId = searchParams.get("selectedSubjectId");

//     const subject = await db.select({ name: SUBJECTS.name })
//       .from(SUBJECTS)
//       .where(eq(SUBJECTS.id, selectedSubjectId))
//       .then(res => res[0]?.name || "Unknown");

//     const db_result = await db
//       .select({
//         name: STUDENTS.name,
//         present: ATTENDANCE.present,
//         day: ATTENDANCE.day,
//         date: ATTENDANCE.date,
//         grade: GRADES.grade,
//         studentId: STUDENTS.id,
//         attendanceId: ATTENDANCE.id,
//       })
//       .from(STUDENTS)
//       .innerJoin(
//         GRADES, eq(STUDENTS.gradeId, GRADES.id))
//       .leftJoin(
//         ATTENDANCE,
//         and(
//           eq(STUDENTS.id, ATTENDANCE.studentId),
//           eq(ATTENDANCE.subjectId, selectedSubjectId)
//         )
//       )
//       .where(and(eq(STUDENTS.gradeId, gradeId)));

//     const result = filterByDateRange(db_result, from, to);

//     let html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Student Attendance</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 20px;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//             }
//             table, th, td {
//                 border: 1px solid black;
//                 text-align: center;
//                 padding: 10px;
//             }
//             th {
//                 background-color: #f4f4f4;
//             }
//             .info {
//                 margin-bottom: 10px;
//             }
//             .info span {
//                 display: block;
//             }
//             .signatures {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-top: 50px;
//                 font-weight: bold;
//             }
//                 .page-break {
//     page-break-before: always; /* Forces a page break before the element */
// }
//         </style>
//     </head>
//     <body>`


//     const groupedData = groupByDate(result)

//     for (const key in groupedData) {
//       if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
//         const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
//         const numberOfDays = daysInMonth(Number(key.split("/")[1]), Number(key.split("/")[0]));
//         const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

//         const uniqueStudents = getUniqueRecord(groupedData[key]);

//         uniqueStudents.forEach((obj) => {
//           let totalP = 0, totalA = 0;

//           daysArrays.forEach((date) => {
//             obj[date] = isPresent(groupedData[key], obj.studentId, date);
//             if (obj[date]) totalP++; // Count present days
//             else totalA++; // Count absent days
//           });

//           obj.totalP = totalP;
//           obj.totalA = totalA;
//         });

//         html += `<div class="page-break">
//         <h2>Student Attendance Report</h2>
//         <div class="info">
//             <span>Semester: ${uniqueStudents.at(0)?.grade}</span>
//             <span>Month: ${key}</span>
//             <span>Subject: ${subject}</span>
//         </div>
        
//         <table>
//             <tr>
//                 <th>ID</th>
//                 <th>Student Name</th>
//                 ${daysArrays.map(x => `<th>${x}</th>`).join("")}
//                 <th>Total P</th>
//                 <th>Total A</th>
//                 <th> Sign </th>
//             </tr>
//             ${uniqueStudents.map(student => `
//                 <tr>
//                     <td>${student.studentId}</td>
//                     <td>${student.name}</td>
//                     ${daysArrays.map(day => `
//                         <td style="background-color:${!student[day] ? 'rgb(255, 150, 150)' : 'rgb(166, 253, 193)'}">
//                             ${student[day] ? "P" : "A"}
//                         </td>
//                     `).join("")}
//                     <td><b>${student.totalP}</b></td>
//                     <td><b>${student.totalA}</b></td>
//                     <td><b></td>
//                 </tr>
//             `).join("")}
//         </table>
        
//         <div class="signatures">
//             <span>Incharge Sign</span>
//             <span>HOD Sign</span>
//         </div>
//         </div>`
//       }
//     }





//     html += `</body></html>`;

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       landscape: true, // Ensure landscape mode for better table layout
//       printBackground: true, // Ensure colors are printed
//       margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "5mm" }
//     });

//     await browser.close();

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=attendance_report.pdf",
//       },
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }








import { db } from "@/utils";
import { ATTENDANCE, GRADES, STUDENTS, SUBJECTS } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";

export const getUniqueRecord = (attendanceList) => {
  const uniqueRecord = [];
  const existingUser = new Set();

  attendanceList?.forEach(record => {
    if (!existingUser.has(record.studentId)) {
      existingUser.add(record.studentId);
      uniqueRecord.push(record);
    }
  });

  return uniqueRecord;
};

const isPresent = (attendanceList, studentId, day) => {
  const result = attendanceList.find(item => item.day == day && item.studentId == studentId);
  return result ? true : false;
};

function filterByDateRange(data, from, to) {
  const parseDate = (str) => {
    if (!str) return null;
    const [month, year] = str.split("/");
    return new Date(`${year}-${month}-01`);
  };

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  return data.filter(item => {
    if (!item.date) return false;
    const itemDate = parseDate(item.date);
    return itemDate && itemDate >= fromDate && itemDate <= toDate;
  });
}

function groupByDate(data) {
  return data.reduce((acc, item) => {
    if (item.date) {
      (acc[item.date] = acc[item.date] || []).push(item);
    }
    return acc;
  }, {});
}

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const gradeId = searchParams.get("gradeId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const selectedSubjectId = searchParams.get("selectedSubjectId");

    // Validate required parameters
    if (!gradeId || !from || !to || !selectedSubjectId) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subject = await db.select({ name: SUBJECTS.name })
      .from(SUBJECTS)
      .where(eq(SUBJECTS.id, selectedSubjectId))
      .then(res => res[0]?.name || "Unknown");

    const db_result = await db
      .select({
        name: STUDENTS.name,
        present: ATTENDANCE.present,
        day: ATTENDANCE.day,
        date: ATTENDANCE.date,
        grade: GRADES.grade,
        studentId: STUDENTS.id,
        attendanceId: ATTENDANCE.id,
      })
      .from(STUDENTS)
      .innerJoin(GRADES, eq(STUDENTS.gradeId, GRADES.id))
      .leftJoin(ATTENDANCE, and(
        eq(STUDENTS.id, ATTENDANCE.studentId),
        eq(ATTENDANCE.subjectId, selectedSubjectId)
      ))
      .where(and(eq(STUDENTS.gradeId, gradeId)));

    const result = filterByDateRange(db_result, from, to);
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Attendance</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table, th, td {
                border: 1px solid black;
                text-align: center;
                padding: 10px;
            }
            th {
                background-color: #f4f4f4;
            }
            .info {
                margin-bottom: 10px;
            }
            .info span {
                display: block;
            }
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
                font-weight: bold;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>`

    const groupedData = groupByDate(result);
    
    // Check if there's any data to process
    if (Object.keys(groupedData).length === 0) {
      return new Response(JSON.stringify({ error: "No attendance data found for the selected date range" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const key in groupedData) {
      if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
        const [month, year] = key.split("/");
        const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
        const numberOfDays = daysInMonth(Number(year), Number(month));
        const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1)
          .filter(day => new Date(Number(year), Number(month) - 1, day).getDay() !== 0); // Skip Sundays

        const uniqueStudents = getUniqueRecord(groupedData[key]);
        uniqueStudents.forEach((obj) => {
          let totalP = 0, totalA = 0;
          daysArrays.forEach((date) => {
            obj[date] = isPresent(groupedData[key], obj.studentId, date);
            if (obj[date]) totalP++;
            else totalA++;
          });
          obj.totalP = totalP;
          obj.totalA = totalA;
        });

        html += `<div class="page-break">
        <h2>Student Attendance Report</h2>
        <div class="info">
            <span>Semester: ${uniqueStudents.at(0)?.grade}</span>
            <span>Month: ${key}</span>
            <span>Subject: ${subject}</span>
        </div>
        <table>
            <tr>
                <th>ID</th>
                <th>Student Name</th>
                ${daysArrays.map(x => `<th>${x}</th>`).join("")}
                <th>Total P</th>
                <th>Total A</th>
                <th> Sign </th>
            </tr>
            ${uniqueStudents.map(student => `
                <tr>
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    ${daysArrays.map(day => `
                        <td style="background-color:${!student[day] ? 'rgb(255, 150, 150)' : 'rgb(166, 253, 193)'}">
                            ${student[day] ? "P" : "A"}
                        </td>
                    `).join("")}
                    <td><b>${student.totalP}</b></td>
                    <td><b>${student.totalA}</b></td>
                    <td></td>
                </tr>
            `).join("")}
        </table>
        <div class="signatures">
            <span>Incharge Sign</span>
            <span>HOD Sign</span>
        </div>
        </div>`
      }
    }
    html += `</body></html>`;

    // Configure Chromium for serverless (Vercel/Lambda)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    let browser;
    if (isProduction) {
      // Use serverless-optimized Chromium for Vercel
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Use local Puppeteer for development
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      landscape: true, 
      printBackground: true, 
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "5mm" } 
    });
    await browser.close();

    return new Response(pdfBuffer, { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=attendance_report.pdf" } });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error", 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
