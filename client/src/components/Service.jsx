import { useState, useEffect } from 'react';
import Headers from './Headers';

export default function Service() {
    const [washService, setWashService] = useState(null);
    const [specialService, setSpecialService] = useState(null);
    const [walkService, setWalkService] = useState(null);
    const [dropService, setDropService] = useState(null);
  
    useEffect(() => {
      const fetchData = async (url, setData) => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData('/api/service/wash', setWashService);
      fetchData('/api/service/special', setSpecialService);
      fetchData('/api/service/walk', setWalkService);
      fetchData('/api/service/drop', setDropService);
    }, []);

    const [currentPage, setCurrentPage] = useState('');
    useEffect(() => {
      const currentPath = window.location.pathname;
      setCurrentPage(currentPath);
    }, []);
  return (
    <div>
        {currentPage !== '/' && (
        <div className="">
          <Headers />
        </div>
        )}
        <div className="flex items-center justify-center my-10">
          <section className="bg-white">
              <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                  <div className="mx-auto max-w-3xl text-center">
                  <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Service</h2>

                  <p className="mt-4 text-gray-500 sm:text-xl">
                  Experience convenience and safety with our Service offerings tailored to elevate your laundry experience
                  </p>
                  </div>
                  <div className="mt-8 sm:mt-12 flex flex-col gap-5">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">

                            <dd className="lg:text-4xl font-extrabold text-blue-600 md:text-2xl">
                              Onsite Customer
                            </dd>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-lg bg-blue-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Walk In</dt>

                        {walkService ? (
                            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {walkService.defaultCost}
                            </dd>
                        ) : (
                            <p>Loading...</p>
                        )}
                        </div>

                        <div className="flex flex-col items-center justify-center ounded-lg bg-blue-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Drop Off</dt>

                        {dropService ? (
                            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {dropService.defaultCost}
                            </dd>
                        ) : (
                            <p>Loading...</p>
                        )}
                        </div>
                    </dl>

                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">

                            <dd className="lg:text-4xl font-extrabold text-blue-600 md:text-2xl">
                              Online Customer
                            </dd>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-lg bg-blue-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Wash And Dry</dt>

                        {washService ? (
                            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {washService.defaultCost}
                            </dd>
                        ) : (
                            <p>Loading...</p>
                        )}
                        </div>

                        <div className="flex flex-col items-center justify-center ounded-lg bg-blue-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Special Item</dt>

                        {specialService ? (
                            <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {specialService.defaultCost}
                            </dd>
                        ) : (
                            <p>Loading...</p>
                        )}
                        </div>
                    </dl>
                  </div>
              </div>
          </section>
        </div>
    </div>
  )
}
