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
      <form className='rounded-xl' onSubmit={(e) => e.preventDefault()}>
        <input type='text' value={data} onChange={handleChange} placeholder='Inserte su link' className='rounded-l-xl outline-none px-4 py-2 text-black '></input><DownloadButton input={data} />
      </form>
    </main>
  )
}


function DownloadButton({ input }: any) {
  const downloadVideo = async () => {
    try {
      const videoLink = input;
      const response = await axios.get(`/api/hello?link=${videoLink}`, { responseType: 'blob' });
      const title = response.headers["content-disposition"].slice(21)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("error")
    }

  };

  return <button onClick={downloadVideo} className='bg-red-500 px-4 py-2 rounded-r-xl'>Descargar video</button>;
}
