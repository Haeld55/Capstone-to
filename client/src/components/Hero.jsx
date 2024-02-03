import background from '../assets/background.jpg'


export default function Hero() {
  return (
    <div className=''>
    <figure className="relative h-96 w-full">
      <img
        className="h-[75vh] w-full object-cover object-center"
        src={background}
        alt="nature image"
      />
      <figcaption className="absolute top-[15rem] lg:top-[25rem] left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 flex-col sm:flex-row sm:justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
        <div>
          <div className="p-3">
            <p className='font-bold text-xl sm:text-2xl lg:text-3xl xl:text-5xl text-gray-600'>
                <span className='text-logoFirst'>Cool</span>
                <span className='text-logoSecond'>Klean </span>
                Laundry Shop
            </p>
          </div>
          <div className="p-3">
            <p className='font-bold text-md sm:text-lg lg:text-xl xl:text-3xl text-gray-500 uppercase'>Biga II</p>
          </div>
        </div>
        <div className="flex ml-2 sm:ml-0 sm:items-center sm:justify-center">
            <p className='font-bold text-md sm:text-lg lg:text-xl xl:text-3xl text-gray-500 uppercase'>Silang Cavite</p>
        </div>
      </figcaption>
    </figure>

    </div>
  )
}
