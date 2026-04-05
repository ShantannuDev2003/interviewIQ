import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { ServerUrl } from '../App';
import { useEffect } from 'react';
import Step3Report from '../components/Step3Report';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const InterviewReport = () => {
  const {id}=useParams();
  const [report,setReport]=React.useState(null);
  console.log(id)

  useEffect(()=>{
    if(!id) return;
    
    const fetchReport=async()=>{
        try{
          console.log("Fetching report for ID:", id);
          const result=await axios.get(ServerUrl+"/api/interview/report/"+id,{withCredentials:true})

          console.log("Report loaded:", result.data)
          setReport(result.data)
        }catch(error){
          console.error("Failed to fetch report:", error.response?.status, error.response?.data?.message || error.message);
        }
    }
    fetchReport();
  },[id])

  if(!report){
    return( <div className="min-h-screen flex items-center justify-center">
           <p className="text-gray-500 text-lg">
            Loading Report...
           </p>
    </div>);
  }

  return (<Step3Report report={report}/>)
}

export default InterviewReport
