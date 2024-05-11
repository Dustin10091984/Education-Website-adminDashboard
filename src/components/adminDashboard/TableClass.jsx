import { useState, useEffect } from "react";
import { BiDetail } from "react-icons/bi";
import axios from "axios";
import { GiCalendarHalfYear } from "react-icons/gi";
import { SiSessionize } from "react-icons/si";
import { GiTeacher } from "react-icons/gi";
import { PiStudentDuotone } from "react-icons/pi";
import { MdOutlineClass } from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";

const TableClass = ({ ShowModel, setShowModel, RowSelected }) => {
  let [Data, setData] = useState({});
  useEffect(() => {
    const token =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwNDUwOTQ1LCJpYXQiOjE3MDk5MTA5NDUsImp0aSI6IjQ4YmFiYWYwMDI0NjRjMWNiN2Q2MGU3YTZjZjliYzNjIiwidXNlcl9pZCI6ODR9.s2r4tVHN4eAbD-oYo37u-Sb50za74ihidDmAYSFpQjY";
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`http://api.ebsalar.com/api/v1/admin/class_room/${RowSelected}`, {
        headers,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  useEffect(() => {
    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwNDUwOTQ1LCJpYXQiOjE3MDk5MTA5NDUsImp0aSI6IjQ4YmFiYWYwMDI0NjRjMWNiN2Q2MGU3YTZjZjliYzNjIiwidXNlcl9pZCI6ODR9.s2r4tVHN4eAbD-oYo37u-Sb50za74ihidDmAYSFpQjY";

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`http://api.ebsalar.com/api/v1/admin/class_room/${RowSelected}`, {
        headers,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [RowSelected]);

  return (
    <div
      className={`relative z-10 ${!ShowModel && "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >


      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            <div className="">
              <div className="">

                <div>
                  <h1
                    className="text-xl font-semibold leading-6 text-blue-100 mt-1"
                    id="modal-title"
                  >
                    Class Detail {RowSelected}
                  </h1>

                  {/*  */}

                  <div className=" ">
                    <ul className="">
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          <GiCalendarHalfYear size={23}  />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {(() => {
                              if (Data.results?.year) {
                                return Data.results.year;
                              }
                            })()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                            year
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          <SiSessionize size={23} />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {(() => {
                              if (Data.results?.term) {
                                return Data.results.term;
                              }
                            })()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                            Term
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          <GiTeacher size={23} />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {(() => {
                              if (Data.results?.teacher) {
                                return (
                                  Data.results.teacher.first_name +
                                  " " +
                                  Data.results.teacher.last_name
                                );
                              }
                            })()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                            Teacher
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          <PiStudentDuotone size={25} />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {(() => {
                              if (Data.results?.students_count) {
                                return Data.results.students_count;
                              }
                            })()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                            Student Count
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          <MdOutlineClass size={25} />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {(() => {
                              if (Data.results?.class_number) {
                                return Data.results.class_number;
                              }
                            })()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                            Class Number
                          </span>
                        </a>
                      </li>
                    </ul>
                    <div>
                      <a
                        href="#"
                        className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                      >
                        <svg
                          className="w-3 h-3 me-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        Lorem ipsum dolor sit amet consectetur.
                      </a>
                    </div>
                  </div>

                  {/*  */}
                </div>
              </div>
            </div>
            <div className="bg-gray-700  px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => setShowModel(false)}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500  px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableClass;
