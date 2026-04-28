import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Technical() {
  const courses = [
    {
      title: "Full-Stack Development",
      desc: "Building both the front end and back end of an application.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      title: "MERN Stack Development",
      desc: "Enables building full-stack web applications using only JavaScript.",
      img: "https://miro.medium.com/v2/resize:fit:1400/1*0G5zu7-Cx6h2n1Zb8Z9g7A.png"
    },
    {
      title: "MEAN Stack Development",
      desc: "Utilizes JavaScript for both front-end and back-end.",
      img: "https://miro.medium.com/v2/resize:fit:1400/1*Q5EUk28Xc3s9Zx9lY7yPsg.png"
    },
    {
      title: "Python Developer",
      desc: "Integrates Modern front-end and back-end technologies.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    },
    {
      title: "Java Developer",
      desc: "They build scource,scalable, and high-performance applications.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
    },
    {
      title: "JavaScript",
      desc: "JavaScript is a powerful scripting language that makes websites interactive, dynamic,and responsive.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
     {
      title: "Html",
      desc: "HTML is the standard language used to create and structure content on websites.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      title: "css",
      desc: "CSS styles your web pages, making them visually appealing and responsive across devices.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      title: "Machine Learning",
      desc: "Machine Learning is a subset of AI that enables systems to learn and improve from experience.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
       {
      title: "Data Science",
      desc: "Data Science is the field of extracting insights and knowledge from data using various techniques and tools.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    
       {
      title: "Artificial Intelligence",
      desc: "Artificial Intelligence is the simulation of human intelligence in machines.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    
       {
      title: "PHP Developer",
      desc: "PHP is a server-side scripting language designed for web development.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    
       {
      title: "MySQL",
      desc: "MySQL is an open-source relational database management system.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
        {
      title: "SQL 3",
      desc: "Manage & query databases effectively,powering smaart data decisions.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      title: "MongoDB",
      desc: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      title: "Oracle",
      desc: "Manage & query databases effectively,powering smaart data decisions.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
  ];

  return (
    <div className="bg-gray-100 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
        Software Courses
      </h1>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10">
        {courses.map((course, index) => (
          
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            
            whileHover={{
              rotateX: 5,
              rotateY: -5,
              scale: 1.05
            }}

            className="relative w-[320px] rounded-2xl group"
          >

            {/* 🔥 GLOW BORDER */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition duration-500"></div>

            {/* CARD */}
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={course.img}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />

                {/* 🔥 OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2">
                  {course.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {course.desc}
                </p>

                {/* CERTIFICATE */}
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <FaCheckCircle />
                  <span>Certificate Course</span>
                </div>

                {/* BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 mx-auto relative overflow-hidden"
                >
                  {/* 🔥 BUTTON GLOW */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>

                  Add Now

                  <motion.span
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </motion.button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Technical;