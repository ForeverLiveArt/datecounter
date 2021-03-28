function acronym(namestring) {
    let matches = namestring.match(/\b(\w)/g); // ['J','S','O','N']
    let acronys = matches.join(''); // JSON
    return acronys;
}

async function navbarlogin() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            empty: 'empty'
        })
    };
    const response = await fetch('/logged', options);
    const answer = await response.json();
    console.log(answer);

    if (answer.isLogged == 'true') {
        console.log(answer.isLogged);
        $("#logins_mobile, #logins").empty();
        $("#logins_mobile").append(` 
                            <div class="user-avatar lg-avatar mr-4">
                                <img src="' + answer.user.picture + '"
                                class="card-img-top rounded-circle border-white" alt="` + answer.user.name + `">
                            </div>
                            <h2 class="h6">` + answer.user.name + `</h2>
                            <a href="/logout" class="btn btn-secondary text-dark btn-xs">
                                <span class="mr-2"><span class="fas fa-sign-out-alt"></span></span>
                                Выйти
                            </a>
                            `);
        $("#logins").append(`           
                            <img class="user-avatar md-avatar rounded-circle" style="background-color:#b6b6b6!important" 
                            alt=""
                            src="` + answer.user.picture + `">
                            <div class="media-body ml-2 text-dark align-items-center d-none d-lg-block">
                                <span class="mb-0 font-small font-weight-bold">` + answer.user.name + `</span>
                            </div>
                          `);
        $("#logins_container").css('display', 'flex');
        $("#wellcome").css('display', 'none');            
        $("#banks").append(`                           
                            <div class="media-body ml-2 text-dark align-items-center d-none d-lg-block">
                                <span class="mb-0 font-small font-weight-bold">Баланс ` + answer.bank + ` USD</span>
                            </div>
                      `);
        $("#banks_container").css('visibility', 'visible');
    } else {
        console.log(answer.isLogged);
        $("#logins_container, banks_container").css('display', 'none');
        $("#wellcome").css('display', 'flex');
        $("#logins_mobile, #logins, #banks").empty();
        

    }
}
window.onload = navbarlogin();