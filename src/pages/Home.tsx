import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, ChevronLeft, Image as ImageIcon, Send, ChevronDown, ChevronUp } from 'lucide-react';

const FadeInText = ({ text, delay = 0, speed = 0.025, boldIndices = [] }: { text: string, delay?: number, speed?: number, boldIndices?: number[] }) => (
  <>
    {text.split('').map((char, index) => (
      <span 
        key={index} 
        className={`opacity-0 animate-[textFadeIn_0.2s_ease-in_forwards] ${boldIndices.includes(index) ? 'font-semibold' : ''}`}
        style={{ animationDelay: `${delay + index * speed}s` }}
      >
        {char}
      </span>
    ))}
  </>
);

const detailsTextA = `**1. 目标复述** 

- **主体锚定语**：以 <图片> 中的 <浅棕色波浪长发、身穿青金花纹挂脖连衣裙的女性> 为 <主体>。 
- **场景与色调沿用策略**：完全沿用原图的浅草寺雷门背景（包含巨大的红底黑字纸灯笼与两侧朱红色大柱）以及白天自然柔和的真实光感。 
- **运镜序列与衔接特性**：总时长 15 秒，包含 2 秒的建立阶段、2 次各 3 秒的“径向模糊拉回再推入”循环运镜，最后进入长达 7 秒的近景终章平稳展示。各段自然衔接，突出纵深冲击感。 

**2. 时间轴脚本** 

- **0 到 2 秒（建立阶段）**：全景空间纵深展示，机位对准胸口，沿中轴线微仰角向前缓慢推入，速度先慢后快。 
- **2 到 5 秒（第一次循环）**：镜头迅速产生径向模糊并向后拉回至中景，速度递减至平稳，随后再次向前推入，展现衣物与环境细节。 
- **5 到 8 秒（第二次循环）**：再次触发径向模糊并迅速拉回，平稳后第三次向前推入，构图逐渐收紧至人物上半身。 
- **8 到 15 秒（终章定帧）**：镜头平缓推进至近景并保持平稳定格，重点展现人物面部轮廓、发丝细节与自然光影，画面缓慢收束。 

**3. 提示词包** 

\`\`\`text 
以<图片>中的<浅棕色波浪长发、身穿青底金色花纹挂脖连衣裙、手持带白色毛球黑色包包的年轻女性>为<主体>。场景完全沿用原图的日本浅草寺雷门环境，背景包含巨大的红底黑字纸灯笼与朱红色大柱，保持白天自然柔和的真实光感。在 0 到 2 秒，画面以全景建立空间纵深，镜头沿中轴线向<主体>胸口以不超过5度的微仰角缓慢推入，推入速度先慢后快；在 2 到 5 秒，镜头迅速带有径向模糊地向后拉回至中景，拉回速度逐渐减慢至平稳，随后再次向<主体>平滑推入；在 5 到 8 秒，镜头第二次迅速带有径向模糊向后拉回，速度递减至停稳后，第三次向<主体>推入，构图逐渐收紧至上半身；在 8 到 15 秒，镜头平稳过渡到<主体>的近景并定格，<主体>保持自然呼吸与轻微的重心调整，清晰展现五官轮廓、发丝细节与衣物材质，画面在柔和光影中缓慢收束。整个过程<主体>特征与穿搭保持高度一致，各段运镜衔接平滑自然。 
\`\`\` 

**4. 质量核对** 

- [x] 时间轴使用整数秒划分（0-2秒、2-5秒、5-8秒、8-15秒）。 
- [x] 未使用任何小数点或百分比数值。 
- [x] 运镜序列严格遵循“推入 → 径向模糊拉回 → 再推入”的结构，且根据 15 秒时长设定为 2 次循环。 
- [x] 已准确使用 <图片> 与 <主体> 尖括号锚点格式。 
- [x] 径向模糊效果仅在向后拉回的时间段内出现。 
- [x] 提示词包全篇使用正向描述，无否定句或限制句。`;

const detailsTextB = detailsTextA; // unused in this scenario

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState(0); // Start at step 0 for a completely blank initial screen
  
  // Track selection state within the single Agent bubble (Step 2)
  const [innerStep, setInnerStep] = useState<'function' | 'style'>('function');
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Track the progressive revelation of long text sections in Step 4
  const [longTextSection, setLongTextSection] = useState(0);
  
  // Track states for the new input interaction
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  
  // Track prompt text typing simulation
  const [displayedPromptText, setDisplayedPromptText] = useState('');
  const [displayedDetailsText, setDisplayedDetailsText] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when step changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Automatically trigger Step 2 (Agent's question) after user sends the message in Step 1
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 600); // 600ms delay to feel natural before AI responds
      return () => clearTimeout(timer);
    }
    
    // Automatically trigger Step 4 (Details typing) after Step 3 is shown
    if (step === 3) {
      const timer = setTimeout(() => {
        setIsDetailsExpanded(true); // Open the details section automatically
        setStep(4);
      }, 800); // Wait 800ms after showing the system notification before showing the detailed response
      return () => clearTimeout(timer);
    }

    // Step 4 Progressive Revelation Logic: Type Details Content
    if (step === 4) {
      const detailsFullText = selectedStyle === 'A' ? detailsTextA : detailsTextB;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= detailsFullText.length) {
          setDisplayedDetailsText(detailsFullText.substring(0, currentIndex));
          currentIndex += 2; // Type 2 chars at a time for speed
          
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        } else {
          clearInterval(typingInterval);
          // Wait after typing completes, then collapse and move to Step 5
          setTimeout(() => {
            setIsDetailsExpanded(false);
            setTimeout(() => {
              setStep(5);
            }, 600); // wait for collapse animation
          }, 1200);
        }
      }, 10); // Very fast typing speed

      return () => clearInterval(typingInterval);
    }

    // Step 5 Progressive Revelation Logic: Type Prompt Text
    if (step === 5) {
      const fullPromptText = '以<图片>中的<浅棕色波浪长发、身穿青底金色花纹挂脖连衣裙、手持带白色毛球黑色包包的年轻女性>为<主体>。场景完全沿用原图的日本浅草寺雷门环境，背景包含巨大的红底黑字纸灯笼与朱红色大柱，保持白天自然柔和的真实光感。在 0 到 2 秒，画面以全景建立空间纵深，镜头沿中轴线向<主体>胸口以不超过5度的微仰角缓慢推入，推入速度先慢后快；在 2 到 5 秒，镜头迅速带有径向模糊地向后拉回至中景，拉回速度逐渐减慢至平稳，随后再次向<主体>平滑推入；在 5 到 8 秒，镜头第二次迅速带有径向模糊向后拉回，速度递减至停稳后，第三次向<主体>推入，构图逐渐收紧至上半身；在 8 到 15 秒，镜头平稳过渡到<主体>的近景并定格，<主体>保持自然呼吸与轻微的重心调整，清晰展现五官轮廓、发丝细节与衣物材质，画面在柔和光影中缓慢收束。整个过程<主体>特征与穿搭保持高度一致，各段运镜衔接平滑自然。';

      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullPromptText.length) {
          setDisplayedPromptText(fullPromptText.substring(0, currentIndex));
          currentIndex += 1;
          
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setStep(6);
          }, 600);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }

    // Automatically trigger Step 7 (Video) after Step 6 is shown
    if (step === 6) {
      const timer = setTimeout(() => {
        setStep(7);
      }, 800); // Wait 800ms before showing the video bubble
      return () => clearTimeout(timer);
    }
  }, [step, innerStep]);

  const handleScreenClick = () => {
    // Only allow screen clicks to advance steps after the initial message has been sent
    // And skip step 1->2 because it's now automated
    if (step >= 7 && step < 13) {
      setStep(prev => prev + 1);
    }
  };

  const handleFunctionClick = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    if (!selectedFunction) {
      setSelectedFunction(optionId);
      if (optionId === 'A') {
        // Automatically switch to the next step after a short delay
        setTimeout(() => {
          setStep(3);
        }, 500);
      }
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset all states to restart the demo to the completely blank screen
    setStep(0);
    setInnerStep('function');
    setSelectedFunction(null);
    setSelectedStyle(null);
    setIsDrawerOpen(false);
    setIsImageSelected(false);
    setIsTyping(false);
    setInputText('');
    setIsDetailsExpanded(false);
    setDisplayedPromptText('');
    setDisplayedDetailsText('');
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (step === 0 && !isImageSelected) {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleImageSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(false);
    setIsImageSelected(true);
    
    // Simulate user typing "我要生成推拉运镜" after selecting image
    setIsTyping(true);
    let text = '';
    const targetText = '我要生成推拉运镜';
    let i = 0;
    
    const typeInterval = setInterval(() => {
      text += targetText[i];
      setInputText(text);
      i++;
      if (i >= targetText.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 150); // Type one character every 150ms
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isImageSelected && inputText === '我要生成推拉运镜') {
      // Send the message
      setInputText('');
      setIsImageSelected(false);
      setStep(1); // Proceed to show user message bubble
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 font-sans">
      {/* iOS Container: 393x852 */}
      <div 
        className="relative bg-[#F6F7F9] overflow-hidden shadow-2xl rounded-[40px] border-[8px] border-black flex flex-col cursor-pointer select-none"
        style={{ width: '393px', height: '852px' }}
        onClick={handleScreenClick}
      >
        {/* Status Bar */}
        <div className="h-[47px] flex items-center justify-between px-6 text-[15px] font-semibold tracking-tighter shrink-0 bg-[#F6F7F9] z-20">
          <span className="text-black">8:00</span>
          <div className="flex items-center space-x-[5px]">
            {/* Signal */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="8" width="3" height="4" rx="1" fill="black"/>
              <rect x="5" y="6" width="3" height="6" rx="1" fill="black"/>
              <rect x="10" y="3" width="3" height="9" rx="1" fill="black"/>
              <rect x="15" width="3" height="12" rx="1" fill="black"/>
            </svg>
            {/* Wi-Fi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 12C9.10457 12 10 11.1046 10 10C10 8.89543 9.10457 8 8 8C6.89543 8 6 8.89543 6 10C6 11.1046 6.89543 12 8 12ZM8 6.5C10.2091 6.5 12 7.84315 12 9.5C12 9.77614 12.2239 10 12.5 10C12.7761 10 13 9.77614 13 9.5C13 7.01472 10.7614 5 8 5C5.23858 5 3 7.01472 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 7.84315 5.79086 6.5 8 6.5ZM8 3.5C11.3137 3.5 14 5.51472 14 8C14 8.27614 14.2239 8.5 14.5 8.5C14.7761 8.5 15 8.27614 15 8C15 4.68629 11.866 2 8 2C4.13401 2 1 4.68629 1 8C1 8.27614 1.22386 8.5 1.5 8.5C1.77614 8.5 2 8.27614 2 8C2 5.51472 4.68629 3.5 8 3.5ZM8 0.5C12.4183 0.5 16 3.41015 16 7C16 7.27614 16.2239 7.5 16.5 7.5C16.7761 7.5 17 7.27614 17 7C17 2.85786 12.9706 -1 8 -1C3.02944 -1 -1 2.85786 -1 7C-1 7.27614 -0.776142 7.5 -0.5 7.5C-0.223858 7.5 0 7.27614 0 7C0 3.41015 3.58172 0.5 8 0.5Z" fill="black"/>
            </svg>
            {/* Battery */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black"/>
              <path d="M23 4V8C24.1046 8 25 7.10457 25 6C25 4.89543 24.1046 4 23 4Z" fill="black"/>
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="black"/>
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 shrink-0 bg-[#F6F7F9] z-20 relative">
          <button 
            className="flex items-center p-2 -ml-2 active:opacity-70 transition-opacity"
            onClick={handleBackClick}
          >
            <img src="/left-button.png" alt="Back" className="w-6 h-6 object-contain" />
          </button>
          <div className="flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
              <img src="/main-title.png" alt="AI 创作" className="h-[18px] object-contain mb-[5px]" />
              <img src="/sub-title.png" alt="Seedance 2.0" className="h-[8px] object-contain" />
            </div>
          <button className="p-2 -mr-2 active:opacity-70 transition-opacity">
            <img src="/right-button.png" alt="Menu" className="w-6 h-6 object-contain" />
          </button>
        </div>

        {/* Chat Content Area */}
        <div 
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto px-4 pb-[110px] pt-4 space-y-5 scrollbar-hide scroll-smooth transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDrawerOpen ? '-translate-y-[155px]' : 'translate-y-0'}`}
        >
          
          {/* User Message 1 */}
          <div className={`flex w-full justify-end transition-all duration-500 ease-out transform ${step >= 1 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[24px] rounded-tr-[8px] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-[75%] flex flex-col items-end">
              <div className="px-3 pt-2 pb-2">
                <p className="text-[16px] text-[#111111] leading-[1.5] tracking-[0.02em]">
                  我要生成推拉运镜
                </p>
              </div>
              <div className="w-full rounded-[18px] overflow-hidden border border-gray-100 mt-1">
                <img 
                  src="/user-image.jpeg" 
                  alt="User uploaded selfie" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Agent Message 1 - Options */}
          <div className={`flex w-full transition-all duration-500 ease-out transform ${step >= 2 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[24px] rounded-tl-[8px] px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] w-[90%]">
              {/* Question Text transitions based on innerStep */}
              <p className={`text-[16px] text-[#111111] leading-[1.5] tracking-[0.02em] mb-3 transition-opacity duration-300 whitespace-nowrap`}>
                {step >= 2 && (
                  <FadeInText key="function" text="好的，是否按图片沿用场景、光感、色调与人物穿搭？" delay={0.3} /> 
                )}
              </p>
              
              {/* Options List */}
              <div 
                className="flex flex-col mt-4 relative overflow-hidden transition-all duration-500 ease-in-out"
                style={{ height: '240px' }}
              >
                <div className={`absolute w-full top-0 left-0 flex flex-col space-y-2 transition-all duration-500 ease-in-out ${
                  step >= 2 
                    ? 'opacity-100 translate-x-0 pointer-events-auto delay-[800ms]' 
                    : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}>
                  {[
                    { id: 'A', text: '完全沿用' },
                    { id: 'B', text: '仅沿用服装' },
                    { id: 'C', text: '仅沿用背景' },
                    { id: 'D', text: '其他（请补充）' },
                  ].map((option) => {
                    const isSelected = selectedFunction === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={(e) => handleFunctionClick(e, option.id)}
                        className={`flex items-center w-full px-4 py-3.5 rounded-[14px] transition-all duration-200 border ${
                          isSelected 
                            ? 'border-[#FF2A5F] bg-[#FF2A5F]/5 shadow-sm' 
                            : 'border-[#E5E5E5] bg-white hover:bg-gray-50/80 active:bg-gray-100'
                        }`}
                      >
                        <span className={`text-[15px] font-medium w-5 text-left transition-colors ${
                          isSelected ? 'text-[#FF2A5F]' : 'text-[#999999]'
                        }`}>
                          {option.id}
                        </span>
                        <span className={`text-[16px] leading-[1.5] tracking-[0.02em] transition-colors ${
                          isSelected ? 'text-[#FF2A5F]' : 'text-[#111111]'
                        }`}>
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* System Notification (Step 3) */}
          <div className={`flex flex-col px-0 transition-all duration-500 ease-out transform delay-150 ${step >= 3 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="flex items-center space-x-[6px] pl-3">
              <img 
                src="/skill-icon-2.png" 
                alt="System Icon" 
                className="w-[20px] h-[20px] object-contain [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges] -ml-[8px]"
              />
              <span className="text-[15px] text-[#8E8E93] font-normal tracking-[0.02em] leading-none -ml-[9px]">
                调用技能：推拉运镜
              </span>
            </div>
            
            {/* 2. Expand/Collapse Toggle (Now under System Notification) */}
            {step >= 4 && (
              <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] pl-3 pr-7 pt-[14px]">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsExpanded(!isDetailsExpanded);
                  }}
                  className="flex items-center space-x-1 text-[15px] text-[#8E8E93] font-normal active:opacity-70 transition-opacity tracking-[0.02em] leading-none"
                >
                  <span className="-ml-[7px]">{isDetailsExpanded ? '收起完整方案结构' : '展开完整方案结构'}</span>
                  {isDetailsExpanded ? <ChevronUp size={15} className="text-[#8E8E93]" strokeWidth={1.5} /> : <ChevronDown size={15} className="text-[#8E8E93]" strokeWidth={1.5} />}
                </button>
              </div>
            )}

            {/* 3. Collapsible Details Section (Now under the toggle) */}
            {step >= 4 && (
              <div className={`overflow-hidden transition-all duration-500 ease-in-out pl-3 pr-7 ${isDetailsExpanded ? 'max-h-[2000px] opacity-100 mt-3 mb-2' : 'max-h-0 opacity-0 mt-0 mb-0'}`}>
                <div className="border-l-[2px] border-[#E5E5E5] pl-4 py-1 text-[13px] text-[#8E8E93] leading-[1.65] text-justify tracking-[0.01em] whitespace-pre-wrap -ml-[7px]">
                  {displayedDetailsText.split('\n').map((line, lineIndex) => {
                    if (line.trim() === '') return <div key={lineIndex} className="h-3"></div>;
                    const isHeader = /^\d）/.test(line);
                    return (
                      <div key={lineIndex} className={isHeader ? "font-bold text-[#70757A] mt-4 mb-1.5 text-[14px] first:mt-0" : "pl-1"}>
                        {line.split('').map((char, charIndex) => (
                          <span 
                            key={charIndex} 
                            className="opacity-0 animate-[textFadeIn_0.2s_ease-in_forwards]"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Agent Detailed Response (Step 5) */}
          <div className={`flex flex-col w-full transition-all duration-500 ease-out transform ${step >= 5 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            
            {/* Main Prompt Bubble */}
            <div className="bg-white rounded-[24px] rounded-tl-[8px] px-6 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] max-w-[92%] border border-gray-100/50">
              <div className="space-y-6 text-[15px] text-[#333333] leading-[1.65] tracking-[0.01em] relative">
                {/* 1. Show the Prompt Package prominently first */}
                <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                  <div className="whitespace-pre-wrap text-[16px] text-[#111111] leading-[1.5] tracking-[0.02em]">
                    {displayedPromptText.split('').map((char, index) => (
                      <span 
                        key={index} 
                        className="opacity-0 animate-[textFadeIn_0.2s_ease-in_forwards]"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Message (Step 6) */}
          <div className={`flex w-full transition-all duration-500 ease-out transform delay-150 ${step >= 6 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[24px] rounded-tl-[8px] px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] max-w-[85%] border border-gray-100/50">
              <p className="text-[16px] text-[#111111] leading-[1.5] tracking-[0.02em]">
                {step >= 6 ? <FadeInText text="我将会用提示词帮你生成一条推拉运镜视频。" delay={0.3} boldIndices={[4, 5, 6, 7]} /> : '我将会用提示词帮你生成一条推拉运镜视频。'}
              </p>
            </div>
          </div>

          {/* Agent Video Message (Step 7) */}
          <div className={`flex w-full transition-all duration-500 ease-out transform delay-300 ${step >= 7 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[24px] rounded-tl-[8px] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-[85%] border border-gray-100/50">
              <div className="w-full rounded-[18px] overflow-hidden bg-black/5 relative aspect-[9/16]">
                <video 
                  src="/zoom-video.mp4"
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </div>

          {/* Hint Overlay (Only visible at step 0 before any interaction) */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 z-50 ${step === 0 && !isDrawerOpen && !isImageSelected ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center bg-black/30 text-white/95 px-6 py-2.5 rounded-full text-[15px] font-medium tracking-wider backdrop-blur-md animate-pulse shadow-md">
              <span>点击下方</span>
              <span className="font-bold text-[18px] leading-none mx-1 relative" style={{ top: '-1px' }}>+</span>
              <span>号开始</span>
            </div>
          </div>

        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 w-full bg-[#F6F7F9] z-20 transition-all duration-300" style={{ transform: isDrawerOpen ? 'translateY(-155px)' : 'translateY(0)' }}>
          
          {/* Selected Image Preview above input */}
          <div className={`px-4 pt-2 pb-1 transition-all duration-300 ${isImageSelected ? 'opacity-100 h-[80px]' : 'opacity-0 h-0 overflow-hidden'}`}>
             <div className="h-full w-[60px] relative rounded-[12px] overflow-hidden border border-gray-200/50 shadow-sm bg-white p-1">
               <div className="w-full h-full rounded-[8px] overflow-hidden">
                 <img src="/user-image.jpeg" alt="Selected" className="w-full h-full object-cover" />
               </div>
               <button 
                 className="absolute -top-1 -right-1 bg-gray-200/80 text-gray-600 rounded-full p-0.5 active:bg-gray-300"
                 onClick={(e) => {
                   e.stopPropagation();
                   setIsImageSelected(false);
                   setInputText('');
                 }}
               >
                 <X size={12} strokeWidth={2} />
               </button>
             </div>
          </div>

          <div className={`pb-[34px] px-4 ${isImageSelected ? 'pt-1' : 'pt-3'}`}>
            <div className="flex items-center bg-white rounded-[24px] min-h-[54px] pl-5 pr-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 transition-all duration-300">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                readOnly={isTyping || (step > 0 && step < 13)}
                placeholder={isTyping ? "" : "输入你的创作想法"}
                className="flex-1 bg-transparent text-[16px] py-3 text-[#111111] focus:outline-none placeholder-[#A3A3A3] tracking-wide"
              />
              <div className="flex items-center space-x-2.5 ml-2">
                {!inputText && !isImageSelected && (
                  <button className="w-[36px] h-[36px] flex items-center justify-center active:scale-95 transition-transform shrink-0">
                    <img src="/voice-icon.png" alt="Voice" className="w-[32px] h-[32px] object-contain ml-[6px]" />
                  </button>
                )}
                
                {inputText || isImageSelected ? (
                  <button className={`w-[36px] h-[36px] flex items-center justify-center transition-all shrink-0 active:scale-95 ${
                      inputText === '我要生成推拉运镜' && isImageSelected && !isTyping
                        ? '' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={handleSendClick}
                  >
                    <img src="/send-icon.png" alt="Send" className="w-[36px] h-[36px] object-contain" />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlusClick}
                    className={`w-[36px] h-[36px] flex items-center justify-center transition-transform shrink-0 active:scale-95 ${isDrawerOpen ? 'rotate-45' : ''}`}
                  >
                    <img src="/plus-icon.png" alt="Plus" className="w-[32px] h-[32px] object-contain mr-[3px]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Drawer Component */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-40 ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="p-4 pt-3 pb-8">
            <div className="flex justify-start items-center mb-3 mt-1">
              <h2 className="text-[13px] font-normal text-[#8E8E93]">选择素材图片</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mt-[12px]">
              {/* The target image */}
              <div 
                onClick={handleImageSelect}
                className="aspect-square rounded-[16px] overflow-hidden cursor-pointer relative group border border-gray-100 shadow-sm"
              >
                <img src="/user-image.jpeg" alt="Gallery item" className="w-full h-full object-cover transition-transform group-active:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute bottom-1 right-1 bg-black/40 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={12} color="white" />
                </div>
              </div>
              
              {/* Dummy gallery items */}
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-[16px] bg-gray-100 overflow-hidden border border-gray-50" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-[#111111] rounded-full z-30" />
      </div>
    </div>
  );
}
