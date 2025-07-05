import { useEffect, useState } from "react";
import { checkingHeading, replaceHeadingStars } from "../helper";

const Answer = ({ ans, index, totalResult,type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkingHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStars(ans));
    }
  }, [ans]);

  return (
    <div >
      {
        index === 0 && totalResult >1 ? (
          <span className="pt-2 text-2xl block">{answer}</span>  // main heading
        ) : heading ? (
          <span className="pt-2 text-xl block">{answer}</span> // heading
        ) : (
          <span className={type === "q" ? "pl-1 text-md" : "pl-5 text-md"}>{answer}</span>
        ) // sub-heading
      }
    </div>
  );
};

export default Answer;
