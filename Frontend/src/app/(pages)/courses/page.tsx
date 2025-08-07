"use client";
import CourseCard from "../../components/course/CourseCard";
import useFetchData from "../../hooks/FetchData";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const CoursesPage = () => {
  const { getData, result, loading, responseError } = useFetchData();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      await getData("/course/");
    })();
  }, []);

  const filteredCourses = result?.courses?.filter((course: any) => {
    const searchLower = search.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.teacher?.firstName?.toLowerCase().includes(searchLower) ||
      course.teacher?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">All Courses</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by title or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>
      {loading ? (
        <div className="h-full w-full grid place-content-center">
          <ClipLoader />
        </div>
      ) : responseError ? (
        <div className="grid place-content-center text-red-500 mt-10 font-bold">
          Something went wrong, please try again later
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course: any) => (
              <CourseCard
                key={course.id}
                heading={course.title}
                description={course.description}
                level={course.level}
                duration={course.duration}
                teacher={course.teacher}
                icon={course.thumbnail || "/courses/default.jpg"}
                onClick={() => setSelectedCourse(course)}
              />
            ))
          ) : (
            <div>No courses found.</div>
          )}
        </div>
      )}
      {/* Modal for course details */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500"
              onClick={() => setSelectedCourse(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
            <p className="mb-2 text-gray-700">{selectedCourse.description}</p>
            <p className="mb-1">Level: {selectedCourse.level}</p>
            <p className="mb-1">Duration: {selectedCourse.duration}</p>
            <p className="mb-1">
              Teacher: {selectedCourse.teacher?.firstName}{" "}
              {selectedCourse.teacher?.lastName}
            </p>
            <img
              src={selectedCourse.thumbnail || "/courses/default.jpg"}
              alt="Course Thumbnail"
              className="w-full h-48 object-cover rounded mt-4"
            />
            {/* Enrollment button placeholder */}
            <button className="mt-6 w-full bg-[#006A62] text-white py-2 rounded hover:bg-[#FF8C5A] transition">
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
