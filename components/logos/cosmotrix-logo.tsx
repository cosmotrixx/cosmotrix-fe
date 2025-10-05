import React from 'react'

interface CosmotrixLogoProps {
  width?: number | string
  height?: number | string
  className?: string
}

export const CosmotrixLogo: React.FC<CosmotrixLogoProps> = ({ 
  width = 32, 
  height = 32, 
  className = "" 
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 498 478" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M192.907 232.588C322.263 172.242 447.63 167.268 472.92 221.479C498.21 275.69 413.847 368.558 284.491 428.905C155.135 489.251 29.7698 494.224 4.47949 440.013C-20.8107 385.802 63.5511 292.935 192.907 232.588ZM439.648 219.484C420.962 179.429 314.395 189.606 201.624 242.215C88.8532 294.824 12.5832 369.944 31.2695 409.999C49.9562 450.054 156.522 439.877 269.293 387.268C382.064 334.659 458.335 259.539 439.648 219.484Z" fill="url(#paint0_linear_171_1781)"/>
<path d="M230.437 112C322.668 112 397.437 185.425 397.437 276C397.437 277.022 397.423 278.043 397.404 279.061C359.271 314.954 309.573 348.362 251.868 374.678C213.604 392.128 175.292 404.873 138.63 413.016C93.3304 383.684 63.4365 333.271 63.4365 276C63.4365 185.425 138.205 112 230.437 112Z" fill="url(#paint1_linear_171_1781)"/>
<path d="M295.437 105.713C295.437 105.713 347.658 95.8425 366.474 75.9872C385.29 56.1318 396.763 1.08715 396.763 1.08715C396.763 1.08715 408.031 56.5874 426.793 74.3676C445.555 92.1479 490.407 103.909 490.407 103.909C490.407 103.909 444.028 113.576 425.212 133.432C406.396 153.287 396.444 197.509 396.444 197.509C396.444 197.509 387.455 152.729 368.693 134.949C349.93 117.169 295.437 105.713 295.437 105.713Z" fill="url(#paint2_linear_171_1781)"/>
<defs>
<linearGradient id="paint0_linear_171_1781" x1="284.077" y1="187.245" x2="183.382" y2="539.663" gradientUnits="userSpaceOnUse">
<stop stop-color="#DA22FF"/>
<stop offset="0.459755" stop-color="#9400FB"/>
<stop offset="0.903699" stop-color="#4E1562"/>
</linearGradient>
<linearGradient id="paint1_linear_171_1781" x1="262.183" y1="115.466" x2="123.088" y2="447.853" gradientUnits="userSpaceOnUse">
<stop stop-color="#DA22FF"/>
<stop offset="0.459755" stop-color="#9400FB"/>
<stop offset="0.903699" stop-color="#4E1562"/>
</linearGradient>
<linearGradient id="paint2_linear_171_1781" x1="356.221" y1="43.9196" x2="419.658" y2="197.496" gradientUnits="userSpaceOnUse">
<stop stop-color="#DA22FF"/>
<stop offset="0.459755" stop-color="#9400FB"/>
<stop offset="0.903699" stop-color="#4E1562"/>
</linearGradient>
</defs>
</svg>

  )
}

export default CosmotrixLogo
