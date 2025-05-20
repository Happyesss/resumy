import React from 'react'

const ResumeTemplate3 = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white text-black p-8  shadow-lg font-sans text-xs print:shadow-none print:border-none">
      <div className="text-center pb-3">
        <h1 className="text-2xl font-bold">{data.name || "Debarghya Das"}</h1>
        <p className="text-blue-600 text-xs">{data.website || "http://debarghyadas.com"}</p>
        <p className="text-xs text-gray-700">{data.email || "dd367@cornell.edu"} | {data.phone || "607.379.5733"}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-1 space-y-4">
          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">EDUCATION</h2>
            <p className="font-bold text-xs">{data.edu1_school || "CORNELL UNIVERSITY"}</p>
            <p className="text-xs italic">{data.edu1_degree || "MEng in Computer Science"}</p>
            <p className="text-xs">{data.edu1_date || "Expected Dec 2014 | Ithaca, NY"}</p>
            <p className="text-xs">{data.edu1_gpa || "CUM. GPA: N/A"}</p>
            <p className="mt-2 font-bold text-xs">{data.edu2_degree || "BS in Computer Science"}</p>
            <p className="text-xs">{data.edu2_date || "Expected May 2014 | Ithaca, NY"}</p>
            <p className="text-xs">{data.edu2_honors || "Dean’s List (All Semesters)"}</p>
            <p className="text-xs">{data.edu2_gpa || "CUM. GPA: 3.9 / 4.0"}</p>
            <p className="text-xs">{data.edu2_major_gpa || "Major GPA: 3.94 / 4.0"}</p>
            <p className="mt-2 font-bold text-xs">{data.edu3_school || "LA MARTINIERE FOR BOYS"}</p>
            <p className="text-xs">{data.edu3_date || "Grad. May 2011 | Kolkata, India"}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">LINKS</h2>
            <ul className="text-xs list-disc list-inside">
              <li>{data.link_github || "Github:// deedyas"}</li>
              <li>{data.link_linkedin || "LinkedIn:// debarghyadas"}</li>
              <li>{data.link_youtube || "YouTube:// DeedyDash007"}</li>
              <li>{data.link_twitter || "Twitter:// @debarghya_das"}</li>
              <li>{data.link_quora || "Quora:// Debarghya-Das"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">COURSEWORK</h2>
            <p className="text-xs font-bold mt-2">GRADUATE</p>
            <ul className="text-xs list-disc list-inside">
              <li>{data.cw_grad1 || "Advanced Machine Learning"}</li>
              <li>{data.cw_grad2 || "Open Source Software Engineering"}</li>
              <li>{data.cw_grad3 || "Advanced Interactive Graphics"}</li>
              <li>{data.cw_grad4 || "Compilers + Practicum"}</li>
              <li>{data.cw_grad5 || "Cloud Computing"}</li>
            </ul>
            <p className="text-xs font-bold mt-2">UNDERGRADUATE</p>
            <ul className="text-xs list-disc list-inside">
              <li>{data.cw_ug1 || "Information Retrieval"}</li>
              <li>{data.cw_ug2 || "Operating Systems"}</li>
              <li>{data.cw_ug3 || "Artificial Intelligence + Practicum"}</li>
              <li>{data.cw_ug4 || "Functional Programming"}</li>
              <li>{data.cw_ug5 || "Computer Graphics + Practicum"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">SKILLS</h2>
            <p className="text-xs font-bold">PROGRAMMING</p>
            <p className="text-xs">{data.skills_5000 || "Over 5000 lines:"}</p>
            <p className="text-xs">{data.skills_5000_list1 || "Java , Shell , JavaScript , Matlab"}</p>
            <p className="text-xs">{data.skills_5000_list2 || "OCaml , Python , Rails , LaTeX{}"}</p>
            <p className="text-xs">{data.skills_1000 || "Over 1000 lines:"}</p>
            <p className="text-xs">{data.skills_1000_list || "C , C++ , CSS , PHP , Assembly"}</p>
            <p className="text-xs">{data.skills_familiar || "Familiar: AS3 , iOS , Android , MySQL"}</p>
          </section>
        </div>

        <div className="col-span-2 space-y-4">
          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">EXPERIENCE</h2>
            <div>
              <p className="font-bold text-xs">{data.exp1_company || "COURSERA | KPCB Fellow + Software Engineering Intern"}</p>
              <p className="text-xs italic">{data.exp1_dates || "Expected June 2014 – Sep 2014 | Mountain View, CA"}</p>
              {Array.isArray(data.exp1_bullets) && data.exp1_bullets.length > 0 ? (
                <ul className="list-disc list-inside text-xs">
                  {data.exp1_bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs">{data.exp1_bullet1 || "• 52 out of 2500 applicants chosen to be a KPCB Fellow 2014."}</p>
              )}
            </div>
            <div className="mt-2">
              <p className="font-bold text-xs">{data.exp2_company || "GOOGLE | Software Engineering Intern"}</p>
              <p className="text-xs italic">{data.exp2_dates || "May 2013 – Aug 2013 | Mountain View, CA"}</p>
              {Array.isArray(data.exp2_bullets) && data.exp2_bullets.length > 0 ? (
                <ul className="list-disc list-inside text-xs">
                  {data.exp2_bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc list-inside text-xs">
                  <li>{data.exp2_bullet1 || "Worked on YouTube Captions using JS and Python to implement full stack auto-captioning."}</li>
                  <li>{data.exp2_bullet2 || "Created a backbone.js-like framework for the Captions editor."}</li>
                  <li>{data.exp2_bullet3 || "Reviewed, perfected, and pushed all code to production."}</li>
                </ul>
              )}
            </div>
            <div className="mt-2">
              <p className="font-bold text-xs">{data.exp3_company || "PHABRICATOR | Open Source Contributor & Team Leader"}</p>
              <p className="text-xs italic">{data.exp3_dates || "Jan 2013 – May 2013 | Palo Alto, CA & Ithaca, NY"}</p>
              {Array.isArray(data.exp3_bullets) && data.exp3_bullets.length > 0 ? (
                <ul className="list-disc list-inside text-xs">
                  {data.exp3_bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc list-inside text-xs">
                  <li>{data.exp3_bullet1 || "Created Meme generator, Lispium, and more in PHP and Shell."}</li>
                  <li>{data.exp3_bullet2 || "Led team from MIT, Cornell, London, and U Helsinki."}</li>
                </ul>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">RESEARCH</h2>
            <p className="font-bold text-xs">{data.research1_title || "CORNELL ROBOT LEARNING LAB | Head Undergrad Research"}</p>
            <p className="text-xs italic">{data.research1_dates || "Jan 2014 – Present | Ithaca, NY"}</p>
            <p className="text-xs">{data.research1_desc || "Worked with Ashesh Jain and Prof Ashutosh Saxena to create Planet, a tool using large-scale preference feedback."}</p>
            <p className="font-bold text-xs mt-2">{data.research2_title || "CORNELL PHONETICS LAB | Head Undergraduate Researcher"}</p>
            <p className="text-xs italic">{data.research2_dates || "Mar 2012 – May 2013 | Ithaca, NY"}</p>
            <p className="text-xs">{data.research2_desc || "Led development of QuickTongue with Prof Sam Tilsen."}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">AWARDS</h2>
            <ul className="list-disc list-inside text-xs">
              <li>{data.award1 || "2014: Top 52/2500 – KPCB Engineering Fellow"}</li>
              <li>{data.award2 || "2014: Microsoft Coding Competition Finalist"}</li>
              <li>{data.award3 || "2013: CS 3410 Cache Race Bot Tournament"}</li>
              <li>{data.award4 || "2012: CS 3110 Biannual Intra-Class Bot Tournament"}</li>
              <li>{data.award5 || "2011: INMO Finalist"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1">SOCIETIES</h2>
            <ul className="list-disc list-inside text-xs">
              <li>{data.society1 || "2014: Tau Beta Pi Engineering Honor Society"}</li>
              <li>{data.society2 || "2012: Golden Key International Honour Society"}</li>
              <li>{data.society3 || "2012: National Society of Collegiate Scholars"}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ResumeTemplate3