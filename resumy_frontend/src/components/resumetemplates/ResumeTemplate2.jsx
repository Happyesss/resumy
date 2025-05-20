import React from 'react'

const ResumeTemplate2 = ({ data }) => {
  return (
    <div
      className="bg-white text-black font-serif text-[13px] mt-5 mx-auto rounded"
      style={{
        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",
        padding: "2rem",
        overflow: "auto",
      }}
    >
      <div className="flex justify-between items-start flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.name || "Alexandra Smith"}</h1>
          <p className="italic text-[15px] text-red-700 mt-1">{data.title || "Curriculum Vitae"}</p>
        </div>
        <div className="text-sm text-right">
          <p>{data.address || "1234 Elm Street, Springfield, IL 62704"}</p>
          <p className="text-yellow-600">☎ {data.phone || "(555) 123-4567"}</p>
          <p className="text-yellow-600">✉ {data.email || "alexandra.smith@email.com"}</p>
          <p className="text-yellow-600">🌐 {data.website || "www.alexandrasmith.dev"}</p>
        </div>
      </div>

      <hr className="my-4 border-t-2 border-red-600 w-full" />

      <div className="mb-4">
        <h2 className="font-bold text-red-700 uppercase tracking-wide text-[13px]">Doctoral Research</h2>
        <p className="mt-1 italic font-semibold">
          {data.research_title || "“Exploring Quantum Computing Algorithms for Enhanced Cryptography”"}
        </p>
        <p className="mt-1">
          {data.research_desc || "My doctoral research focused on the development and analysis of quantum algorithms to improve cryptographic protocols. I implemented Grover's and Shor's algorithms in simulated environments, evaluated their performance, and published findings in three peer-reviewed journals. The research contributed to a deeper understanding of quantum-resistant encryption and its practical applications in cybersecurity."}
        </p>
      </div>

      <hr className="my-3 border-gray-300" />

      <div className="mb-4">
        <h2 className="font-bold text-red-700 uppercase tracking-wide text-[13px]">Work Experience</h2>

        <div className="mt-2">
          <p className="font-bold">{data.exp1_company || "Innovatech Solutions"} <span className="float-right italic">{data.exp1_dates || "Mar 2020 – Present"}</span></p>
          <p className="italic">{data.exp1_title || "Lead Software Engineer"}</p>
          <p className="mt-1">
            {data.exp1_desc || "Leading a team of 8 engineers to design and deploy scalable SaaS products for enterprise clients. Oversaw migration of legacy systems to cloud infrastructure, resulting in a 30% reduction in operational costs. Mentored junior developers and coordinated cross-functional collaboration with product and design teams."}
          </p>
          {Array.isArray(data.exp1_bullets) && data.exp1_bullets.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {data.exp1_bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2">
          <p className="font-bold">{data.exp2_company || "NextGen Analytics"} <span className="float-right italic">{data.exp2_dates || "Jul 2017 – Feb 2020"}</span></p>
          <p className="italic">{data.exp2_title || "Data Scientist"}</p>
          <p className="mt-1">
            {data.exp2_desc || "Developed machine learning models for predictive analytics in the healthcare sector. Improved patient outcome predictions by 18% through advanced feature engineering and model optimization. Authored internal documentation and presented findings at two national conferences."}
          </p>
          {Array.isArray(data.exp2_bullets) && data.exp2_bullets.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {data.exp2_bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2">
          <p className="font-bold">{data.exp3_company || "Springfield University"} <span className="float-right italic">{data.exp3_dates || "Sep 2015 – Jun 2017"}</span></p>
          <p className="italic">{data.exp3_title || "Graduate Research Assistant"}</p>
          <p className="mt-1">
            {data.exp3_desc || "Assisted in research on distributed systems and published two papers on fault tolerance in cloud computing. Managed lab equipment and mentored undergraduate students in research methodologies."}
          </p>
          {Array.isArray(data.exp3_bullets) && data.exp3_bullets.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {data.exp3_bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <hr className="my-3 border-gray-300" />

      <div className="grid grid-cols-2 gap-x-6 text-[13px]">
        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1">References</h2>
          <p className="font-semibold">{data.ref1_name || "Dr. Emily Carter"}</p>
          <p className="italic">{data.ref1_affil || "Department of Computer Science"}<br/>{data.ref1_org || "Springfield University"}</p>
          <p>{data.ref1_phone || "+1 (217) 555-7890 (Work)"}</p>
          <p className="font-semibold mt-2">{data.ref2_name || "Dr. Michael Lee"}</p>
          <p className="italic">{data.ref2_affil || "Chief Data Scientist"}<br/>{data.ref2_org || "NextGen Analytics"}</p>
          <p>{data.ref2_phone || "+1 (312) 555-2468 (Work)"}</p>
        </div>

        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1">Education</h2>
          <p><span className="font-semibold">{data.edu1_years || "2015 – 2020"}</span> {data.edu1_degree || "Ph.D. in Computer Science"}, {data.edu1_school || "Springfield University"}</p>
          <p><span className="font-semibold">{data.edu2_years || "2013 – 2015"}</span> {data.edu2_degree || "M.Sc. in Computer Science"}, {data.edu2_school || "Springfield University"}</p>
          <p><span className="font-semibold">{data.edu3_years || "2009 – 2013"}</span> {data.edu3_degree || "B.Sc. in Mathematics"}, {data.edu3_school || "Lincoln College"}</p>
        </div>

        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1 mt-3">Awards</h2>
          <p>{data.award1 || "2019 – Outstanding Research Award, Springfield University"}</p>
          <p>{data.award2 || "2017 – Best Paper Award, IEEE Cloud Conference"}</p>
          <p>{data.award3 || "2015 – Dean’s List, Springfield University"}</p>
        </div>

        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1 mt-3">Technical Skills</h2>
          <p><span className="font-semibold">Programming:</span> {data.skills_programming || "Python, Java, C++, JavaScript, R"}</p>
          <p><span className="font-semibold">Frameworks:</span> {data.skills_frameworks || "React, Node.js, TensorFlow, PyTorch"}</p>
          <p><span className="font-semibold">Tools:</span> {data.skills_tools || "Git, Docker, AWS, GCP, SQL"}</p>
        </div>

        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1 mt-3">Communication Skills</h2>
          <p><span className="font-semibold">Conferences:</span> {data.comm_conferences || "Speaker at PyCon 2019, IEEE Cloud 2017"}</p>
          <p><span className="font-semibold">Publications:</span> {data.comm_publications || "5 peer-reviewed journal articles"}</p>
          <p><span className="font-semibold">Languages:</span> {data.comm_languages || "English (native), Spanish (fluent)"}</p>
        </div>

        <div>
          <h2 className="font-bold text-red-700 uppercase tracking-wide mb-1 mt-3">Professional Strengths</h2>
          <p><span className="font-semibold">Leadership:</span> {data.strength_leadership || "Experience managing cross-functional teams"}</p>
          <p><span className="font-semibold">Analytical Thinking:</span> {data.strength_analytical || "Strong problem-solving and data analysis skills"}</p>
        </div>
      </div>
    </div>
  )
}

export default ResumeTemplate2