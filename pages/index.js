import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { AudioPlayer } from "../components/AudioPlayer"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>React Audio Player</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="YOUR_APP_KEY"></script>
      </Head>

      <main className={styles.main}>
        <AudioPlayer />
      </main>
    </div>
  )
}
