import React, { useState } from "react"

const RichTextBlock = ({ html }) => (
  <div
    className="space-y-3 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_li]:space-y-1 [&_p]:leading-6 [&_ul]:space-y-2"
    dangerouslySetInnerHTML={{ __html: html }}
  />
)

const GameDescription = ({
  title,
  image,
  imageAlt,
  summaryTitle,
  summary,
  howToPlayTitle,
  howToPlay,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`collapse collapse-arrow bg-base-100 border border-base-300 ${open ? "collapse-open" : ""}`}
      onClick={() => setOpen(!open)}>
      <div className="collapse-title font-semibold">{title}</div>
      <div className="collapse-content">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-48 lg:w-56 shrink-0">
            <div className="overflow-hidden rounded-xl border border-base-300 bg-base-200 aspect-square md:aspect-[3/4]">
              <img
                src={image}
                alt={imageAlt || title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm leading-6">
            <section className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">
                {summaryTitle}
              </h2>
              <RichTextBlock html={summary} />
            </section>

            <section className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">
                {howToPlayTitle}
              </h2>

              <RichTextBlock html={howToPlay} />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDescription
