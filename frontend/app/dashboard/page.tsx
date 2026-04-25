import DashboardClient from '@/components/DashboardClient'
import { getSession } from '@shared/lib/getSession'
import React from 'react'

import { redirect } from 'next/navigation';

async function page() {
    const session=await getSession()
    
    if (!session || !session.user) {
        redirect('/login');
    }
       
  return (
    <>
      <DashboardClient 
        ownerId={session.user.id} 
        userName={session.user.name} 
        userEmail={session.user.email} 
      />
    </>
  )
}

export default page
