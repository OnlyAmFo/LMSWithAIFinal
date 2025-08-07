import prisma from "../lib/dbConnection.js";

// get pagination from this function
const getPaginationData= async (model,pageNumber=1,limit=10)=>{
    try{
const page=Math.max(pageNumber || 1,1);
const perPage=Math.max(limit || 10,10);
const skip=(page-1)*perPage;
const calculatePagenumber=await prisma[model].count();
const totalPages=Math.ceil(calculatePagenumber/limit)
return{perPage,skip,totalPages};
    }catch(error){
        console.log({error});
        throw error;
    }
}
export default getPaginationData;