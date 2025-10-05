"use client"

export function DocumentationSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0b2e] to-black py-20 px-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="space-y-12">
          {/* Section Title */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Documentation
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Learn more about Cosmotrix through our comprehensive video guide
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/30 shadow-2xl">
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-10 h-10 text-white ml-1"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white/60 text-lg font-medium">
                  Video will be embedded here
                </p>
                <p className="text-white/40 text-sm">
                  YouTube video placeholder
                </p>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Optional: Uncomment when you have the YouTube video ID */}
            {/* <iframe
              className="w-full aspect-video rounded-2xl"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Cosmotrix Documentation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
}
