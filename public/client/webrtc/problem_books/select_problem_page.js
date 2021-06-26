export function select_problem_page() {
    Vue.component('problem_book-component', {
        template: `
        <div class="problem_data">
            <div class="problem_data_search">
                <input type="text" placeholder="문제 카테고리 검색..." class="search_problem" size="47">
                <i class="fas fa-search" style="
                font-size: 27px;
                margin-top: 5px;
                margin-left: -35px;
                color: #d4d4d4;
                position: absolute;
                "></i>
            </div>
            <div class="recommended_category" style="position: absolute;">
                <p style="color: blue;">#추천 과목 카테고리 #가장 많이 사용하는 카테고리</p>
                <ul>
                    <li>국어</li>
                    <li>수학</li>
                    <li>영어</li>
                    <li>사회</li>
                    <li>과학</li>
                    <li>정보</li>
                </ul>
            </div>
            <div class="search_result" style="position: absolute;">
                <h3 class="search_message">카테고리 검색 결과</h3>
            </div>
            <div class="not_found" style="position: absolute;">
                <h3 class="not_search_message">카테고리 검색 결과가 표시됩니다.</h3> 
            </div>
        </div>
        `
    });

    new Vue({
        el: '#sub_mod'
    });
}