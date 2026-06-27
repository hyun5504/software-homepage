let softwareCount = 0;
let aiBigDataCount = 0;
let finalMajorText = "";
let imageUrl = "";

// 카드 클릭 시 내부 체크박스 토글 함수
function toggleCard(cardElement) {
    const checkbox = cardElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    if(checkbox.checked) {
        cardElement.classList.add('checked-active');
    } else {
        cardElement.classList.remove('checked-active');
    }
}

// 체크박스 자체 클릭 시 카드 스타일 유지 보정 함수
function checkCard(checkboxElement) {
    const card = checkboxElement.closest('.question-item');
    if(checkboxElement.checked) {
        card.classList.add('checked-active');
    } else {
        card.classList.remove('checked-active');
    }
}

// [1단계: 과목 추천 박스 노출 + 부드러운 자동 스크롤]
document.getElementById('recommend-btn').addEventListener('click', function() {
    const checkedBoxes = document.querySelectorAll('input[name="interest"]:checked');
    
    if (checkedBoxes.length === 0) {
        alert("당신의 관심사를 한 개 이상 선택해 주세요!");
        return;
    }

    let softwareSubjects = [];
    let aiBigDataSubjects = [];
    softwareCount = 0;
    aiBigDataCount = 0;

    checkedBoxes.forEach(box => {
        const subjectName = box.value;
        const track = box.getAttribute('data-track');

        if (track === 'se') {
            softwareSubjects.push(`'${subjectName}'`);
            softwareCount++;
        } else if (track === 'ai') {
            aiBigDataSubjects.push(`'${subjectName}'`);
            aiBigDataCount++;
        }
    });

    let subjectsResultHTML = "";
    if (softwareSubjects.length > 0) {
        subjectsResultHTML += `<div><strong>💻 컴퓨터소프트웨어학과전공 추천과목:</strong><br>${softwareSubjects.join(', ')}</div>`;
    }
    if (aiBigDataSubjects.length > 0) {
        if (softwareSubjects.length > 0) subjectsResultHTML += "<div style='margin-top:12px;'></div>"; 
        subjectsResultHTML += `<div><strong>🤖 AI/빅데이터전공 추천과목:</strong><br>${aiBigDataSubjects.join(', ')}</div>`;
    }
    document.getElementById('recommended-subjects').innerHTML = subjectsResultHTML;

    // 초기화 리셋
    document.getElementById('final-major-area').style.display = "none";
    
    // 버튼 영역 높이 유지하며 노출 세팅
    const revealBtnWrap = document.getElementById('reveal-btn-wrap');
    revealBtnWrap.style.removeAttribute ? revealBtnWrap.style.removeAttribute('display') : revealBtnWrap.style.display = "block";
    document.getElementById('reveal-major-btn').style.opacity = "1";
    document.getElementById('reveal-major-btn').disabled = false;
    
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('slide-up-active');
    void resultContainer.offsetWidth; 
    resultContainer.classList.add('slide-up-active');

    // 1단계 과목 추천 박스 위치로 부드럽게 스크롤 다운
    setTimeout(() => {
        const targetOffset = resultContainer.getBoundingClientRect().top + window.pageYOffset - 40;
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });
    }, 200);
});

// [2단계: 최종 전공 결과 박스 노출 + 스크롤 고정 오작동 방지]
document.getElementById('reveal-major-btn').addEventListener('click', function() {
    
    const banner = document.getElementById('major-banner');
    
    if (softwareCount > aiBigDataCount) {
        finalMajorText = "최종 추천: <span class='highlight-major' style='color:#3182f6;'>컴퓨터소프트웨어학과전공</span>";
        imageUrl = "assets/images/comsoft_theme.png";
        banner.style.background = "#3182f6"; 
    } else if (aiBigDataCount > softwareCount) {
        finalMajorText = "최종 추천: <span class='highlight-major' style='color:#8b5cf6;'>AI/빅데이터전공</span>";
        imageUrl = "assets/images/AIbig_theme.png";
        banner.style.background = "#8b5cf6"; 
    } else {
        finalMajorText = "최종 추천: <span class='highlight-major' style='color:#10b981;'>융합형 소프트웨어 인재</span>";
        imageUrl = "assets/images/collabor_theme.png";
        banner.style.background = "#10b981"; 
    }

    document.getElementById('recommended-major').innerHTML = finalMajorText;
    const majorImg = document.getElementById('major-image');
    majorImg.src = imageUrl;
    majorImg.style.display = "block";

    // 버튼의 투명도를 낮추어 레이아웃이 무너지며 위로 튀는 현상 방지
    this.style.opacity = "0.2";
    this.disabled = true;
    
    const finalArea = document.getElementById('final-major-area');
    finalArea.classList.remove('slide-up-active');
    void finalArea.offsetWidth; 
    finalArea.classList.add('slide-up-active');

    // 새로 생겨난 최종 리포트 카드 위치로 안정적으로 부드럽게 스크롤 다운
    setTimeout(() => {
        const targetOffset = finalArea.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });
    }, 200);

    // 상단 고정 다마고치 이미지 변경 연동 구역
    if (typeof updateTamagochiImage === 'function') {
        updateTamagochiImage(2); 
    } else {
        document.getElementById('tamagochi-image').src = "assets/tamagochi/laptop_scone.png";
    }
});