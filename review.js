movieInfo
console.log(movieInfo);

function saveReview() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;
    const 작성시간 = new Date().toLocaleString();


    let 댓글 = JSON.parse(localStorage.getItem('리뷰') || '[]');

    let 입력된댓글 = document.getElementById('content').value;

    if (!입력된댓글) {
        alert('작성창이 빈칸이에요!');
    } else if (입력된댓글.length > 100) {
        alert('100글자 이하 입력해주세요!');
    } else {
        let newComment = {
            작성자: name,
            비밀번호: password,
            내용: content,
            작성시간: 작성시간
        };
        댓글.push(newComment);

        localStorage.setItem('리뷰', JSON.stringify(댓글));
        showComments();
    }

}
function showComments() {
    let 새로운리뷰 = JSON.parse(localStorage.getItem('리뷰') || '[]');
    let 리뷰리스트 = document.getElementById('reviewList');
    리뷰리스트.innerHTML = '';

    새로운리뷰.forEach(function (댓글, index) {
        let 추가된리뷰 = document.createElement('div');
        추가된리뷰.className = 'listview';
        추가된리뷰.innerHTML = `            <div class="top1">
        <div style="flex-grow: 1"><strong>${댓글.작성자}</strong></div>
        <div style="flex-grow: 5">(${댓글.작성시간})</div>
        <div class="dropdown">
            <span class="material-symbols-outlined dropBtn">more_vert</span>
            <div class="dropdown-content">
                <button class="editComment" onclick="editComment(${index})">수정</button>
                <button class="deleteComment" onclick="deleteComment(${index})">삭제</button>
            </div>
            </div> 
    </div>
    <div class="btb1">${댓글.내용}</div>`

        리뷰리스트.appendChild(추가된리뷰);
    });
}
function deleteComment(index) {
    let 댓글 = JSON.parse(localStorage.getItem('리뷰')) || [];
    let 비번 = prompt('비번입력하세여');
    if(비번=== 댓글[index].비밀번호){
    댓글.splice(index, 1);
    localStorage.setItem('리뷰', JSON.stringify(댓글));
    alert('삭제 완료 !')
    showComments();}
    else alert('비밀번호 입력해야 지울수 있어요 !')
}

showComments();