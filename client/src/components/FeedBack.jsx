import { useEffect, useState } from 'react';
import Headers from './Headers';

export default function FeedBack() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/star/view');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();
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
      <div className="">
        <section className="">
          <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="md:flex md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Read trusted reviews from our customers
                </h2>
              </div>

              <button className="btn btn-outline btn-info" onClick={()=>document.getElementById('my_modal_3').showModal()}
              >
                <span className="font-medium"> Read all reviews </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 rtl:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <div className="flex items-center justify-center">
                    <h1 className='font-bold uppercase text-4xl text-gray-500'>Feedback</h1>
                  </div>
                  <form method="dialog">
                  <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-1">
                      {Array.isArray(reviews) &&
                        reviews.map((review, index) => (
                          <blockquote key={index} className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
                            <div>
                              <div className="rating">
                                {[...Array(review.rates).keys()].map((starIndex) => (
                                  <input
                                    key={starIndex}
                                    type="radio"
                                    name={`rating-${index}`}
                                    className="mask mask-star-2 bg-orange-400"
                                    checked
                                    readOnly
                                  />
                                ))}
                              </div>

                              <div className="mt-4">
                                <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                                  {review.user ? review.user.username.replace(/.(?=.{4})/g, '*') : 'Anonymous'}
                                </p>

                                <p className="mt-4 leading-relaxed text-gray-700">{review.notes}</p>
                              </div>
                            </div>

                            <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                              &mdash; {review.user ? review.user.userId.replace(/.(?=.{4})/g, '*') : 'Anonymous'}
                            </footer>
                          </blockquote>
                        ))}
                  </div>

                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                </div>
              </dialog>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.isArray(reviews) &&
                reviews.slice(0, 6).map((review, index) => (
                  <blockquote key={index} className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
                    <div>
                      <div className="rating">
                        {[...Array(review.rates).keys()].map((starIndex) => (
                          <input
                            key={starIndex}
                            type="radio"
                            name={`rating-${index}`}
                            className="mask mask-star-2 bg-orange-400"
                            checked
                            readOnly
                          />
                        ))}
                      </div>

                      <div className="mt-4">
                        <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                          {review.user ? review.user.username.replace(/.(?=.{4})/g, '*') : 'Anonymous'}
                        </p>

                        <p className="mt-4 leading-relaxed text-gray-700">{review.notes}</p>
                      </div>
                    </div>

                    <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                      &mdash; {review.user ? review.user.userId.replace(/.(?=.{4})/g, '*') : 'Anonymous'}
                    </footer>

                  </blockquote>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
