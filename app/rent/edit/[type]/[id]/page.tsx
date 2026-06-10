"use client"
import RentPgHome from "@/app/rent/[type]/component/RentPgHome";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect,useState } from "react"

export default function EditProperty(){
    const params=useParams();
    const [property,setProperty] = useState([]);
    const getproperty=async()=>{
        try{
            const response=await axios.get(`/api/property/${params.id}`)
            setProperty(response.data); 
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getproperty();
    },[params])
    return(
        <RentPgHome Property={property} reqtype="update"/>
    )
}