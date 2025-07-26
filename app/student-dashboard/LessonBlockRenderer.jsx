'use client';

import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { gsap } from 'gsap';

// Text block renderer
const TextBlock = ({ content }) => {
  const customComponents = {
    h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-white mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-blue-200 mb-3" {...props} />,
    p: ({node, ...props}) => <p className="text-base text-blue-100 mb-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside text-blue-100 mb-2" {...props} />,
    li: ({node, ...props}) => <li className="ml-4" {...props} />,
  };
  return (
    <div className="max-w-4xl mx-auto p-4 my-2">
      <ReactMarkdown components={customComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Visual block renderer (static diagrams)
const VisualBlock = ({ content }) => (
  <div className="max-w-4xl mx-auto p-4 my-2">
    <div className="w-full h-auto bg-gray-100 rounded-md flex items-center justify-center" dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

// Commented out unused block types
// const ImageBlock = ({ src }) => (
//   <div className="max-w-4xl mx-auto p-4 my-2">
//     <img src={src} alt="Lesson Image" className="w-full h-auto rounded-md" />
//   </div>
// );

const AnimationBlock = ({ content }) => {
  const containerRef = useRef(null);
  const contextRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !content?.svg || !content?.animation_config) {
      return;
    }

    contextRef.current = gsap.context(() => {
      containerRef.current.innerHTML = content.svg;
      
      // Create timeline with defaults if they exist
      let timelineOptions = {};
      if (content.animation_config.defaults) {
        const defaults = content.animation_config.defaults;
        if (defaults.duration !== null && defaults.duration !== undefined) {
          timelineOptions.duration = defaults.duration;
        }
        if (defaults.ease) {
          timelineOptions.ease = defaults.ease;
        }
      }
      
      const tl = gsap.timeline(timelineOptions);
      
      // Apply timeline-level repeat and yoyo if they exist
      if (content.animation_config.repeat !== null && content.animation_config.repeat !== undefined) {
        tl.repeat(content.animation_config.repeat);
      }
      if (content.animation_config.yoyo !== null && content.animation_config.yoyo !== undefined) {
        tl.yoyo(content.animation_config.yoyo);
      }
      
      // Process each timeline step
      content.animation_config.timeline.forEach(step => {
        const { method, target, from_params, to_params, position } = step;
        
        // Convert to_params to GSAP format, filtering out null values
        const gsapParams = {};
        if (to_params) {
          Object.entries(to_params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              gsapParams[key] = value;
            }
          });
        }
        
        // Handle attr parameter specially
        if (gsapParams.attr && typeof gsapParams.attr === 'object') {
          // Filter out null values from attr object
          const filteredAttr = {};
          Object.entries(gsapParams.attr).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              filteredAttr[key] = value;
            }
          });
          gsapParams.attr = filteredAttr;
        }
        
        // Apply the tween based on method
        switch (method) {
          case 'to':
            tl.to(target, gsapParams, position);
            break;
          case 'from':
            tl.from(target, gsapParams, position);
            break;
          case 'fromTo':
            const fromGsapParams = {};
            if (from_params) {
              Object.entries(from_params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  fromGsapParams[key] = value;
                }
              });
            }
            tl.fromTo(target, fromGsapParams, gsapParams, position);
            break;
          case 'set':
            tl.set(target, gsapParams, position);
            break;
          default:
            console.warn(`Unknown GSAP method: ${method}`);
            tl.to(target, gsapParams, position);
        }
      });
      
      timelineRef.current = tl;
    }, containerRef);

    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [content]);

  const handleReload = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  return (
    <div className="flex flex-col justify-between max-w-4xl mx-auto p-4 my-2 min-h-[600px] bg-white">
      <div
        ref={containerRef}
        className="w-full rounded-md flex items-center justify-center"
      />
      <div className="flex justify-end mt-2 relative z-10">
        <button
          onClick={handleReload}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
        >
          Reload Animation 🔄
        </button>
      </div>
    </div>
  );
};

// Main renderer
export default function LessonBlockRenderer({ blocks }) {
  if (!blocks) return null;
  return (
    <div>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type.toLowerCase()) {
          case 'textblock':
          case 'text':
            return <TextBlock key={key} content={block.content} />;
          case 'visualblock':
          case 'visual':
            return <VisualBlock key={key} content={block.content} />;
          case 'animationblock':
          case 'animation':
            return <AnimationBlock key={key} content={block.content} />;
          // Commented out unused block types
          // case 'imageblock':
          // case 'image':
          //   return <ImageBlock key={key} src={block.content} />;
          // case 'diagramblock':
          // case 'diagram':
          //   return <DiagramBlock key={key} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
