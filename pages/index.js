import Head from 'next/head'
import Feed from '../components/feed/Feed';

export default function Home() {  
  return (
    <>
      <Head>
        <title>Simplest</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="lg:grid lg:grid-cols-2 lg:pl-[180px] lg:pr-6">
        {/* Feed */}
        <Feed />

        {/* Widgets */}
        <div></div>
      </div>
    </>
  )
}
