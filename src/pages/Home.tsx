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

const detailsTextA = `1）目标复述
• 你要：15s MV 变装转场，风格更甜美；主体用你上传的人物图做一致性锚点；默认 16:9 横屏。
• 节奏：1-3s 建立前状态，3-8s 完成主变装，变装后第一个有效镜头先给脸，再展开后造型与背景；后背景空间类型与原图明显不同。

2）三点校准（默认直接定）
• 主体画像：甜美清透、轻熟但克制
• 子风格：A 甜野少女
• 触发信号：发丝近景遮挡 + 开衫衣角掠镜遮挡 + 窗边冷白闪光一次

3）方案概述
用“低完成度日常前状态”做反差，后状态走甜野少女的轻甜高级感；后场景从原图日常墙面切换到“复古公寓窗边梳妆台”类型空间，形成强差异；收尾用冷蓝灰电影质感压住廉价甜。

4）分镜脚本（4 镜）
• 镜头1（1-3s）：中近景，前状态素净、低完成度，动作轻
• 镜头2（3-5s）：推镜到脸，发丝遮挡，衣角掠镜
• 镜头3（5-9s）：旋转擦拭完成变装，后状态开场先给脸（近景）
• 镜头4（9-15s）：中景稳定展示 + 微跟进定帧，收尾做冷雾颗粒质感

5）输入增强（可复制复用）
用我上传的人物图做主体一致性锚点，做 15s K-pop MV 变装转场，16:9 横屏；子风格 A 甜野少女；前 1-3 秒前状态面部低完成度、低光影强调；3-8 秒完成主变装；转场固定推镜变焦 + 旋转擦拭，触发用发丝近景遮挡 + 开衫衣角掠镜遮挡 + 窗边冷白闪光一次；变装后第一个有效镜头先给面部，再展开肩颈线条、身形比例与完整后造型；后背景空间类型与原图明显不同；收尾用低饱和冷蓝灰电影质感、颗粒与轻微曝光漂移。

6）迭代策略（你只要选一项）
• 甜得更梦幻：我把后场景改成“雾感花房玻璃廊”，其余节奏不变
• 甜得更高级：我把后造型改成“短外套 + 窄裙更利落”，保留甜野关键词不跑偏`;

const detailsTextB = `1）目标复述
• 保留这张图的人物五官、暖棕长发和原始气质。
• 不继承当前豹纹内搭与米白墙室内背景。
• 做一版更符合你本人的变装：轻熟、利落、带一点小野感，整体高级但不夸张。

2）三点校准
• 主体画像：暖棕长发、轻熟、随性、带一点攻击性的时髦感。
• 后造型子风格：默认 B 街头混搭；它最能放大你原图里本来就有的自然时髦度和小性感。
• 触发信号：默认抬手带起外套边缘遮挡；比单纯甩发更稳，也更有穿搭完成度。

3）方案概述
• 前状态压成普通室内、低修饰度、低完成度。
• 后状态切进开阔室外旧街区结构空间，让人物、造型和背景一起完成升级。
• 节奏上前 2-3 秒触发，8 秒前完成主要变装；变装后的第一个有效镜头先落在人物面部，再展开后造型和背景。

4）分镜脚本
• 镜头1：半身近景，人物穿基础灰色上衣与普通日常下装，停留在简单室内墙边。面部低修饰度，神态接近日常未整理完成状态。
• 镜头2：镜头快速推近到肩颈与发丝，主体抬手转身，外套边缘或衣摆掠过镜头形成遮挡。遮挡一出现就触发变装，不拖节奏。
• 镜头3：变装完成后的第一个有效镜头先给面部：近景落脸，先建立脸部吸引力、发型轮廓和后状态光影。然后顺势展开到后造型：短款修身上衣、利落短夹克、宽松做旧牛仔裤、厚底运动鞋。背景切到有建筑切面、水泥地和旧墙透视的室外街区空间。
• 镜头4：中景稳定展示，镜头从面部附近轻轻拉开到中景。展示肩颈线条、腰胯比例、牛仔裤垂坠、外套轮廓和整体气场。结尾再做冷调颗粒和定帧质感收束。

5）输入增强
我要变装。保留原图脸部和暖棕长发特征，不继承原图服装和室内背景；前状态保持低修饰度、低光影强调、普通日常感；后造型走 B 街头混搭，偏轻熟、小野、不过分张扬，穿短款修身上衣、利落短夹克和宽松做旧牛仔裤；用推镜变焦 + 旋转擦拭，通过外套边缘掠镜触发；后背景切到有建筑切面、水泥地和旧墙透视的开阔街区空间；要求变装后的第一个有效镜头先以面部为中心，再展开到后造型与背景。`;

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
      const fullPromptText = selectedStyle === 'A' 
        ? '一个剪辑成转场运镜变装的视频，不要生成字幕和背景音乐，仅带有音效；\n画面比例为 16:9 横屏；\n参考 <人物图1> 中的人物作为主体（保持五官与脸部一致性、发型一致性、气质一致性）；\n（1-3s，中近景）变装前：\n前造型：浅灰细肩带基础内搭，外搭米白薄款针织开衫，下装为深色直筒长裤，整体日常克制；\n动作：人物轻轻整理开衫领口，抬眼看向镜头，微微侧头；\n场景与氛围光感：与原图同类的日常室内空间，干净墙面，柔和自然光但对比度偏低，真实可拍摄；\n前状态面部表现：低修饰度、妆面存在感减弱、立体光影减弱、气色收敛、肤质更日常；\n子风格关键词：甜野少女、清透轻甜、真实生活感的精致整理、柔光快照质感；\n（3-12s，无缝过渡转场变装，慢动作特写，强化节奏变化）：\n转场机制：推镜变焦 + 旋转擦拭；\n触发信号：镜头快速推近到面部，发丝贴近镜头形成第一次遮挡，开衫衣角掠过镜头形成第二次遮挡，窗边出现一次冷白闪光作为节拍点；\n节奏变化：推镜明显加速，遮挡切换干脆，闪光瞬间完成形变；\n变装后的第一个有效镜头先以面部为中心：近景先建立后状态面部完成度（肤质更干净、五官光影更清晰、眼神更甜但更有主导感），发型轮廓更顺滑并带柔和高光边缘；随后镜头带出肩颈线条更清楚、身形比例更利落；\n后造型：短款合身针织上衣，百褶短裙，小珍珠项链，小体量硬挺包袋，发侧蝴蝶结发饰形成小面积高光点，轮廓清晰不松垮；\n背景无缝切换为后场景：复古公寓窗边梳妆台区域，旧木桌面与镜框、少量旧相框与桌面小摆件，空间类型与原图背景明显不同；\n光线氛围：窗边柔光与冷白边缘高光并存，低饱和冷蓝灰作为底色，亮部干净、暗部有结构；\n（13-15s，中景到近景）收尾：\n后造型稳定展示：人物轻轻抬手拨发，停住对镜微笑，镜头保持人物面部为主要视觉焦点；\n镜头：轻微跟进后定住，形成 MV 预告片快照式定帧；\n收尾色调与质感：低饱和冷蓝灰色阶，轻微曝光漂移，胶片颗粒与细密数码噪点叠加，高光边缘冷白干净，反差克制但质感高级。'
        : '一个剪辑成转场运镜变装的视频，不要生成字幕和背景音乐，仅带有音效；\n画面比例为 16:9 横屏；\n参考 <图1> 中的女人作为主体，保持五官、脸型、暖棕色长发与整体气质一致；\n（1-2s，半身近景）变装前：主体处在普通室内环境，背景是简单米白墙面与日常室内光线，穿基础灰色上衣与普通日常下装；前状态面部表现为低修饰度、妆面存在感弱、立体光影弱、神态更接近日常未修饰状态，整体普通、克制、生活化；\n镜头快速轻推近，在主体抬手准备转身的瞬间，衣角被动作带起，同时，\n（2-8s，无缝过渡转场变装，慢动作特写，特效）\n主体在抬手转身的动作轨迹中瞬间完成变装，变装后的第一个有效镜头先以面部为中心：后状态脸部更干净，眼部轮廓更清楚，暖棕长发边缘被冷白光勾出清晰发丝线条，肩颈线条被抬亮；\n随即镜头从面部近景自然展开到上半身，已完全换上轻熟街头时装：黑色短款修身上衣，外搭利落短夹克，下身是宽松做旧牛仔裤，脚穿厚底运动鞋；服装轮廓清楚，夹克边缘、牛仔褶皱与金属扣件出现短暂反光；\n转场为：推镜变焦 + 旋转擦拭，触发信号为外套边缘掠过镜头形成遮挡；\n背景无缝切换为开阔的室外旧街区结构空间：建筑立面切角、水泥地、木板边缘、远处旧墙面与街区透视完整出现，明显区别于原图的单一室内墙面；冷调漫射光打在发丝、夹克轮廓和牛仔褶皱上，地面灰尘被动作轻轻带起；\n（8-15s，中景）收尾：主体站定后轻微换重心，一只手自然落在裤袋附近，镜头从面部附近缓慢拉开到中景，保持后造型稳定展示；\n脸部状态、发型轮廓、肩颈线条、腰胯比例、牛仔裤垂坠和鞋底厚度全部可见；结尾重点强化色调与质感：低饱和冷蓝灰色阶、轻微曝光漂移、胶片颗粒与数码噪点并存，暗部压低但保留结构，发丝边缘与鼻梁、锁骨位置出现冷白高光反射，整体呈现韩系 MV 预告片式的高级定帧感。';

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
    if (innerStep === 'function' && !selectedFunction) {
      setSelectedFunction(optionId);
      if (optionId === 'B') {
        // Automatically switch to style question after a short delay
        setTimeout(() => {
          setInnerStep('style');
        }, 500);
      }
    }
  };

  const handleStyleClick = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation(); // Prevent screen click
    if (innerStep === 'style' && !selectedStyle) {
      setSelectedStyle(optionId);
      if (optionId === 'A' || optionId === 'B') {
        // Automatically proceed to the next step after a short delay
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
    
    // Simulate user typing "我要变装" after selecting image
    setIsTyping(true);
    let text = '';
    const targetText = '我要变装';
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
    if (isImageSelected && inputText === '我要变装') {
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
                  我要变装
                </p>
              </div>
              <div className="w-full rounded-[18px] overflow-hidden border border-gray-100 mt-1">
                <img 
                  src="/vv3.jpg" 
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
                  innerStep === 'function' 
                    ? <FadeInText key="function" text="你需要使用什么功能？" delay={0.3} /> 
                    : <FadeInText key="style" text="好的，你需要什么样的变装效果？" delay={0.1} />
                )}
              </p>
              
              {/* Options List */}
              <div 
                className="flex flex-col mt-4 relative overflow-hidden transition-all duration-500 ease-in-out"
                style={{ height: innerStep === 'function' ? '128px' : '240px' }}
              >
                {/* Function Options (A. Image / B. Video) */}
                <div className={`absolute w-full top-0 left-0 flex flex-col space-y-2 transition-all duration-500 ease-in-out ${
                  innerStep === 'function' 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}>
                  {[
                    { id: 'A', text: '生成图片' },
                    { id: 'B', text: '生成视频' },
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

                {/* Style Options (A/B/C/D) */}
                <div className={`absolute w-full top-0 left-0 flex flex-col space-y-2 transition-all duration-500 ease-in-out ${
                  innerStep === 'style' 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : 'opacity-0 translate-x-4 pointer-events-none'
                }`}>
                  {[
                    { id: 'A', text: '甜美风格的变装' },
                    { id: 'B', text: '潮流风格的变装' },
                    { id: 'C', text: '复古风格的变装' },
                    { id: 'D', text: 'Y2K风格的变装' },
                  ].map((option) => {
                    const isSelected = selectedStyle === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={(e) => handleStyleClick(e, option.id)}
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
          <div className={`flex flex-col px-0 pt-[16px] pb-1 transition-all duration-500 ease-out transform delay-150 ${step >= 3 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="flex items-center space-x-[6px] pl-3">
              <img 
                src="/skill-icon-2.png" 
                alt="System Icon" 
                className="w-[20px] h-[20px] object-contain [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges] -ml-[8px]"
              />
              <span className="text-[15px] text-[#8E8E93] font-normal tracking-[0.02em] leading-none -ml-[9px]">
                调用技能：kpop-mv-outfit-transition
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
                <div className="border-l-[2px] border-[#E5E5E5] pl-4 py-1 text-[13px] text-[#8E8E93] leading-[1.65] text-justify tracking-[0.01em] whitespace-pre-wrap">
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
            <div className="bg-white rounded-[24px] rounded-tl-[8px] px-6 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] max-w-[92%] border border-gray-100/50 mb-2">
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
                {step >= 6 ? <FadeInText text="我将会用提示词帮你生成一条变装视频。" delay={0.3} boldIndices={[4, 5, 6]} /> : '我将会用提示词帮你生成一条变装视频。'}
              </p>
            </div>
          </div>

          {/* Agent Video Message (Step 7) */}
          <div className={`flex w-full transition-all duration-500 ease-out transform delay-300 ${step >= 7 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[24px] rounded-tl-[8px] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-[85%] border border-gray-100/50">
              <div className="w-full rounded-[18px] overflow-hidden bg-black/5 relative aspect-video">
                <video 
                  src={selectedStyle === 'A' ? "/outfit-transition-a.mp4" : "/outfit-transition.mp4"}
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
                 <img src="/vv3.jpg" alt="Selected" className="w-full h-full object-cover" />
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
                      inputText === '我要变装' && isImageSelected && !isTyping
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
                <img src="/vv3.jpg" alt="Gallery item" className="w-full h-full object-cover transition-transform group-active:scale-105" />
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
