/* ===================================================
   🤖 CYBER TAMAGOTCHI EVO-ENGINE (2단계 말풍선 힌트 추가 버전)
   =================================================== */

// 1. 다마고치 상태 전역 정의
const tamagotchi = {
    level: parseInt(localStorage.getItem('tamagotchiLevel')) || 0, 
    images: {
        0: 'assets/tamagochi/egg.png',          // 0단계: 알 모양
        1: 'assets/tamagochi/crack.png',       // 1단계: 최종 전공 결과 오픈
        2: 'assets/tamagochi/broken.png',       // 2단계: Q&A 질문 클릭
        3: 'assets/tamagochi/skon.png'        // 3단계: 파이널 퀴즈 정답 (최종)
    }
};

// 🗺️ [신규 프리셋] 2단계 달성 시 출력할 사이버 말풍선 HTML template
const SPEECH_BUBBLE_HTML = `
    <div id="tamagotchi-speech-bubble" class="cyber-bubble">
        ⚡ <b> Final Quiz </b><br>
        나를 클릭해서 파이널 퀴즈를 해제해줘!
    </div>
`;

// 2. 다마고치 이미지 및 UI 새로고침 함수 (말풍선 레이아웃 버그 수정본)
function renderTamagotchi() {
    const imgElement = document.getElementById('tamagochi-image');
    const container = document.getElementById('tamagochi-fixed-container');
    
    if (imgElement && tamagotchi.images[tamagotchi.level]) {
        imgElement.src = tamagotchi.images[tamagotchi.level];
        imgElement.style.display = "block";
    }
    if (container) {
        container.style.display = "flex"; 
        
        // 💬 [말풍선 핸들러] 다마고치 박스 내부가 아닌, body에 독립적으로 생성합니다.
        let existingBubble = document.getElementById('tamagotchi-speech-bubble');
        if (tamagotchi.level === 2) {
            if (!existingBubble) {
                // 🎯 컨테이너 내부가 아닌 body 맨 뒤에 붙여 레이아웃 붕괴를 원천 차단합니다.
                document.body.insertAdjacentHTML('beforeend', SPEECH_BUBBLE_HTML);
                
                setTimeout(() => {
                    const bubble = document.getElementById('tamagotchi-speech-bubble');
                    if (bubble) bubble.classList.add('show');
                }, 50);
            }
        } else {
            if (existingBubble) {
                existingBubble.remove();
            }
        }
    }
    console.log(`[Tamagotchi] 현재 렌더링 단계: ${tamagotchi.level}단계`);
}

// 3. 진화 단계 변경 함수
function evolveTo(nextLevel) {
    if (tamagotchi.level >= nextLevel) {
        renderTamagotchi();
        return; 
    }

    if (nextLevel === tamagotchi.level + 1) {
        tamagotchi.level = nextLevel;
        localStorage.setItem('tamagotchiLevel', tamagotchi.level);
        renderTamagotchi();
        
        // 사이버네틱 발광 이펙트
        const container = document.getElementById('tamagochi-fixed-container');
        if (container) {
            container.style.transform = 'scale(1.2) rotate(8deg)';
            container.style.borderColor = '#00f0ff';
            container.style.boxShadow = '0 0 40px #00f0ff';
            
            setTimeout(() => {
                container.style.transform = '';
                container.style.borderColor = tamagotchi.level === 3 ? '#ff007a' : '#bc52ff';
                container.style.boxShadow = '';
            }, 600);
        }
    }
}

// 4. 3단계 진화를 위한 파이널 퀴즈 시스템
function triggerFinalQuiz() {
    if (document.getElementById('cyber-quiz-modal') || tamagotchi.level === 3) return;

    const modalHtml = `
        <div id="cyber-quiz-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(3,5,16,0.9); backdrop-filter:blur(10px); z-index:9999; display:flex; justify-content:center; align-items:center;">
            <div style="background:#080c1c; border:2px solid #ff007a; box-shadow:0 0 35px rgba(255,0,122,0.4); padding:40px; border-radius:24px; max-width:450px; width:90%; text-align:center; font-family:'Noto Sans KR', sans-serif; color:#f8fafc;">
                <h3 style="font-family:'Orbitron', sans-serif; color:#ff007a; margin-top:0; font-size:1.5rem; letter-spacing:1px;">⚠️ FINAL CORE QUIZ</h3>
                <p style="color:#94a3b8; font-size:0.95rem; margin-bottom:25px;">다마고치를 최종 각성시키기 위한 보안 퀴즈입니다.</p>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:20px; border-radius:16px; margin-bottom:25px; text-align:left; line-height:1.6;">
                    <strong>Q. 다음 중 인공지능(AI)이 대량의 데이터를 스스로 학습하여 규칙을 찾아내는 기술을 뜻하는 용어는 무엇일까요?</strong>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <button class="quiz-opt" onclick="checkQuizAnswer(false)" style="background:#131424; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:14px; border-radius:12px; cursor:pointer; font-weight:600; transition:0.2s;">1) HTML5 웹 퍼블리싱</button>
                    <button class="quiz-opt" onclick="checkQuizAnswer(true)" style="background:#131424; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:14px; border-radius:12px; cursor:pointer; font-weight:600; transition:0.2s;">2) 머신러닝 / 딥러닝</button>
                    <button class="quiz-opt" onclick="checkQuizAnswer(false)" style="background:#131424; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:14px; border-radius:12px; cursor:pointer; font-weight:600; transition:0.2s;">3) 하드웨어 조립 프로세스</button>
                </div>
                <button onclick="closeQuizModal()" style="margin-top:25px; background:transparent; color:#64748b; border:none; cursor:pointer; font-size:0.9rem; text-decoration:underline;">닫기</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const buttons = document.querySelectorAll('.quiz-opt');
    buttons.forEach(btn => {
        btn.addEventListener('mouseover', () => { btn.style.background = '#ff007a'; btn.style.color = '#fff'; });
        btn.addEventListener('mouseout', () => { btn.style.background = '#131424'; btn.style.color = '#cbd5e1'; });
    });
}

function checkQuizAnswer(isCorrect) {
    if (isCorrect) {
        alert("🎉 정답입니다! 보안 코드가 해제되어 다마고치가 [3단계: 최종 진화형]으로 각성했습니다!");
        closeQuizModal();
        evolveTo(3); 
    } else {
        alert("❌ 오답입니다! 코어 학습 시스템이 응답하지 않습니다. 다시 시도해 주세요.");
    }
}

function closeQuizModal() {
    const modal = document.getElementById('cyber-quiz-modal');
    if (modal) modal.remove();
}


/* ===================================================
   🎵 각 기능별 이벤트 리스너 연동 (더블 진화 버그 수정 버전)
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
    renderTamagotchi();

    // 🎯 [트리거 1] 수강과목 페이지: 최종 전공 결과 리포트 열기 버튼 누를 때
    const revealMajorBtn = document.getElementById('reveal-major-btn');
    if (revealMajorBtn) {
        revealMajorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 이미 이 페이지에서 진화 도장을 찍었다면 작동 안 함
            if (localStorage.getItem('done_reveal_major')) {
                renderTamagotchi();
                return;
            }
            
            // 도장이 없고, 아직 2단계 미만일 때 딱 한 단계만 진화
            if (tamagotchi.level < 2) {
                localStorage.setItem('done_reveal_major', 'true'); // 도장 쾅!
                evolveTo(tamagotchi.level + 1);
            }
        });
    }

    // 🎯 [트리거 2] Q&A 페이지: 질문 리스트 클릭 시
    const qnaItems = document.querySelectorAll('.qna-item, .faq-item, .question-box, .question-btn'); 
    if (qnaItems.length > 0) {
        qnaItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 🔥 중요: 부모/자식 요소가 겹쳐서 여러 번 실행되는 버그를 원천 차단
                e.stopPropagation(); 
                e.stopImmediatePropagation(); 
                
                // 이미 Q&A 페이지에서 진화 도장을 찍었다면 더 이상 아무것도 안 함!
                if (localStorage.getItem('done_qna_click')) {
                    renderTamagotchi();
                    return; 
                }
                
                // 도장이 없고, 아직 2단계 미만일 때 딱 한 단계만 진화 후 '즉시 종료'
                if (tamagotchi.level < 2) {
                    localStorage.setItem('done_qna_click', 'true'); // 도장 쾅!
                    evolveTo(tamagotchi.level + 1);
                }
            });
        });
    }

    // 🎯 [트리거 3] 다마고치 위젯 클릭 시 퀴즈 개시 (3단계 진화)
    const tamagotchiWidget = document.getElementById('tamagochi-fixed-container');
    if (tamagotchiWidget) {
        tamagotchiWidget.style.cursor = 'pointer';
        tamagotchiWidget.addEventListener('click', () => {
            if (tamagotchi.level === 2) {
                triggerFinalQuiz();
            } else if (tamagotchi.level < 2) {
                alert(`⚠️ 다마고치의 지식이 아직 부족하여 보안 퀴즈 시스템이 잠겨있습니다.\n(현재 단계: ${tamagotchi.level}단계 / 요구 단계: 2단계)\n\n💡 힌트: Q&A와 수강과목 추천 시스템을 모두 한 번씩 완료하세요!`);
                renderTamagotchi(); 
            } else if (tamagotchi.level === 3) {
                alert("🚀 다마고치가 이미 최고 단계(3단계)까지 완벽하게 진화를 마쳤습니다!");
            }
        });
    }
});

// 🛠️ [핵심 방어 코드] 이미지 수정 감시 옵저버
const tamagochiImageObserver = document.getElementById('tamagochi-image');
if (tamagochiImageObserver) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'src') {
                const currentSrc = tamagochiImageObserver.getAttribute('src');
                const targetSrc = tamagotchi.images[tamagotchi.level];
                if (currentSrc !== targetSrc && targetSrc) {
                    tamagochiImageObserver.src = targetSrc;
                }
            }
        });
    });
    observer.observe(tamagochiImageObserver, { attributes: true });
}

/* ===================================================
   🔄 CYBER TAMAGOTCHI RESET SYSTEM (초기화 엔진 수정)
   =================================================== */
function resetTamagotchi() {
    if (confirm("⚠️ 코어 데이터 초기화: 다마고치를 정말 알(0단계) 상태로 되돌리시겠습니까?")) {
        // 🎯 추가된 페이지별 잠금장치 기록도 같이 깨끗하게 지워줍니다.
        localStorage.removeItem('tamagotchiLevel');
        localStorage.removeItem('done_reveal_major');
        localStorage.removeItem('done_qna_click');
        tamagotchi.level = 0;
        window.location.reload();
    }
}