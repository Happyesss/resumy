const ResumeTemplate1 = ({ data }) => {
  return (
   <div className="max-w-3xl mx-auto p-10 text-sm text-black font-serif  shadow-xl bg-white print:p-10 print:shadow-none print:border-black">
      <h1 className="text-center text-xl font-bold">{data.name || "JHON DOE"}</h1>
      <p className="text-center">{data.address || "123 Broadway ● City, State 12345"}</p>
      <p className="text-center">{data.address2 || "123 Pleasant Lane ● City, State 12345"}</p>
      <p className="text-center">{(data.phone || "(001) - 899 - 9881")} ● {(data.email || "John@resumy.live")}</p>

      <section className="mt-6">
        <h2 className="font-bold border-b border-black pb-1">EDUCATION</h2>
        <div className="flex justify-between mt-1">
          <div>
            <p className="font-semibold">{data.education_university || "University of California, Berkeley"}</p>
            <p>{data.education_degree || "B.S. in Computer Science & Engineering"}</p>
            <p>{data.education_minor || "Minor in Linguistics"}</p>
            <p>{data.education_honors1 || "Member of Eta Kappa Nu"}</p>
            <p>{data.education_honors2 || "Member of Upsilon Pi Epsilon"}</p>
            <p>{data.education_gpa || "Overall GPA: 5.678"}</p>
          </div>
          <p>{data.education_date || "June 2004"}</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-bold border-b border-black pb-1">EXPERIENCE</h2>
        <div className="mt-2">
          <div className="flex justify-between">
            <p className="font-semibold italic">{data.exp1_company || "ACME, Inc"}</p>
            <p className="italic">{data.exp1_dates || "October 2010 - Present"}</p>
          </div>
          <div className="flex justify-between">
            <p className="italic">{data.exp1_title || "Web Developer"}</p>
            <p className="italic">{data.exp1_location || "Palo Alto, CA"}</p>
          </div>
          <ul className="list-disc pl-5">
            {(data.exp1_bullets && Array.isArray(data.exp1_bullets) && data.exp1_bullets.length > 0
              ? data.exp1_bullets
              : [
                  data.exp1_bullet1,
                  data.exp1_bullet2,
                  data.exp1_bullet3,
                  data.exp1_bullet4,
                  data.exp1_bullet5,
                  data.exp1_bullet6,
                ]
            )
              ?.filter(Boolean)
              .map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <p className="font-semibold italic">{data.exp2_company || "AJAX Hosting"}</p>
            <p className="italic">{data.exp2_dates || "December 2009 - October 2010"}</p>
          </div>
          <div className="flex justify-between">
            <p className="italic">{data.exp2_title || "Lead Developer"}</p>
            <p className="italic">{data.exp2_location || "Austin, TX"}</p>
          </div>
          <ul className="list-disc pl-5">
            {(data.exp2_bullets && Array.isArray(data.exp2_bullets) && data.exp2_bullets.length > 0
              ? data.exp2_bullets
              : [
                  data.exp2_bullet1,
                  data.exp2_bullet2,
                  data.exp2_bullet3,
                  data.exp2_bullet4,
                  data.exp2_bullet5,
                ]
            )
              ?.filter(Boolean)
              .map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <p className="font-semibold italic">{data.exp3_company || "TinySoft"}</p>
            <p className="italic">{data.exp3_dates || "January 2008 - April 2010"}</p>
          </div>
          <div className="flex justify-between">
            <p className="italic">{data.exp3_title || "Web Designer & Developer"}</p>
            <p className="italic">{data.exp3_location || "Gainesville, GA"}</p>
          </div>
          <ul className="list-disc pl-5">
            {(data.exp3_bullets && Array.isArray(data.exp3_bullets) && data.exp3_bullets.length > 0
              ? data.exp3_bullets
              : [
                  data.exp3_bullet1,
                  data.exp3_bullet2,
                  data.exp3_bullet3,
                  data.exp3_bullet4,
                ]
            )
              ?.filter(Boolean)
              .map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-bold border-b border-black pb-1">TECHNICAL STRENGTHS</h2>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div>
            <p className="font-semibold">Computer Languages</p>
            <p>{data.skills_languages || "Prolog, Haskell, AWK, Erlang, Scheme, ML"}</p>
          </div>
          <div>
            <p className="font-semibold">Protocols & APIs</p>
            <p>{data.skills_protocols || "XML, JSON, SOAP, REST"}</p>
          </div>
          <div>
            <p className="font-semibold">Databases</p>
            <p>{data.skills_databases || "MySQL, PostgreSQL, Microsoft SQL"}</p>
          </div>
          <div>
            <p className="font-semibold">Tools</p>
            <p>{data.skills_tools || "SVN, Vim, Emacs"}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeTemplate1;
