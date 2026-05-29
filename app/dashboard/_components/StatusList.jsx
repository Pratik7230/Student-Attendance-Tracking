import { getUniqueRecord } from '@/app/_services/service';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';

function StatusList({ attendanceList }) {
  const [totalStudent, setTotalstudent] = useState(0);
  const [presentPerc, setPresentPerc] = useState(0);

  useEffect(() => {
    console.log(attendanceList);
    if (attendanceList && attendanceList.length > 0) {
      const totalSt = getUniqueRecord(attendanceList);
      setTotalstudent(totalSt.length);

      const today = moment().format('D');
      const PresentPrec =
        (attendanceList.length / (totalSt.length * Number(today))) * 100;
      setPresentPerc(PresentPrec);
    }
  }, [attendanceList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6 ">
      <Card
        icon={<GraduationCap className="text-gray-700 dark:text-white" />}
        title="Total Student"
        value={totalStudent}
      />
      <Card
        icon={<TrendingUp className="text-green-600 dark:text-green-400" />}
        title="Total Present"
        value={presentPerc.toFixed(1) + '%'}
      />
      <Card
        icon={<TrendingDown className="text-red-600 dark:text-red-400" />}
        title="Total Absent"
        value={(100 - presentPerc).toFixed(1) + '%'}
      />
    </div>
  );
}

export default StatusList;
