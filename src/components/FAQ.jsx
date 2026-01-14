import { useState, useMemo } from "react";

/**
 * Parse FAQ HTML coming from text editor into
 * [{ question: string, answer: string }]
 */
function parseFaqFromHtml(html) {
  if (!html || typeof html !== "string") return [];

  // remove new lines
  const cleaned = html.replace(/\n/g, "");

  // split by Q<number>.
  const blocks = cleaned.split(/<p><strong>Q\d+\.\s*/).slice(1);

  return blocks
    .map((block) => {
      // extract question
      const questionMatch = block.match(/(.*?)<\/strong><\/p>/);
      const question = questionMatch
        ? questionMatch[1].replace(/<\/?[^>]+>/g, "").trim()
        : "";

      // extract answer
      const answerMatch = block.match(
        /<strong>Ans\.\s*<\/strong>(.*?)<\/p>/
      );
      const answer = answerMatch
        ? answerMatch[1].replace(/<\/?[^>]+>/g, "").trim()
        : "";

      if (!question || !answer) return null;

      return { question, answer };
    })
    .filter(Boolean);
}

const INITIAL_VISIBLE = 5;

export default function FAQ({ productName = "", faq }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Convert HTML FAQ → array only once
  const parsedFaq = useMemo(() => {
    if (Array.isArray(faq)) return faq;
    return parseFaqFromHtml(faq);
  }, [faq]);

  const visibleFaqs = useMemo(() => {
    if (expanded) return parsedFaq;
    return parsedFaq.slice(0, INITIAL_VISIBLE);
  }, [parsedFaq, expanded]);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!parsedFaq || parsedFaq.length === 0) return null;

  return (
    <div className="w-full bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-4">
      {/* Heading */}
      <div className="flex items-center gap-4 sm:mb-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold ml-3 md:ml-2">
          {productName} <span className="text-orange-400 ">FAQ</span>
        </h1>
      </div>

      {/* FAQ List */}
      <div className="space-y-0 sm:space-y-1">
        {visibleFaqs.map((item, index) => (
          <div key={index} className="group">
            {/* Question */}
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              className={`w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center gap-4 text-left transition-all duration-200 rounded-sm ${
                openIndex === index
                  ? "bg-white border-b-2 border-orange-500"
                  : "bg-white border-b border-gray-100 hover:bg-gray-50"
              }`}
              aria-expanded={openIndex === index}
            >
              {/* Q number */}
              <span className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs sm:text-sm">
                Q{index + 1}
              </span>

              {/* Question text */}
              <span className="flex-1 text-base sm:text-md font-semibold text-gray-900">
                {item.question}
              </span>

              {/* Caret arrow */}
              <span
                className={`text-gray-600 text-xl sm:text-2xl font-bold transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ^
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 bg-white border-b border-gray-100 ${
                openIndex === index
                  ? "max-h-[800px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 sm:px-6 py-4 sm:py-5 ml-11 sm:ml-14">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>

            {/* Read More Link after 5th FAQ */}
            {!expanded &&
              parsedFaq.length > INITIAL_VISIBLE &&
              index === INITIAL_VISIBLE - 1 && (
                <div className="px-4 mb-[-26px]  sm:px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(true);
                      setOpenIndex(null);
                    }}
                    className="text-orange-500  font-semibold text-md hover:underline"
                  >
                    Read more
                  </button>
                </div>
              )}
          </div>
        ))}

        {/* Show Less */}
        {expanded && parsedFaq.length > INITIAL_VISIBLE && (
          <div className="flex justify-start mb-[-26px] px-4 sm:px-6 py-4 ml-3 sm:ml-3">
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setOpenIndex(null);
              }}
              className="text-orange-600   font-semibold text-sm hover:underline"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
