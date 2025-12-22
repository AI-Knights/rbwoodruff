import UserDetails from "@/components/agencyDashboard/User/UserDetails";

interface PageProps{
    params:{
        id: string;
    }
}

async function page({params}:PageProps) {
    const {id} = await params
  return (
    <div>
      <UserDetails id={id}/>
    </div>
  )
}

export default page
