import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const GlobalDataService = {
    getRole : ()=>{
       const token = Cookies.get("token");
       const decoded = jwtDecode(token);
       return decoded.role_id
    }      
}
