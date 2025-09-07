// 관리자 페이지 스크립트
const ADMIN_PASSWORD = 'admin1234';

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    checkLoginStatus();
    
    // 로그인 폼 처리
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterApplications(this.value);
        });
    }
});

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    }
}

function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadApplications();
}

function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('cruiseApplications') || '[]');
    const tbody = document.getElementById('applicationsBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    // 통계 업데이트
    document.getElementById('totalCount').textContent = applications.length;
    document.getElementById('videoCount').textContent = applications.filter(app => app.videoFileName).length;
    
    if (applications.length === 0) {
        tbody.innerHTML = '';
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    // 테이블에 데이터 표시
    tbody.innerHTML = applications.map((app, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${app.studentId}</td>
            <td>${app.name}</td>
            <td>${app.pptFileName || '-'}</td>
            <td>${app.videoFileName || '미제출'}</td>
            <td>${app.submittedAt}</td>
            <td>
                <button onclick="deleteApplication('${app.id}')" class="delete-btn">삭제</button>
            </td>
        </tr>
    `).join('');
}

function filterApplications(searchTerm) {
    const applications = JSON.parse(localStorage.getItem('cruiseApplications') || '[]');
    const filtered = applications.filter(app => 
        app.studentId.includes(searchTerm) || 
        app.name.includes(searchTerm)
    );
    
    const tbody = document.getElementById('applicationsBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        noDataMessage.style.display = 'block';
        noDataMessage.textContent = '검색 결과가 없습니다.';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    tbody.innerHTML = filtered.map((app, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${app.studentId}</td>
            <td>${app.name}</td>
            <td>${app.pptFileName || '-'}</td>
            <td>${app.videoFileName || '미제출'}</td>
            <td>${app.submittedAt}</td>
            <td>
                <button onclick="deleteApplication('${app.id}')" class="delete-btn">삭제</button>
            </td>
        </tr>
    `).join('');
}

function deleteApplication(id) {
    if (!confirm('이 신청을 삭제하시겠습니까?')) return;
    
    let applications = JSON.parse(localStorage.getItem('cruiseApplications') || '[]');
    applications = applications.filter(app => app.id !== id);
    localStorage.setItem('cruiseApplications', JSON.stringify(applications));
    loadApplications();
}

function clearAllData() {
    localStorage.removeItem('cruiseApplications');
    loadApplications();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadApplications();
}

function exportToCSV() {
    const applications = JSON.parse(localStorage.getItem('cruiseApplications') || '[]');
    
    if (applications.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    // CSV 헤더
    let csv = '\uFEFF'; // BOM for UTF-8
    csv += '번호,학번,이름,PPT파일,영상파일,신청일시\n';
    
    // 데이터 추가
    applications.forEach((app, index) => {
        csv += `${index + 1},${app.studentId},${app.name},${app.pptFileName || '-'},${app.videoFileName || '미제출'},${app.submittedAt}\n`;
    });
    
    // 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `크루즈해커톤_신청현황_${new Date().toLocaleDateString('ko-KR')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}