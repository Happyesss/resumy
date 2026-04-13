import { cn } from "@/lib/utils";
import { CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import { ImageGallery } from "./image-gallery";



interface SplitContentProps {
  imageSrc: string;
  heading: string;
  description: string;
  imageOnLeft?: boolean;
  imageOverflowRight?: boolean;
  className?: string;
  children?: React.ReactNode;
  bulletPoints?: string[];
  badgeText?: string;
  badgeGradient?: string;
  galleryImages?: {
    src: string;
    alt: string;
    title: string;
  }[];
  onImageSelect?: (imageSrc: string) => void;
  selectedImage?: string;
}

export function SplitContent({
  imageSrc,
  heading,
  description,
  imageOnLeft = true,
  imageOverflowRight = false,
  className,
  children,
  bulletPoints,
  badgeText,
  badgeGradient = "from-purple-600/10 to-indigo-600/10",
  galleryImages,
  onImageSelect,
  selectedImage,
}: SplitContentProps) {
  const isLocalImage = imageSrc.startsWith("/");
  
  // Function to get unique styling for each heading (no icon)
  const getHeadingStyle = (heading: string) => {
    switch (heading) {
      case "AI-Powered Resume Assistant":
        return {
          textClass: "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent",
          underlineClass: "h-0.5 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        };
      case "Analyze Your Resume":
        return {
          textClass: "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent",
          underlineClass: "h-0.5 w-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
        };
      case "Professional Resume Templates":
        return {
          textClass: "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent",
          underlineClass: "h-0.5 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
        };
      case "AI Cover Letter Generator":
        return {
          textClass: "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent",
          underlineClass: "h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
        };
      default:
        return {
          textClass: "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent",
          underlineClass: "h-0.5 w-16 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
        };
    }
  };

  const headingStyle = getHeadingStyle(heading);
  return (
   
    <div className={cn(
      "relative w-full overflow-hidden",
      className
    )}>
      <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={cn(
          "grid gap-12 lg:gap-8 items-center",
          "lg:grid-cols-5"
        )}>
          {/* Content Section - Enhanced Typography and Layout */}
          {imageOverflowRight && (
            <div className={cn(
              "relative flex flex-col gap-8 lg:col-span-2",
              "lg:pl-16 text-right",
              "order-first lg:order-none"
            )}>
              {/* Badge if provided */}
              {badgeText && (
                <div className={`inline-block self-end px-4 py-1 rounded-full bg-gradient-to-r ${badgeGradient} border-purple-400/40 text-purple-300 text-sm font-medium mb-1`}>
                  <div className="flex items-center">
                    <span className="mr-2">{badgeText}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              )}
              
              {/* Enhanced heading with gradient underline */}
              <div className="space-y-3 inline-flex flex-col items-end w-full">
                <div>
                  <h2 className={headingStyle.textClass}>
                    {heading}
                  </h2>
                </div>
                <div className={headingStyle.underlineClass} />
              </div>
              
              {/* Enhanced description */}
              <p className="text-xl text-gray-300 leading-relaxed font-medium">
                {description}
              </p>

              {/* Bullet points if provided */}
              {bulletPoints && bulletPoints.length > 0 && (
                <div className="space-y-2 flex flex-col items-end">
                  {bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 flex-row-reverse">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-right text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional children for interactive elements */}
              {children && (
                <div className="mt-4">
                  {children}
                </div>
              )}
            </div>
          )}

          
          {/* Image Section - Enhanced for Screenshots */}
          <div className={cn(
            "relative group lg:col-span-3",
            (!imageOverflowRight ? "w-full" : "w-[140%]"),
            "aspect-[16/10]",
            "order-last lg:order-none"
          )}>
            {/* Enhanced image container with deeper glass effect */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.25)]">
              {/* Main image */}
            
              <div className="relative h-full w-full p-2">
               
                <Image
                  src={imageSrc}
                  alt={heading}
                  fill
                  unoptimized={isLocalImage}
                  className={cn(
                    "rounded-xl transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-110",
                    imageOverflowRight ? "object-cover" : "object-contain"
                  )}
                  sizes="(min-width: 1440px) 50vw, (min-width: 1024px) 60vw, (min-width: 768px) 80vw, 100vw"
                  quality={100}
                  priority
                  loading="eager"
                  style={{
                    objectFit: imageOverflowRight ? 'cover' : 'contain',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                />
                
                {/* Subtle border glow effect */}
                <div className="absolute inset-2 rounded-xl border border-violet-400/0 group-hover:border-violet-400/30 transition-all duration-700" />
              </div>

            </div>

            {/* Image Gallery if provided - positioned below the image */}
            {galleryImages && galleryImages.length > 0 && onImageSelect && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400 font-medium text-center">Click to preview:</p>
                <ImageGallery
                  images={galleryImages}
                  onImageSelect={onImageSelect}
                  selectedImage={selectedImage}
                  className="justify-center"
                />
              </div>
            )}

          </div>

          {/* Content Section - Enhanced Typography and Layout */}
          {!imageOverflowRight && (
            <div className={cn(
              "relative flex flex-col gap-8 lg:col-span-2",
              imageOnLeft ? "lg:pl-16" : "lg:pr-16",
              "order-first lg:order-none"
            )}>
              {/* Badge if provided */}
              {badgeText && (
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${badgeGradient} border-purple-400/40 text-purple-300 text-sm font-medium mb-1`}>
                  <div className="flex items-center">
                    <span className="mr-2">{badgeText}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              )}
              
              {/* Enhanced heading with gradient underline */}
              <div className="space-y-3">
                <div>
                  <h2 className={headingStyle.textClass}>
                    {heading}
                  </h2>
                </div>
                <div className={headingStyle.underlineClass} />
              </div>
              
              {/* Enhanced description */}
              <p className="text-xl text-gray-300 leading-relaxed font-medium">
                {description}
              </p>

              {/* Bullet points if provided */}
              {bulletPoints && bulletPoints.length > 0 && (
                <div className="space-y-2">
                  {bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional children for interactive elements */}
              {children && (
                <div className="mt-4">
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
 
  );
} 