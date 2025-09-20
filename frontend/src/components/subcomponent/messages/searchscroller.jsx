import axios from "axios";
import { backendbaseurl } from "../../../baseurl/baseurl";

export async function searchscroller(
  searchmsgid,
  chatuserid,
  setChatMessage,

 
) {
  try {
    const res = await axios.get(
      `${backendbaseurl}/api/chat/searchwindow/${chatuserid}/${searchmsgid}`,
      { withCredentials: true }
    );
    
     setChatMessage([...res.data]);
 
     return searchmsgid;
  } catch (err) {
    console.error("Error in searchscroller:", err);
    return null;
  }
}
