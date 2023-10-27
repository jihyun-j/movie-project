window.onload = function () {
    loadComments();
};

function saveReviewWithMovieId() {
    const reviewKey = 댓글;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;
    const 작성시간 = new Date().toLocaleString();;


    let Comment = JSON.parse(localStorage.getItem(reviewKey) || '[]');

    let add3 = document.getElementById('content').value;
    let add2 = document.getElementById('password').value;
    let add1 = document.getElementById('name').value;
    if (!add1||!add2||!add3) {
        alert('작성창이 빈칸이에요!');
    } else if (add1.length < 1 ||add2.length <3||add3.length <3) {
        alert('닉네임 2글자이상 패스워드 4글자이상 내용 4글자이상!');
    } else {
        let newComment = {
            작성자: name,
            비밀번호: password,
            내용: content,
            작성시간: 작성시간
        };
        Comment.push(newComment);

        localStorage.setItem(reviewKey, JSON.stringify(Comment));
        showComments();
    }

}
function showComments() {
    let 새로운리뷰 = JSON.parse(localStorage.getItem(댓글) || '[]');;
    let 리뷰리스트 = document.getElementById('reviewList');
    리뷰리스트.innerHTML = '';
    
    새로운리뷰.forEach(function (Comment, index) {
        let 추가된리뷰 = document.createElement('div');
        추가된리뷰.className = 'listview';
        추가된리뷰.innerHTML = `            <div class="top1">
        <div style="flex-grow: 1"><strong>${Comment.작성자}</strong></div>
        <div style="flex-grow: 5">(${Comment.작성시간})</div>
        <div class="dropdown">
             <span class="material-symbols-outlined dropBtn">more_vert</span>
            <div class="dropdown-content">
                <button class="editComment" onclick="editComment(${index})">수정</button>
                <button class="deleteComment" onclick="deleteComment(${index})">삭제</button>
            </div>
            </div> 
    </div>
    <div class="btb1">${Comment.내용}</div>`

        리뷰리스트.appendChild(추가된리뷰);
    });
}
function deleteComment(index) {
    let reviewKey = 댓글;
    let Comment = JSON.parse(localStorage.getItem(reviewKey)) || [];
    let 비번 = prompt('비번입력하세여');
    if (비번 === Comment[index].비밀번호) {
        Comment.splice(index,1);
        localStorage.setItem(reviewKey, JSON.stringify(Comment));
        alert('삭제 완료 !')
       
        showComments();
    }
    else alert('비밀번호 입력해야 지울수 있어요 !')
}

function editComment(index){
    let reviewKey = 댓글;
    // let Comment = reviewKey[index];
    let Comment = JSON.parse(localStorage.getItem(reviewKey)) || [];
    let 비번 = prompt('비번입력하세여');
    if (비번 === Comment[index].비밀번호) {
       let edComment= prompt('작성자입력하세여');
       let edPassword= prompt('바꿀비밀번호입력하세용');
       let content= prompt('변경할 내용 입력하세용');
        Comment[index].작성자= edComment ;
        Comment[index].비밀번호= edPassword ;
        Comment[index].내용= content ;

        localStorage.setItem(reviewKey, JSON.stringify(Comment));
        alert('수정 완료 !')
        showComments();
    }
    else alert('비밀번호 입력해야 수정할수 있어요 !')

}

// showComments();
