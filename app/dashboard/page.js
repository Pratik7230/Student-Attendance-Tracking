'use client';
import { useEffect } from 'react';
import { GlobalDataService } from '../_services/globalDataService';
import { useRouter } from 'next/navigation';
import { ROUTE_ACCESS } from '../constants';

export default function CommonDashboard() {
  const router = useRouter();
  useEffect(() => {
    const role_id = GlobalDataService.getRole();
    const firstRoute = ROUTE_ACCESS[role_id];
    if (firstRoute && firstRoute.length > 0) {
    }
    // if(role_id == 1){
    //     router.push("/dashboard/admin")
    // }else if(role_id == 2){
    //     router.push("/dashboard/teacher")
    // }else if(role_id == 3){
    //     router.push("/dashboard/StudentView")
    // }
  }, []);
  return <>WELCOME</>;
}
