// 신청서 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const submitMessage = document.getElementById('submitMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = {
                studentId: document.getElementById('studentId').value,
                name: document.getElementById('name').value,
                pptFileName: document.getElementById('pptFile').files[0]?.name || '',
                videoFileName: document.getElementById('videoFile').files[0]?.name || '',
                submittedAt: new Date().toLocaleString('ko-KR'),
                id: Date.now().toString()
            };
            
            // 기존 신청 데이터 가져오기
            let applications = JSON.parse(localStorage.getItem('cruiseApplications') || '[]');
            
            // 중복 신청 확인
            const existingApplication = applications.find(app => app.studentId === formData.studentId);
            if (existingApplication) {
                showMessage('이미 신청하셨습니다. 학번당 1회만 신청 가능합니다.', 'error');
                return;
            }
            
            // 새 신청 추가
            applications.push(formData);
            localStorage.setItem('cruiseApplications', JSON.stringify(applications));
            
            // 성공 메시지 표시
            showMessage('신청이 완료되었습니다. 접수번호: ' + formData.id, 'success');
            
            // 폼 초기화
            form.reset();
        });
    }
    
    function showMessage(message, type) {
        submitMessage.textContent = message;
        submitMessage.className = 'submit-message ' + type;
        submitMessage.style.display = 'block';
        
        // 5초 후 메시지 숨기기
        setTimeout(() => {
            submitMessage.style.display = 'none';
        }, 5000);
    }
    
    // 파일 크기 검증
    const pptFile = document.getElementById('pptFile');
    const videoFile = document.getElementById('videoFile');
    
    if (pptFile) {
        pptFile.addEventListener('change', function() {
            if (this.files[0] && this.files[0].size > 50 * 1024 * 1024) {
                alert('PPT 파일은 50MB 이하만 업로드 가능합니다.');
                this.value = '';
            }
        });
    }
    
    if (videoFile) {
        videoFile.addEventListener('change', function() {
            if (this.files[0] && this.files[0].size > 200 * 1024 * 1024) {
                alert('영상 파일은 200MB 이하만 업로드 가능합니다.');
                this.value = '';
            }
        });
    }
});