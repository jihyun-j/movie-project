
function saveReviewWithMovieId() {
    const reviewKey = comment;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;
    const time = new Date().toLocaleString();;


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
            name: name,
            password: password,
            content: content,
            time: time
        };
        Comment.push(newComment);

        localStorage.setItem(reviewKey, JSON.stringify(Comment));
        showComments();
    }

}
function showComments() {
    let newReview = JSON.parse(localStorage.getItem(comment) || '[]');;
    let reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';
    
    newReview.forEach(function (Comment, index) {
        let addComment = document.createElement('div');
        addComment.className = 'listview';
        addComment.innerHTML = `            <div class="top1">
        <div style="flex-grow: 1"><strong>${Comment.name}</strong></div>
        <div style="flex-grow: 5">(${Comment.time})</div>
        <div class="dropdown">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M456 231a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 280a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 280a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"></path></svg>
            <div class="dropdown-content">
                <button class="editComment" onclick="editComment(${index})">수정</button>
                <button class="deleteComment" onclick="deleteComment(${index})">삭제</button>
            </div>
            </div> 
    </div>
    <div class="btb1">${Comment.내용}</div>`

        reviewList.appendChild(addComment);
    });
}
function deleteComment(index) {
    let reviewKey = 댓글;
    let Comment = JSON.parse(localStorage.getItem(reviewKey)) || [];
    let password = prompt('비번입력하세여');
    if (password === Comment[index].비밀번호) {
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
        Comment[index].name= edComment ;
        Comment[index].password= edPassword ;
        Comment[index].content= content ;

        localStorage.setItem(reviewKey, JSON.stringify(Comment));
        alert('수정 완료 !')
        showComments();
    }
    else alert('비밀번호 입력해야 수정할수 있어요 !')

}

// showComments();
