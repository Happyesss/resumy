import { NextGenOptimization } from "./NextGenOptimization";
import { AIEngineOptimization } from "./AIEngineOptimization";  
import { VoiceSearchOptimization } from "./VoiceSearchOptimization";

/**
 * Comprehensive Next-Generation SEO/AIO Wrapper
 * Combines GEO, SXO, AEO, and AIO optimizations
 * Works behind the scenes without affecting UI/UX
 */

export function NextGenSEOSuite() {
  return (
    <>
      {/* Core Next-Gen Optimizations */}
      <NextGenOptimization />
      
      {/* AI Engine Specific Optimizations */}
      <AIEngineOptimization />
      
      {/* Voice Search & Conversational AI */}
      <VoiceSearchOptimization />
      
      {/* Additional Advanced Meta Tags for Future AI */}
      <meta name="ai-generation" content="next-gen-optimized" />
      <meta name="optimization-suite" content="geo-sxo-aeo-aio" />
      <meta name="ai-readiness-score" content="100" />
      <meta name="future-ai-compatible" content="true" />
      
      {/* Multimodal AI Optimization */}
      <meta name="multimodal-content" content="text, images, structured-data" />
      <meta name="accessibility-ai" content="screen-reader-optimized, voice-navigation-ready" />
      
      {/* Cross-Platform AI Compatibility */}
      <meta name="ai-platform-support" content="openai, anthropic, google, microsoft, meta" />
      <meta name="llm-optimization-level" content="advanced" />
    </>
  );
}