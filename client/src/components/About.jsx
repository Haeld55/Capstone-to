import { Link } from "react-router-dom";
import Headers from "./Headers";
import { useEffect, useState } from "react";

export default function About() {
    const [currentPage, setCurrentPage] = useState('');
    useEffect(() => {
      const currentPath = window.location.pathname;
      setCurrentPage(currentPath);
    }, []);
  return (
    <div className="">
        {currentPage !== '/' && (
        <div className="">
          <Headers />
        </div>
        )}
        <div className="flex items-center justify-center">
            <section>
                <div className="max-w-screen-xl px-4 py-0 sm:px-6 sm:py- lg:px-8 lg:py-10">
                    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
                        <div className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
                            <h2 className="text-3xl font-bold sm:text-5xl text-detailsFont">We Are Quality Laundry Provider In Your City</h2>

                            <p className="mt-4 text-gray-600 text-justify font-bold text-xl">
                            At CoolKlean Laundry Shop, we take pride in providing top-notch laundry services with a commitment to excellence.
                            </p>
                            <Link to={'/login'}>
                                <a
                                className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                                >
                                Get Started Today
                                </a>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                            <p
                            className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                            <span className="inline-block rounded-lg bg-gray-50 p-3">
                                <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 384 512"
                                >
                                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path
                                    d="M96 24c0-13.3 10.7-24 24-24h80c13.3 0 24 10.7 24 24V48h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H88C74.7 96 64 85.3 64 72s10.7-24 24-24h8V24zM0 256c0-70.7 57.3-128 128-128H256c70.7 0 128 57.3 128 128V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256zm256 0v96c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-17.7-14.3-32-32-32s-32 14.3-32 32z"
                                ></path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="30"
                                    d="M96 24c0-13.3 10.7-24 24-24h80c13.3 0 24 10.7 24 24V48h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H88C74.7 96 64 85.3 64 72s10.7-24 24-24h8V24zM0 256c0-70.7 57.3-128 128-128H256c70.7 0 128 57.3 128 128V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256zm256 0v96c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-17.7-14.3-32-32-32s-32 14.3-32 32z"
                                ></path>
                                </svg>
                            </span>

                            <h2 className="mt-2 font-bold text-md lg:text-2xl">Quality Laundry Service</h2>

                            <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600 text-justify">
                            Our laundry facility is equipped with state-of-the-art technology to provide an efficient and effective cleaning process. From washing to drying, we use modern equipment to maintain the quality of your clothes
                            </p>
                            </p>

                            <p
                            className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                            <span className="inline-block rounded-lg bg-gray-50 p-3">
                                <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 640 512"
                                >
                                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path
                                    d="M112 0C85.5 0 64 21.5 64 48V96H16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 272c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 240c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 208c8.8 0 16 7.2 16 16s-7.2 16-16 16H64V416c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H112zM544 237.3V256H416V160h50.7L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"
                                ></path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="20"
                                    d="M112 0C85.5 0 64 21.5 64 48V96H16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 272c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 240c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 208c8.8 0 16 7.2 16 16s-7.2 16-16 16H64V416c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H112zM544 237.3V256H416V160h50.7L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"
                                ></path>
                                </svg>
                            </span>

                            <h2 className="mt-2 font-bold text-md lg:text-2xl">Express Fast Delivery</h2>

                            <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600 text-justify">
                            Express Fast Delivery embodies our dedication to delivering your items promptly. We understand the urgency associated with certain deliveries, and our expedited service ensures that your package reaches its destination swiftly.
                            </p>
                            </p>

                            <p
                            className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                            <span className="inline-block rounded-lg bg-gray-50 p-3">
                                <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 512 512"
                                >
                                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path
                                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                                ></path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="20"
                                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                                ></path>
                                </svg>
                            </span>

                            <h2 className="mt-2 font-bold text-md lg:text-2xl">100% Satisfaction Guarantee</h2>

                            <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600 text-justify">
                            We are dedicated to providing products and services of the highest quality. Our commitment to a 100% satisfaction guarantee means that we stand by the excellence and reliability of what we offer
                            </p>
                            </p>

                            <p
                            className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                            <span className="inline-block rounded-lg bg-gray-50 p-3">
                                <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                                >
                                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path
                                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3H178.3zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7V273.8L591.4 312z"
                                ></path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="30"
                                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3H178.3zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7V273.8L591.4 312z"
                                ></path>
                                </svg>
                            </span>

                            <h2 className="mt-2 font-bold text-md lg:text-2xl">Safety and Convenience</h2>

                            <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600 text-justify">
                            Our laundry facility is equipped with state-of-the-art technology to provide an efficient and effective cleaning process. From washing to drying, we use modern equipment to maintain the quality of your clothes
                            </p>
                            </p>
                            
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}
