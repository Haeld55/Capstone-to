import About from '../components/About'
import Headers from '../components/Headers'
import Hero from '../components/Hero'
import FeedBack from '../components/FeedBack'
import Service from '../components/Service'
import Footer from '../components/Footer'


export default function Home() {
  return (
    <div className='flex flex-col'>
      <div className="">
        <Headers />
      </div>
      <div className="mb-52">
        <Hero />
      </div>
      <div className="flex items-center justify-center mt-52">
        <About />
      </div>
      <div className="mt-10 mb-40">
        <Service />
      </div>
      <div className="mb-32">
        <FeedBack />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  )
}
