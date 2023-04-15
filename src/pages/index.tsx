import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios'
import { useState } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [data, setLink] = useState<string>("")

  const handleChange = (e: any) => {
    setLink(e.target.value)
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2 className='text-3xl text-center p-8 '>Mochify</h2>
        <div className='rounded-xl active:border-red-500 border '>
          <input type='text' value={data} onChange={handleChange} placeholder='Inserte su link' className='rounded-l-xl outline-none px-4 py-2 text-black '></input><DownloadButton input={data} />
        </div>
      </form>
    </main>
  )
}


function DownloadButton({ input }: any) {
  const [loading, setLoading] = useState(false)
  const downloadVideo = async () => {
    try {
      const videoLink = input;
      setLoading(true)
      const response = await axios.get(`http://186.130.43.148:7000/?video=${videoLink}`, { responseType: 'blob' });

      // const title = response.headers["content-disposition"].slice(21)
      // console.log(response)
      const title = "audio.mp3"
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false)
    } catch (error) {
      console.log("error", error)
    }

  };

  return <>
    {!loading ? <button onClick={downloadVideo} className='bg-pink-400 px-2 py-2 rounded-r-xl hover:bg-pink-500'>Descargar</button> : <>
      <button className='bg-pink-400 px-2 py-2 rounded-r-xl hover:bg-pink-500'>Cargando</button></>}

  </>
}
