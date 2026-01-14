import React, { useMemo } from 'react';

const parseItineraryHtml = (html) => {
  const days = [];

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Find all strong tags that contain "Day X:" pattern
  const strongTags = tempDiv.querySelectorAll('strong');

  strongTags.forEach((strong) => {
    const text = strong.textContent || '';
    const dayMatch = text.match(/Day\s*(\d+)[:\s]*(.*)/i);

    if (dayMatch) {
      const dayNumber = parseInt(dayMatch[1], 10);
      const title = dayMatch[2].trim() || text;

      const parentP = strong.closest('p');
      const items = [];

      if (parentP) {
        let nextElement = parentP.nextElementSibling;

        while (nextElement) {
          if (nextElement.tagName === 'UL') {
            const listItems = nextElement.querySelectorAll('li');
            listItems.forEach((li) => {
              const itemText = li.textContent?.trim();
              if (itemText) {
                items.push(itemText);
              }
            });
            break;
          } else if (
            nextElement.tagName === 'P' &&
            nextElement.querySelector('strong')
          ) {
            // Stop if we hit another day
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }
      }

      days.push({
        dayNumber,
        title: `Day ${dayNumber} ${title}`.toUpperCase(),
        items,
      });
    }
  });

  return days.sort((a, b) => a.dayNumber - b.dayNumber);
};

const ItineraryTimeline = ({ itineraries }) => {
  const itineraryDays = useMemo(
    () => parseItineraryHtml(itineraries),
    [itineraries]
  );

  if (itineraryDays.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#6b7280' }}>
        No itinerary data available
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white sm:p-6">
      {/* Header */}
      <div
        className="mb-6 sm:mb-8 pl-3 sm:pl-4"
        style={{ borderLeft: '4px solid #f97316' }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold"
          style={{ color: '#1f2937' }}
        >
          Day Wise Itinerary
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {itineraryDays.map((day, index) => (
          <div
            key={day.dayNumber}
            className="flex gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            {/* Day Badge and Timeline Line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-white font-semibold text-xs sm:text-sm"
                style={{ backgroundColor: '#f97316' }}
              >
                <span>Day</span>
                <span>{day.dayNumber}</span>
              </div>

              {/* Line for every day, last one slightly shorter (optional) */}
              <div className="flex flex-col items-center flex-1 mt-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#9ca3af' }}
                />
                <div
                  className={`w-0.5 flex-1 ${
                    index === itineraryDays.length - 1
                      ? 'min-h-8 sm:min-h-10' // last day
                      : 'min-h-16 sm:min-h-20' // others
                  }`}
                  style={{ backgroundColor: '#d1d5db' }}
                />
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 min-w-0">
              <div
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-t-lg"
                style={{ backgroundColor: '#fed7aa' }}
              >
                <h3
                  className="font-bold text-sm sm:text-base break-words"
                  style={{ color: '#1f2937' }}
                >
                  {day.title}
                </h3>
              </div>

              <div
                className="px-3 sm:px-4 py-3 sm:py-4 rounded-b-lg border-l border-r border-b"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                }}
              >
                {day.items.length > 0 ? (
                  <ul className="space-y-2">
                    {day.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base"
                        style={{ color: '#374151' }}
                      >
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: '#9ca3af' }}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: '#6b7280' }}
                  >
                    No activities scheduled
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
