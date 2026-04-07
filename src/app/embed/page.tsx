import EmbedClient from '@/components/EmbedClient'
import { getSession } from '@/lib/getSession'
import React from 'react'

import { redirect } from 'next/navigation';

async function page() {
    const session=await getSession()

    if (!session || !session.user) {
        redirect('/login');
    }

  return (
    <>
      <EmbedClient ownerId={session.user.id}/>
    </>
  )
}

export default page
