// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


import youtubeDl from 'youtube-dl-exec';
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url';
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url));




const youtubeUrl = "https://www.youtube.com/watch?v="






function getYoutubeVideoId(link: string) {
  const url = new URL(link);
  const params = new URLSearchParams(url.search);
  return params.get("v");
}


function clearTempFolder() {
  const tempDir = path.join(__dirname, 'temp');

  fs.readdir(tempDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err;
      });
    }
  });
}








const fetchVideo = async (id: string) => {

  const data: any = await youtubeDl(youtubeUrl + id, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: [
      'referer:youtube.com',
      'user-agent:googlebot'
    ]
  })
  const { url } = data.requested_formats.find((el: any) => !el.fps)
  console.log("Iniciando descarga...")
  const audio = await downloadVideo(url, data.title)
  console.log("el titulo ", audio)
  return audio
}



const downloadVideo = async (url: string, title: string) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'stream',
      headers: {
        Range: 'bytes=0-1999999999'
      }
    }).then(function (response: any) {
      const videoPath = path.join(__dirname, 'temp', title + '.mp3');
      response.data.pipe(fs.createWriteStream(videoPath).on('finish', (res: any) => {
        console.log("Descarga completa")
        resolve(title)
      }))
    }).catch((err) => reject(err));
  })
}



type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {

    if (req.query.link) {
      const videoId = getYoutubeVideoId(req.query.link as any);
      const videoStream = await fetchVideo(videoId as any);
      const videoTitle = `${videoStream}`;
      const videoPath = path.join(__dirname, 'temp', videoTitle + '.mp3');
      console.log("videotitle ", videoTitle)
      res.status(200);
      res.setHeader('Content-Type', 'audio/mp3');
      res.setHeader('Content-Disposition', `attachment; filename=${videoTitle}.mp3`);
      fs.createReadStream(videoPath).pipe(res);
      clearTempFolder()
    } else {
      res.status(400).send({ name: 'error' });
    }
  } catch (error: any) {
    res.status(500).send({ error: error.message })
  }

}
