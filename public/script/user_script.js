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
      $("#logins_mobile").append(
          '<div class="user-avatar lg-avatar mr-4">' +
          '<img src="' + answer.user.picture + '"' +
          'class="card-img-top rounded-circle border-white" alt="' + answer.user.name + '">' +
          '</div>' +
          '<h2 class="h6">Здравствуйте, ' + answer.user.name + '</h2>' +
          '<a href="/logout"' +
          'class="btn btn-secondary text-dark btn-xs">' +
          '<span class="mr-2"><span class="fas fa-sign-out-alt"></span></span>' +
          'Выйти' +
          '</a>'
      );
      $("#logins").append(`           
                          <li class="nav-item dropdown">
                              <a class="nav-link pt-1 px-0" href="#" role="button" data-bs-toggle="dropdown"
                                  aria-haspopup="true" aria-expanded="false">
                                  <div class="media d-flex align-items-center" >
                                      <img class="user-avatar md-avatar rounded-circle" style="background-color:#b6b6b6!important" 
                                      alt=""
                                          src="` + answer.user.picture + `">
                                      <div class="media-body ml-2 text-dark align-items-center d-none d-lg-block">
                                          <span class="mb-0 font-small font-weight-bold">` + answer.user.name + `</span>
                                      </div>
                                  </div>
                              </a>
                              <div class="dropdown-menu dashboard-dropdown dropdown-menu-right mt-2">
                                  <a class="dropdown-item font-weight-bold" href="/profile"><span
                                          class="far fa-user-circle"></span>Мой профиль</a>
                                  <a class="dropdown-item font-weight-bold" href="/support"><span
                                          class="fas fa-user-shield"></span>Поддержка</a>
                                  <div role="separator" class="dropdown-divider"></div>
                                  <a class="dropdown-item font-weight-bold" href="/logout"><span
                                          class="fas fa-sign-out-alt text-danger"></span>Выйти</a>
                              </div>
                          </li>
                          `);
  $("#banks").append(`
                      <li class="nav-item dropdown">
                              <a class="nav-link pt-1 px-0" href="#" role="button" data-bs-toggle="dropdown"
                                  aria-haspopup="true" aria-expanded="false">
                                  <div class="media d-flex align-items-center" >
                                      
                                      <div class="media-body ml-2 text-dark align-items-center d-none d-lg-block">
                                          <span class="mb-0 font-small font-weight-bold">На вашем счету ` + answer.bank + ` USD</span>
                                      </div>
                                  </div>
                              </a>
                              <div class="dropdown-menu dashboard-dropdown dropdown-menu-right mt-2">
                                  <a class="dropdown-item font-weight-bold" href="/profile"><span
                                          class="far fa-user-circle"></span>Пополнить баланс</a>
                                  <a class="dropdown-item font-weight-bold" href="/support"><span
                                          class="fas fa-user-shield"></span>История платежей</a>
                              </div>
                          </li>
                      `);                        

  } else {
      console.log(answer.isLogged);
      $("#logins_mobile, #logins, #banks").empty();
      $("#logins_mobile, #logins").append(
          '<div>' +
          '<h2 class="h6">Здравствуйте, гость</h2>' +
          '<a href="/login"' +
          'class="btn btn-secondary text-dark btn-xs">' +
          '<span class="mr-2"><span class="fas fa-sign-out-alt"></span></span>' +
          'Войти' +
          '</a></div>'
      );
  }
}
window.onload = navbarlogin();