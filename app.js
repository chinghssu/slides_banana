// Banana Pro 簡報生成器 - 主程式
// 使用 Gemini 3 Pro Image API 生成簡報圖片

let generatedImages = [];
let currentSlideData = [];
let isGenerating = false;
let shouldStop = false;
let referenceImageData = []; // 改為陣列以支援多張圖片

// 簡報尺寸配置
const PRESENTATION_SIZES = {
    '16:9': {
        name: '16:9 標準簡報',
        width: 297,
        height: 167,
        orientation: 'landscape',
        aspectRatio: '16:9',
        description: '1920x1080 像素，適合大多數投影機和螢幕'
    },
    '4:3': {
        name: '4:3 傳統簡報',
        width: 297,
        height: 223,
        orientation: 'landscape',
        aspectRatio: '4:3',
        description: '1024x768 像素，適合舊型投影機'
    },
    'A4-landscape': {
        name: 'A4 橫向',
        width: 297,
        height: 210,
        orientation: 'landscape',
        aspectRatio: 'A4 landscape',
        description: 'A4 紙張橫向格式'
    },
    'A4-portrait': {
        name: 'A4 直向',
        width: 210,
        height: 297,
        orientation: 'portrait',
        aspectRatio: 'A4 portrait',
        description: 'A4 紙張直向格式'
    },
    'square': {
        name: '正方形',
        width: 210,
        height: 210,
        orientation: 'portrait',
        aspectRatio: '1:1',
        description: '1080x1080 像素，適合社群媒體貼文'
    },
    'instagram-story': {
        name: 'Instagram 限時動態',
        width: 210,
        height: 373,
        orientation: 'portrait',
        aspectRatio: '9:16',
        description: '1080x1920 像素，適合手機直向瀏覽'
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 投影片數量滑桿
    const slideCount = document.getElementById('slideCount');
    const slideCountDisplay = document.getElementById('slideCountDisplay');
    slideCount.addEventListener('input', (e) => {
        slideCountDisplay.textContent = e.target.value;
    });
    
    // 載入預設範例
    loadStyleExample();
});

// 處理圖片上傳（支援多張）
function handleImageUpload(input) {
    const files = input.files;
    if (!files || files.length === 0) return;

    // 檢查圖片數量限制
    if (files.length > 5) {
        showMessage('最多只能上傳 5 張圖片', 'error');
        input.value = '';
        return;
    }

    // 清空之前的圖片
    referenceImageData = [];
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    let loadedCount = 0;
    const totalFiles = files.length;

    // 處理每一張圖片
    Array.from(files).forEach((file, index) => {
        // 檢查檔案類型
        if (!file.type.startsWith('image/')) {
            showMessage(`檔案 ${file.name} 不是圖片格式`, 'error');
            return;
        }

        // 檢查檔案大小 (限制 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage(`圖片 ${file.name} 大小超過 5MB`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // 儲存 base64 圖片資料
            referenceImageData.push({
                data: e.target.result,
                name: file.name
            });

            // 建立預覽元素
            const previewItem = document.createElement('div');
            previewItem.className = 'relative inline-block mr-2 mb-2';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}"
                     class="h-24 w-auto rounded-lg border border-slate-200 object-cover">
                <button onclick="removeImage(${index})"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                    ✕
                </button>
                <p class="text-xs text-slate-500 text-center mt-1 max-w-[100px] truncate">${file.name}</p>
            `;
            preview.appendChild(previewItem);

            loadedCount++;
            if (loadedCount === totalFiles) {
                preview.classList.remove('hidden');
                updateClearButtonVisibility();
                showMessage(`已上傳 ${totalFiles} 張圖片，這些產品將出現在簡報中`, 'success');
            }
        };
        reader.readAsDataURL(file);
    });
}

// 移除單張圖片
function removeImage(index) {
    referenceImageData.splice(index, 1);

    // 重新渲染預覽
    const preview = document.getElementById('imagePreview');
    const input = document.getElementById('referenceImage');

    if (referenceImageData.length === 0) {
        preview.classList.add('hidden');
        preview.innerHTML = '';
        input.value = '';
        updateClearButtonVisibility();
        showMessage('已移除所有圖片', 'info');
    } else {
        // 重新生成預覽
        preview.innerHTML = '';
        referenceImageData.forEach((img, idx) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'relative inline-block mr-2 mb-2';
            previewItem.innerHTML = `
                <img src="${img.data}" alt="${img.name}"
                     class="h-24 w-auto rounded-lg border border-slate-200 object-cover">
                <button onclick="removeImage(${idx})"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                    ✕
                </button>
                <p class="text-xs text-slate-500 text-center mt-1 max-w-[100px] truncate">${img.name}</p>
            `;
            preview.appendChild(previewItem);
        });
        updateClearButtonVisibility();
        showMessage(`已移除圖片，剩餘 ${referenceImageData.length} 張`, 'info');
    }
}

// 清除所有參考圖片
function clearReferenceImage() {
    referenceImageData = [];
    document.getElementById('referenceImage').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('imagePreview').innerHTML = '';
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) clearBtn.classList.add('hidden');
    showMessage('已移除所有圖片', 'info');
}

// 更新清除按鈕的顯示狀態
function updateClearButtonVisibility() {
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
        if (referenceImageData.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }
}

// 載入風格範例
function loadStyleExample() {
    const exampleStyle = `Tone: "Modern, innovative, tech-forward, trustworthy"
Color_Palette:
  Base: "#FFFFFF (pure white)"
  Primary: "#6366F1 (vibrant indigo)"
  Secondary: "#EC4899 (energetic pink)"
  Text_Color: "#1F2937 (deep gray)"
  Accent: "#10B981 (emerald green)"
Typography:
  Heading: "Bold sans-serif (Inter, SF Pro)"
  Body_Text: "Clean sans-serif, readable size"
Layout_Rules:
  Grid: "Asymmetric with dynamic layouts"
  Whitespace: "Embrace negative space"
  Visual_Style: "Modern gradients, glassmorphism, 3D isometric"`;

    document.getElementById('styleGuide').value = exampleStyle;
}

// 載入版面範例
function loadLayoutExample() {
    const exampleLayout = `第1頁:開場封面
視覺佈局:
- 中央: TechVision 公司 Logo（大型、清晰）
- 副標題: "創新科技 · 智慧未來"
- 背景: 漸層背景（深藍到紫紅）
- 點綴: 抽象幾何圖形飄浮
- 氛圍: 現代、科技感、充滿活力

第2頁:公司願景
視覺佈局:
- 左側: 大標題 + 願景要點
- 右側: 3D 等距插圖（團隊合作場景）
- 背景: 白色底搭配淡漸層

第3頁:產品展示
視覺佈局:
- 中央: 產品介面截圖（glassmorphism 效果）
- 左側: 產品名稱 + 核心功能
- 背景: 漸層網格圖案`;
    
    document.getElementById('layoutTemplate').value = exampleLayout;
    setPresentationTopic('TechVision 科技公司品牌簡報');
}

function setPresentationTopic(topic) {
    document.getElementById('topic').value = topic;
}

// 顯示訊息
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    const colors = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    
    const icons = {
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>'
    };
    
    messageArea.innerHTML = `
        <div class="${colors[type]} border rounded-xl p-4 flex items-start gap-3">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icons[type]}
            </svg>
            <p class="text-sm">${message}</p>
        </div>
    `;
}

// 更新進度
function updateProgress(current, total, message) {
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressSection.classList.remove('hidden');
    
    const percent = Math.round((current / total) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = message || `正在生成第 ${current} / ${total} 張投影片`;
}

// 呼叫 Gemini API 生成圖片
async function callGeminiAPI(prompt, apiKey, seed = null, referenceImages = []) {
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

    // 構建 parts 陣列
    const parts = [{ text: prompt }];

    // 如果有參考圖片，加入到 parts 中（支援多張）
    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach(imgObj => {
            // 提取 base64 數據（移除 data:image/xxx;base64, 前綴）
            const base64Data = imgObj.data.split(',')[1];
            const mimeType = imgObj.data.split(';')[0].split(':')[1];

            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        });
    }

    const requestBody = {
        contents: [{
            parts: parts
        }],
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        }
    };

    // 如果提供種子值（用於維持風格一致性）
    if (seed !== null) {
        requestBody.generationConfig.seed = seed;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '生成失敗');
        }
        
        const data = await response.json();
        
        // 提取圖片數據
        if (data.candidates && data.candidates[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            
            // 尋找圖片部分
            for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    return {
                        success: true,
                        imageData: part.inlineData.data,
                        mimeType: part.inlineData.mimeType
                    };
                }
            }
        }
        
        throw new Error('API 回應中未找到圖片數據');
        
    } catch (error) {
        console.error('API 呼叫失敗:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 生成投影片提示詞
function generateSlidePrompt(slideNumber, topic, styleGuide, layoutTemplate, hasReferenceImage = false, sizeConfig = null) {
    const orientationText = sizeConfig ? sizeConfig.orientation : 'landscape';
    const aspectRatioText = sizeConfig ? sizeConfig.aspectRatio : '16:9';

    let prompt = `Create a professional presentation slide image.

SLIDE NUMBER: ${slideNumber}
TOPIC: ${topic}

STYLE GUIDE:
${styleGuide}

LAYOUT INSTRUCTIONS:
${layoutTemplate}

IMPORTANT REQUIREMENTS:
1. Generate a complete, ready-to-use presentation slide as a high-quality image
2. Use the specified color palette and typography from the style guide
3. Follow the layout structure defined in the template
4. Include appropriate visual elements (illustrations, icons, graphics)
5. Ensure the design is professional, clean, and visually appealing
6. Maintain consistency with previous slides in the series
7. Create in ${orientationText} orientation (${aspectRatioText} aspect ratio)
8. Use minimal text - focus on visual storytelling
9. Include slide number in top corner`;

    // 如果有參考圖片，加入相關指示
    if (hasReferenceImage) {
        prompt += `
10. PRODUCT IMAGES PROVIDED: The attached images show the ACTUAL PRODUCTS that must appear in this slide. You MUST use these exact products/items in your design - do not replace them with similar items or illustrations. These are the main subject matter of the presentation and should be prominently featured. Maintain the product's appearance, shape, colors, and details exactly as shown in the images.`;
    }

    prompt += `\n\nGenerate this as a complete slide image, not individual elements.`;

    return prompt;
}

// 根據投影片數量智能判斷 API 層級並調整延遲
function getDelayForSlideCount(slideCount) {
    // 根據用戶選擇的投影片數量推測其 API 層級
    if (slideCount <= 15) {
        // Free tier: 2 RPM = 30 秒/張
        return { delay: 30000, tier: 'Free', rpm: 2 };
    } else if (slideCount <= 30) {
        // Tier 1: 10 RPM = 6 秒/張
        return { delay: 6000, tier: 'Tier 1', rpm: 10 };
    } else {
        // Tier 2+: 30 RPM = 2 秒/張
        return { delay: 2000, tier: 'Tier 2+', rpm: 30 };
    }
}

// 停止生成函數
function stopGeneration() {
    shouldStop = true;
    showMessage('正在停止生成...', 'warning');
}

// 主要生成函數
async function generatePresentation() {
    // 獲取輸入值
    const apiKey = document.getElementById('apiKey').value.trim();
    const topic = document.getElementById('topic').value.trim();
    const slideCount = parseInt(document.getElementById('slideCount').value);
    const styleGuide = document.getElementById('styleGuide').value.trim();
    const layoutTemplate = document.getElementById('layoutTemplate').value.trim();
    const selectedSize = document.getElementById('presentationSize').value;
    const sizeConfig = PRESENTATION_SIZES[selectedSize];

    // 驗證輸入
    if (!apiKey) {
        showMessage('請輸入 Google Cloud API Key', 'error');
        return;
    }

    if (!topic) {
        showMessage('請輸入簡報主題', 'error');
        return;
    }

    if (!styleGuide) {
        showMessage('請輸入整體風格設計', 'warning');
    }

    // 清空之前的結果
    generatedImages = [];
    currentSlideData = [];
    isGenerating = true;
    shouldStop = false;
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('slideResults').innerHTML = '';

    // 禁用生成按鈕，顯示停止按鈕
    const generateBtn = document.getElementById('generateBtn');
    const stopBtn = document.getElementById('stopBtn');
    generateBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    
    showMessage(`開始生成 ${slideCount} 張投影片，這可能需要數分鐘時間...`, 'info');
    
    // 根據投影片數量智能判斷層級和延遲
    const apiConfig = getDelayForSlideCount(slideCount);
    const estimatedMinutes = Math.ceil((slideCount * apiConfig.delay) / 60000);
    
    showMessage(
        `檢測到 API 層級：${apiConfig.tier} (${apiConfig.rpm} RPM)，` +
        `預估生成時間：約 ${estimatedMinutes} 分鐘`,
        'info'
    );
    
    // 使用固定種子確保風格一致性
    const masterSeed = Math.floor(Math.random() * 1000000);
    
    try {
        for (let i = 1; i <= slideCount; i++) {
            // 檢查是否需要停止
            if (shouldStop) {
                showMessage(`已停止生成。已完成 ${i - 1} 張投影片。`, 'warning');
                break;
            }

            updateProgress(i, slideCount);

            // 生成提示詞（包含尺寸資訊）
            const prompt = generateSlidePrompt(i, topic, styleGuide, layoutTemplate, referenceImageData.length > 0, sizeConfig);

            // 呼叫 API（使用相同種子維持一致性，並傳遞所有參考圖片）
            const result = await callGeminiAPI(prompt, apiKey, masterSeed, referenceImageData);

            if (result.success) {
                // 儲存圖片數據（包含尺寸資訊）
                generatedImages.push({
                    slideNumber: i,
                    imageData: result.imageData,
                    mimeType: result.mimeType,
                    dataUrl: `data:${result.mimeType};base64,${result.imageData}`,
                    sizeConfig: sizeConfig
                });

                currentSlideData.push({
                    slideNumber: i,
                    title: `投影片 ${i}`,
                    notes: `主題：${topic}`
                });

                // 顯示預覽
                displaySlidePreview(generatedImages[generatedImages.length - 1]);

            } else {
                throw new Error(`投影片 ${i} 生成失敗: ${result.error}`);
            }

            // API 限流：根據投影片數量動態調整延遲
            if (i < slideCount && !shouldStop) {
                await new Promise(resolve => setTimeout(resolve, apiConfig.delay));
            }
        }

        if (!shouldStop) {
            updateProgress(slideCount, slideCount, '✓ 所有投影片生成完成！');
            showMessage(`成功生成 ${slideCount} 張投影片！點擊「下載 PDF」取得簡報檔案。`, 'success');
        }

    } catch (error) {
        showMessage(`生成失敗: ${error.message}`, 'error');
        console.error('生成錯誤:', error);
    } finally {
        // 恢復按鈕
        isGenerating = false;
        shouldStop = false;
        generateBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }
}

// 顯示投影片預覽
function displaySlidePreview(imageData) {
    const resultsSection = document.getElementById('resultsSection');
    const slideResults = document.getElementById('slideResults');
    
    resultsSection.classList.remove('hidden');
    
    const slideElement = document.createElement('div');
    slideElement.className = 'slide-preview bg-white rounded-lg p-3 border border-slate-200';
    slideElement.innerHTML = `
        <img src="${imageData.dataUrl}" alt="投影片 ${imageData.slideNumber}" 
             class="w-full h-auto rounded-md mb-2 shadow-sm">
        <div class="text-sm text-slate-600 text-center">
            投影片 ${imageData.slideNumber}
        </div>
    `;
    
    slideResults.appendChild(slideElement);
}

// 下載為 PDF
async function downloadAll() {
    if (generatedImages.length === 0) {
        showMessage('沒有可下載的投影片', 'warning');
        return;
    }

    try {
        showMessage('正在組裝 PDF 檔案...', 'info');

        const { jsPDF } = window.jspdf;

        // 取得第一張投影片的尺寸配置
        const sizeConfig = generatedImages[0].sizeConfig || PRESENTATION_SIZES['16:9'];

        // 建立 PDF（根據選擇的尺寸）
        const pdf = new jsPDF({
            orientation: sizeConfig.orientation,
            unit: 'mm',
            format: [sizeConfig.width, sizeConfig.height]
        });

        // 添加每一張投影片
        for (let i = 0; i < generatedImages.length; i++) {
            const imageData = generatedImages[i];
            const slideSize = imageData.sizeConfig || sizeConfig;

            // 如果不是第一張，新增頁面
            if (i > 0) {
                pdf.addPage([slideSize.width, slideSize.height], slideSize.orientation);
            }

            // 添加圖片 (填滿整個頁面)
            pdf.addImage(
                imageData.dataUrl,
                'JPEG',
                0,
                0,
                slideSize.width,
                slideSize.height,
                undefined,
                'FAST'
            );
        }

        // 生成檔案名稱（包含尺寸資訊）
        const sizeName = sizeConfig.aspectRatio.replace(/[:\s]/g, '_');
        const fileName = `${document.getElementById('topic').value.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_')}_${sizeName}_${Date.now()}.pdf`;

        // 下載
        pdf.save(fileName);

        showMessage(`✓ 簡報已下載：${fileName}（${sizeConfig.name}）`, 'success');

    } catch (error) {
        showMessage(`下載失敗: ${error.message}`, 'error');
        console.error('下載錯誤:', error);
    }
}

// 錯誤處理
window.addEventListener('error', (event) => {
    console.error('全域錯誤:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未處理的 Promise 拒絕:', event.reason);
});