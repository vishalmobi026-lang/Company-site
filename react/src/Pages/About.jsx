const stats = [
  { name: "Offices", value: "12+" },
  { name: "Employees", value: "300+" },
  { name: "Projects", value: "120+" },
  { name: "Experience", value: "5 Years" },
];

const team = [
  {
    name: "John Doe",
    role: "CEO",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Sara Lee",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function About() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Building the Future 🚀
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We create modern, scalable, and intelligent digital solutions that
            empower businesses worldwide.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978"
            alt="team"
            className="rounded-2xl shadow-lg hover:scale-105 transition duration-500"
          />

          <div>
            <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-4">
              We are a passionate team of developers, designers, and innovators
              focused on delivering high-quality digital products.
            </p>
            <p className="text-gray-600">
              Our mission is to simplify technology and create impactful
              experiences through modern web and mobile solutions.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-3xl font-bold text-indigo-600">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-gray-500 mt-2">
            The people behind our success
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl text-center transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">
  Join Our Courses 🚀
</h2>
       
        <button className="bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Contact Us
        </button>
      </section>
    </>
  );
}